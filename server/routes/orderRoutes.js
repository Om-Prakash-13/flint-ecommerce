import express from "express";
import { placeNewOrder } from "../controllers/orderController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { placeOrderSchema } from "../validations/orderValidation.js";

const router = express.Router();


router.post("/new", isAuthenticated, validate(placeOrderSchema), placeNewOrder);


export default router;