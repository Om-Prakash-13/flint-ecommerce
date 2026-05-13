import database from "../database/db.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import FlintError from "../middlewares/errorMiddleware.js";
import withTransaction from "../utils/withTransaction.js";

export const placeNewOrder = catchAsyncError(async (req, res) => {
  const { shippingInfo, orderItems } = req.body;

  const mergedItems = new Map();

  for (const item of orderItems) {
    const existing = mergedItems.get(item.productId);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      mergedItems.set(
        item.productId,

        {
          ...item,
        },
      );
    }
  }

  const normalizedItems = Array.from(mergedItems.values());

  const total_price = await withTransaction(async (client) => {
    // Fetch products
    const productIds = normalizedItems.map((item) => item.productId);
    const { rows: products } = await client.query(
      `
        SELECT id, name, price, stock, images
        FROM products
        WHERE id = ANY($1::UUID[])
        FOR UPDATE
    `,
      [productIds],
    );

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    // Validation + price calc
    let subtotal = 0;
    const values = [];
    const placeholders = [];

    for (let index = 0; index < normalizedItems.length; index++) {
      const item = normalizedItems[index];

      const product = productMap.get(item.productId);

      if (!product) {
        throw new FlintError(`Product not found.`, 404);
      }

      if (item.quantity > product.stock) {
        throw new FlintError(
          `Only ${product.stock} units are available for ${product.name}.`,
          400,
        );
      }

      subtotal += product.price * item.quantity;

      values.push(
        null,
        product.id,
        item.quantity,
        product.price,
        product.images?.[0]?.url || "",
        product.name,
      );

      const offset = index * 6;
      placeholders.push(
        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`,
      );
    }

    // Price calculation
    const tax_price = Number((subtotal * 0.18).toFixed(2));
    const shipping_price = 2;
    const total_price = Number(
      (subtotal + tax_price + shipping_price).toFixed(2),
    );

    // Insert order
    const orderResult = await client.query(
      `
        INSERT INTO orders(buyer_id, total_price, tax_price, shipping_price)
        VALUES( $1,$2,$3,$4 )
        RETURNING *
     `,
      [req.user.id, total_price, tax_price, shipping_price],
    );
    const orderId = orderResult.rows[0].id;
    // Attach orderId
    for (let i = 0; i < values.length; i += 6) {
      values[i] = orderId;
    }

    // Insert order items
    await client.query(
      `
        INSERT INTO order_items(order_id, product_id, quantity, price, image, title)
        VALUES ${placeholders.join(", ")}
      `,
      values,
    );

    // Insert shipping
    await client.query(
      `
        INSERT INTO shipping_info(order_id, full_name, state, city, country, address, pincode, phone)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        `,
      [
        orderId,
        shippingInfo.full_name,
        shippingInfo.state,
        shippingInfo.city,
        shippingInfo.country,
        shippingInfo.address,
        shippingInfo.pincode,
        shippingInfo.phone,
      ],
    );

    // Update stock ==> do this in the payment verification.

    return total_price;
  });

  return res.status(201).json({
    success: true,
    message: "Order placed successfully. Proceed to payment.",
    total_price,
  });
});

export const fetchSingleOrder = catchAsyncError(async (req, res) => {
  const { orderId } = req.params;

  const isAdmin = req.user.role === "Admin";

  const result = await database.query(
    `
      SELECT o.*,
      COALESCE(
        json_agg(
          json_build_object(
            'order_item_id', oi.id,
            'order_id', oi.order_id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'::json
      ) AS order_items,
      json_build_object(
        'full_name', s.full_name,
        'state', s.state,
        'city', s.city,
        'country', s.country,
        'address', s.address,
        'pincode', s.pincode,
        'phone', s.phone
      ) AS shipping_info
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN shipping_info s ON o.id = s.order_id
      WHERE 
      o.id = $1
      AND ($2 OR o.buyer_id = $3) 
      GROUP BY o.id, s.id;
    `,
    [orderId, isAdmin, req.user.id],
  );

  if (result.rows.length === 0) {
    throw new FlintError("Order not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Order fetched.",
    order: result.rows[0],
  });
});

export const fetchMyOrders = catchAsyncError(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const result = await database.query(
    `
      SELECT 
      o.id, o.total_price, o.order_status, o.created_at, 
      COUNT(oi.id)::INTEGER AS total_items, MIN(oi.image) AS preview_image
      FROM orders o
      LEFT JOIN order_items oi
      ON o.id = oi.order_id
      WHERE
      o.buyer_id = $1
      GROUP BY o.id, o.total_price, o.order_status, o.created_at
      ORDER BY o.created_at DESC
      LIMIT $2
      OFFSET $3
    `,
    [req.user.id, limit, offset],
  );

  return res.status(200).json({
    success: true,
    message: "Orders fetched.",
    currentPage: page,
    orders: result.rows,
  });
});
