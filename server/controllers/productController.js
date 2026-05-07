import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import FlintError from "../middlewares/errorMiddleware.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";
import { parse } from "dotenv";

export const createProduct = catchAsyncError(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  const created_by = req.user.id;

  let uploadedImages = [];
  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const image of images) {
      const reesult = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "products",
        width: 1000,
        crop: "scale",
      });

      uploadedImages.push({
        public_id: reesult.public_id,
        url: reesult.secure_url,
      });
    }
  }

  const product = await database.query(
    `
        INSERT INTO products (name, description, price, category, stock, created_by, images) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING
            id,
            name,
            description,
            price,
            category,
            stock,
            images,
            created_by,
            created_at
    `,
    [
      name,
      description,
      price,
      category,
      stock,
      created_by,
      JSON.stringify(uploadedImages),
    ],
  );

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: product.rows[0],
  });
});

export const fetchAllProducts = catchAsyncError(async (req, res, next) => {
    const {availability, price, category, ratings, search} = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const conditions = [];
    let values = [];
    let index = 1;

    let paginationPlaceholders = {};

    // Availability filter -> filters products based on stock levels, allowing users to find in-stock, limited-stock, or out-of-stock items.
    if(availability === "in-stock"){
        conditions.push(`stock > 0`);
    }else if (availability === "limited-stock"){
        conditions.push(`stock > 0 AND stock <= 5`);
    }else if (availability === "out-of-stock"){
        conditions.push(`stock = 0`);
    }

    // Price filter -> allows users to filter products based on a price range.
    if(price){
        const [minPrice, maxPrice] = price.split("-");
        if(minPrice && maxPrice){
            conditions.push(`price BETWEEN $${index} AND $${index + 1}`);
            values.push(Number(minPrice), Number(maxPrice));
            index += 2;
        }
    }

    // Category filter -> enables users to filter products by category, making it easier to find items in specific categories.
    if(category){
        conditions.push(`LOWER(category) = LOWER($${index})`);
        values.push(`%${category}%`);
        index++;
    }

    // Ratings filter -> allows users to filter products based on average ratings, helping them find highly-rated items.
    if(ratings){
        conditions.push(`ratings >= $${index}`);
        values.push(ratings);
        index++;
    }

    // Search filter -> provides a search functionality that allows users to find products based on keywords in the product name or description.
    if(search){
        conditions.push(`(p.name ILIKE $${index} OR p.description ILIKE $${index})`);
        values.push(`%${search}%`);
        index++;  
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count of products matching the filters
    const totalProductsResult = await database.query(
        `SELECT COUNT(*) FROM products p ${whereClause}`,
        values
    );
    const totalProducts = parseInt(totalProductsResult.rows[0].count);

    paginationPlaceholders.limit = `$${index}`;
    values.push(limit);
    index++;

    paginationPlaceholders.offset = `$${index}`;
    values.push(offset);
    index++;

    // Fetch with reviews
    const  query = `
        SELECT p.*, 
        COUNT(r.id) AS review_count 
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT ${paginationPlaceholders.limit} OFFSET ${paginationPlaceholders.offset}
    `;
    const result = await database.query(query, values);

    // Fetch new products (added in the last 30 days)
    const newProductsQuery = `
        SELECT p.*,
        COUNT(r.id) AS review_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE p.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT 8
    `;
    const newProductsResult = await database.query(newProductsQuery);

    // Fetch top-rated products (average rating of 4 or higher)
    const topRatedProductsQuery = `
        SELECT p.*,
        COUNT(r.id) AS review_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE p.ratings >= 4
        GROUP BY p.id
        ORDER BY p.ratings DESC, review_count DESC, p.created_at DESC
        LIMIT 8
    `;
    const topRatedProductsResult = await database.query(topRatedProductsQuery);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
        success: true,
        products: result.rows,
        totalProducts,
        newProducts: newProductsResult.rows,
        topRatedProducts: topRatedProductsResult.rows,
        totalPages,
        currentPage: page
    })


});


