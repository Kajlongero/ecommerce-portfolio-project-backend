const express = require("express");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {string} message
 * @param {number} statusCode
 * @returns {express.Response}
 */

const SuccessResponseMessage = (req, res, message = "", statusCode = 200) => {
  res.status(statusCode).json({
    error: false,
    statusCode: statusCode,
    message,
  });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {string} message
 * @param {number} statusCode
 * @returns {express.Response}
 */

const SuccessResponseBody = (req, res, body, statusCode = 200) => {
  res.status(statusCode).json({
    error: false,
    statusCode: statusCode,
    data: body,
  });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {object} body
 * @param {string} message
 * @param {number} statusCode
 * @returns {express.Response}
 */

const SuccessResponseBoth = (req, res, body, message, statusCode = 200) => {
  res.status(statusCode).json({
    error: false,
    statusCode: statusCode,
    message,
    data: body,
  });
};

module.exports = {
  SuccessResponseBoth,
  SuccessResponseMessage,
  SuccessResponseBody,
};
