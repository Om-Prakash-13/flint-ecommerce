import FlintError from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async (req, res, next) => {
    const {name, email, password} = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await database.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at`,
        [name, email, hashedPassword]
    );
    
    sendToken(user.rows[0], 201, "User registered successfully", res);
    
})
export const login = catchAsyncError(async (req, res, next) => {})
export const getUser = catchAsyncError(async (req, res, next) => {})
export const logout = catchAsyncError(async (req, res, next) => {})