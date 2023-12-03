const router = require("express").Router();

const taskRouter = require("./task.router");

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Hallo! Welcome to This Awesome Todo_List API",
  });
});

router.use("/todo", taskRouter);

module.exports = router;
