import { Router } from "express";
import middlewares from "../../../middlewares/index.js";
import ApplicationController from "../../../controllers/applicationController.js";
const ApplicationRouter = Router();

ApplicationRouter.post(
  "/registerProvider/:id",
  middlewares.verifyAccessToken,
  middlewares.validateCustomer,
  ApplicationController.registerProvider
); // Đăng ký làm nhà cung cấp - CUSTOMER
ApplicationRouter.get(
  "/countApplys",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  ApplicationController.countApplys
); // Đếm đơn - ADMIN
ApplicationRouter.get(
  "/getAllApplys",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  ApplicationController.getAllApplys
); // Lấy đơn - ADMIN
ApplicationRouter.put(
  "/approve/:id",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  ApplicationController.approve
); // Thay đổi trạng thái đơn - ADMIN

export default ApplicationRouter;
