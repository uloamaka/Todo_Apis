const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("../swagger_output.json");

const swaggerRouter = express.Router();

swaggerRouter.use("/", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));

module.exports = swaggerRouter;
