import { body } from 'express-validator/check';

const signUpValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail()
    .trim(),
  body(
    'password',
    'Please enter a password with only text and numbers and at least 6 characters long',
  )
    .trim()
    .isLength({ min: 6 })
    .isAlphanumeric(),
  body(
    'firstName',
    'First name that contains only text and numbers with minimum of 2 characters long is required',
  )
    .isLength({ min: 2 })
    .isAlphanumeric()
    .trim(),
  body('phoneNumber', 'Please enter a correct 11 digit phone number')
    .isLength({ min: 11, max: 11 })
    .isNumeric()
    .trim(),
  body(
    'lastName',
    'Last name that contains only text and numbers with minimum of 2 characters long is required',
  )
    .isLength({ min: 2 })
    .isAlphanumeric()
    .trim(),
];

const signInValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail()
    .trim(),
  body(
    'password',
    'Please enter a password with only text and numbers and at least 6 characters long',
  )
    .trim()
    .isLength({ min: 6 })
    .isAlphanumeric(),
];

module.exports = {
  signUpValidation,
  signInValidation,
};
