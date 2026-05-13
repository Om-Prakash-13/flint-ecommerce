import express from "express";
import { fetchMyOrders, fetchSingleOrder, placeNewOrder } from "../controllers/orderController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { placeOrderSchema } from "../validations/orderValidation.js";

const router = express.Router();


router.post("/new", isAuthenticated, validate(placeOrderSchema), placeNewOrder);
router.get("/me", isAuthenticated, fetchMyOrders);
router.get("/:orderId", isAuthenticated, fetchSingleOrder);


export default router;