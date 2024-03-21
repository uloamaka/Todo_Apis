require("express-async-errors");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");

// const swaggerUI = require("swagger-ui-express");
// const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");
const responseUtilities = require("./shared/responceMiddlewares");
const { errorLogger, errorHandler } = require("./shared/errorMiddlewares");
const { UNKNOWN_ENDPOINT } = require("./utils/httpErrorCodes");

app.use(cookieParser());
app.use(responseUtilities);
app.use(express.json());

app.use(helmet());
app.use(morgan("combined"));

require("dotenv").config();
const connectDB = require("./service/database");
const clientUrl = process.env.clientUrl;
const corsOptions = {
  origin: clientUrl,
  credentials: true,
  withCredentials: true,
};

app.use(cors(corsOptions));

const v1Router = require("./routes/index");
app.use("/api/v1", v1Router);

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Crudify Api",
//       version: "1.0.0",
//       description: "A simple Express CRUD API, on a persons name.",
//     },
//     servers: [
//       {
//         url: "http://localhost:3000",
//         description: "dev server",
//       },
//       {
//         url: "https://crudify.onrender.com",
//         description: "production server",
//       },
//     ],
//   },
//   apis: ["./routes/*.js"],
// };

// const specs = swaggerJsDoc(options);

// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(errorLogger);
app.use(errorHandler);

app.use((req, res) => {
  // use custom helper function
  res.error(404, "Resource not found", UNKNOWN_ENDPOINT);
});

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URl || "");
    app.listen(PORT, () => console.log(`app is listening on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
