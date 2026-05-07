import express from "express";
import { createProduct } from "../controllers/productController.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createProductSchema } from "../validations/productValidation.js";

const router = express.Router();

router.post(
  "/new",
  isAuthenticated,
  authorizeRoles("Seller", "Admin"),
  validate(createProductSchema),
  createProduct,
);



export default router;