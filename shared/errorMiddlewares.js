// const { HttpError } = require("../utils/httpErrors");

// function errorLogger(err, req, res, next) {
//   if (err instanceof HttpError === false) console.log(err.message);
//   next(err);
// }

// function errorHandler(err, req, res, next) {
//   const isInvalidJSON =
//     err instanceof SyntaxError &&
//     "body" in err &&
//     err.message.toLowerCase().includes("json");

//   if (isInvalidJSON) {
//     return res.error(400, err.message, "INVALID_JSON_FORMAT");
//   }

//   if (err instanceof HttpError) {
//     return res.error(err.statusCode, err.message, err.errorCode);
//   }
//   if (err.name === "MongoError" && err.code === 11000) {
//     return res.error(400, "Resource Already Exists.", err.errorCode);
//   }

//   res.error(500, "An unexpected error occured.", "UNEXPECTED_ERROR");
// }

// module.exports = { errorHandler, errorLogger };

const { HttpError } = require("../utils/httpErrors");

function errorLogger(err, req, res, next) {
  if (err instanceof HttpError === false) console.log(err.message);
  next(err);
}

function errorHandler(err, req, res, next) {
  const isInvalidJSON =
    err instanceof SyntaxError &&
    "body" in err &&
    err.message.toLowerCase().includes("json");

  if (isInvalidJSON) {
    return res.status(400).json({
      statusCode: 400,
      message: err.message,
      errorCode: "INVALID_JSON_FORMAT",
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errorCode: err.errorCode,
    });
  }
  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(400).json({
      statusCode: 400,
      message: "Resource Already Exists.",
      errorCode: err.errorCode,
    });
  }

  res.status(500).json({
    statusCode: 500,
    message: "An unexpected error occurred.",
    errorCode: "UNEXPECTED_ERROR",
  });
}

module.exports = { errorHandler, errorLogger };
