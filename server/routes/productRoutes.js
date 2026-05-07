import express from "express";
import { createProduct, deleteProduct, fetchAllProducts, fetchSingleProduct, updateProduct } from "../controllers/productController.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createProductSchema, updateProductSchema } from "../validations/productValidation.js";

const router = express.Router();

router.post(
  "/new",
  isAuthenticated,
  authorizeRoles("Seller", "Admin"),
  validate(createProductSchema),
  createProduct,
);

router.get("/all", fetchAllProducts);

router.put(
    "/:productId",
    isAuthenticated,
    authorizeRoles("Seller", "Admin"),
    validate(updateProductSchema),
    updateProduct
);

router.delete(
    "/:productId",
    isAuthenticated,
    authorizeRoles("Seller", "Admin"),
    deleteProduct
)

router.get("/:productId", fetchSingleProduct);

export default router;