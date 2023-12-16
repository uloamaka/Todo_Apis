const router = require("express").Router();

const authRouter = require("./auth.router");
const taskRouter = require("./task.router");
const swaggerRouter = require("./swagger.router");

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Hallo! Welcome to This Awesome Todo_List API",
  });
});

router.use("/auth", authRouter);
router.use("/todo", taskRouter);
router.use("/", swaggerRouter);

module.exports = router;
