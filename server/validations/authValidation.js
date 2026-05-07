import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 2 characters.",
            "string.max": "Name cannot exceed 50 characters."
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email."
        }),

    password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters.",
            "string.max": "Password cannot exceed 30 characters."
        })
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email."
        }),
    
    password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters.",
            "string.max": "Password cannot exceed 30 characters."
        })
}); 