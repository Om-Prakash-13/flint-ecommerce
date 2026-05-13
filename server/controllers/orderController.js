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
