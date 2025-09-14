import { Router } from "express";
import middlewares from "../../../middlewares/index.js";
import UserMiddleware from "../../../middlewares/userMiddleware.js";
import UserController from "../../../controllers/userController.js";
const UserRouter = Router();

UserRouter.post(
  "/register",
  UserMiddleware.validateRegister,
  UserController.register
); // Đăng ký - ALL
UserRouter.post("/login", UserMiddleware.validateLogin, UserController.login); // Đăng nhập - ALL
UserRouter.get(
  "/countUsers",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  UserController.countUsers
); // Đếm tất cả người dùng - ADMIN
UserRouter.get(
  "/",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  UserController.getListUser
); // Lấy tất cả người dùng - ADMIN
UserRouter.put(
  "/modify/:id",
  middlewares.verifyAccessToken,
  middlewares.validateAdminOrAccountOwner,
  UserController.modifyUser
); // Sửa thông tin người dùng - ADMIN || ACCOUNT OWNER
UserRouter.delete(
  "/deleteUserById/:id",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  UserController.deleteUserById
); // Xóa người dùng - ADMIN
UserRouter.get("/:id", UserController.getUser); // Theo id

export default UserRouter;
