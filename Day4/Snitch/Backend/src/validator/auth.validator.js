import {body, validationResult} from 'express-validator';


function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const registerValidator = [
    body('email')
    .isEmail().withMessage('Invalid email address'),
    body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('contact')
    .notEmpty().withMessage('Contact number is required')
    .matches(/^\d{10}$/).withMessage('Contact number must be 10 digits long'),
    body('fullname')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters long'),
    body('isSeller')
    .isBoolean().withMessage('isSeller must be a boolean value'),

    validateRequest
   
]

export const loginValidator = [
    body('email')
    .isEmail().withMessage('Invalid email address'),
    body('password')
    .notEmpty().withMessage('Password is required'),

    validateRequest
]

