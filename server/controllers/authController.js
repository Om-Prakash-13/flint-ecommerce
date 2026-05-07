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
export const login = catchAsyncError(async (req, res, next) => {
    const {email, password} = req.body;

    const user = await database.query(
        `SELECT id, name, email, role, password, created_at FROM users WHERE email = $1`,
        [email]
    );

    if (user.rows.length === 0) {
        return next(new FlintError("Invalid email or password", 401));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordMatched) {
        return next(new FlintError("Invalid email or password", 401));
    }
    
    const { password: _, ...userWithoutPassword } = user.rows[0];
    sendToken(userWithoutPassword, 200, "User logged in successfully", res);
})
export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true, 
        user
    });
})
export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "Logged out successfully"
    });
})