import { body } from 'express-validator/check';
import UserModel from '../models/User';

const signUpValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail()
    .trim(),
  body('email').custom((value) => {
    const defaultValue = {
      id: 12,
      firstName: 'Sam',
      lastName: 'Samuel',
      email: 'james@mail.io',
      phone: '08068170006',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: 'false',
    };
    const allUsers = UserModel.fetchAll();
    allUsers.push(defaultValue);
    allUsers.forEach((data) => {
      if (value === data.email) {
        throw new Error('Email already in use');
      } else {
        return true;
      }
    });
    return true;
  }),
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
  body('phone', 'Please enter a correct 11 digit phone number')
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

module.exports = {
  signUpValidation,
};
