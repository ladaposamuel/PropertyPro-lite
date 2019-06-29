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
const propertyValidation = [
  body('price')
    .isFloat()
    .withMessage('A valid price/amount is required')
    .trim(),
  body('state', 'Please enter the state where property is located')
    .trim()
    .isString(),
  body('city', 'Please enter the city where property is located')
    .trim()
    .isString(),
  body('address', 'Please enter the address where property is located')
    .trim()
    .isString(),
  body('type', 'Please enter the type of the property')
    .trim()
    .isString(),
];

const propertyFlagValidation = [
  body('reason')
    .isString()
    .withMessage('Please provide a flag reason')
    .trim(),
  body('description')
    .isString()
    .withMessage('Please provide a flag description')
    .trim(),
];

const passwordResetValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail()
    .trim(),
];

const newPasswordValidation = [
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
  propertyValidation,
  propertyFlagValidation,
  passwordResetValidation,
  newPasswordValidation,
};
