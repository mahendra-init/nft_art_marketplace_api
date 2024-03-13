const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  uploadUserProfile,
} = require("../controllers/userController");
const {
  signup,
  login,
  authenticate,
} = require("../controllers/authController");
const { Router } = require("express");
const upload = require("../utils/upload");

const userRouter = Router();

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter
  .route("/upload-profile")
  .post(authenticate, upload.single("photo"), uploadUserProfile);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter
  .route("/:id")
  .get(getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = userRouter;
