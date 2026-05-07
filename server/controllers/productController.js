import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import FlintError from "../middlewares/errorMiddleware.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";

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
