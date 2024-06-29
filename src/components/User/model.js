const joi = require("joi");
const { jwt } = require("../Auth/model");

const id = joi.string().uuid();
const email = joi.string().min(3).max(120).email();
const password = joi.string().min(8).max(255);
const firstName = joi.string().min(1).max(60);
const lastName = joi.string().min(1).max(60);
const birthDate = joi.string().isoDate();
const address = joi.string().min(5).max(120);
const roleId = joi.number().integer();
const coverImageUri = joi.string().uri();

const getCustomerSchema = joi.object({
  id: id.required(),
});

const getCustomerOptionalSchema = joi.object({
  id,
});

const loginSchema = joi.object({
  email: email.required(),
  password: password.required(),
});

const createCustomerSchema = joi.object({
  email: email.required(),
  password: password.required(),
  firstName: firstName.required(),
  lastName: lastName.required(),
  birthDate: birthDate,
  address: address,
});

const createEmployeeSchema = joi.object({
  email: email.required(),
  password: password.required(),
  firstName: firstName.required(),
  lastName: lastName.required(),
  birthDate: birthDate.required(),
  address: address.required(),
  roleId: roleId.required(),
  rt: jwt.required(),
});

const updateUserSchema = joi.object({
  firstName,
  lastName,
  birthDate,
  address,
  rt: jwt.required(),
});

const changeEmailSchema = joi.object({
  rt: jwt.required(),
  email: joi.string().email().min(3).max(150).required(),
});

const updatePasswordSchema = joi.object({
  oldPassword: password,
  newPassword: password.required(),
  rt: jwt.required(),
});

module.exports = {
  getCustomerSchema,
  getCustomerOptionalSchema,
  createCustomerSchema,
  createEmployeeSchema,
  updateUserSchema,
  changeEmailSchema,
  updatePasswordSchema,
  loginSchema,
};
