const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { Router } = require("express");

const userRouter = Router();

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter
  .route("/:id")
  .get(getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = userRouter;
