import express from "express";
import {register, login, logout, getUser} from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", logout);

export default router;