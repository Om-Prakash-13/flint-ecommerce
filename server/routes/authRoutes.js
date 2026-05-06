import express from "express";
import {register, login, logout, getUser} from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validations/authValidation.js";

const router = express.Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", login);
router.get("/me", getUser);
router.get("/logout", logout);

export default router;
