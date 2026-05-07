import express from "express";
import {register, login, logout, getUser, forgotPassword, resetPassword} from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validations/authValidation.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", logout);

router.post("/password/forgot", validate(forgotPasswordSchema), forgotPassword);
router.post("/password/reset/:token", validate(resetPasswordSchema), resetPassword);

export default router;