import { Router } from "express";
import middlewares from "../../../middlewares/index.js";
import UserMiddleware from "../../../middlewares/userMiddleware.js";
import CarController from "../../../controllers/carController.js";
const CarRouter = Router();

//Thêm xe mới (đã là provider - role: 'PROVIDER')
CarRouter.post(
  "/create-car",
  UserMiddleware.checkRoleProvider,
  CarController.createCar
);
// Tìm xe theo Id - ALL
CarRouter.get("/car/:idCar", CarController.getCarById);
// Tìm xe (có query) - ALL
CarRouter.get("", CarController.getListCar);
//
// CarRouter.put("/addColor", CarController.updateCarColors);
// Tìm xe theo Brand - ALL
CarRouter.get("/brand", CarController.findCarsByBrand);
// Tìm kiếm xe theo tên - ALL
CarRouter.get("/search", CarController.searchingCar);
// Sửa thông tin xe - ADMIN || CAR OWNER
CarRouter.put(
  "/updatecar/:carId",
  middlewares.verifyAccessToken,
  middlewares.validateAdminOrCarOwner,
  CarController.updatedCar
);
// Xoá xe - ADMIN || CAR OWNER
CarRouter.delete(
  "/deletecar/:carId",
  middlewares.verifyAccessToken,
  middlewares.validateAdminOrCarOwner,
  CarController.deleteCar
);
//middlewares.verifyAccessToken, middlewares.validateAdminOrCarOwner,
// Thay đổi trạng thái xe - ADMIN
CarRouter.put(
  "/changeStatusCar/:id",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  CarController.changeStatusCar
);
// Đếm xe theo trạng thái - ADMIN
CarRouter.get(
  "/countCars",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  CarController.countCars
);
// Đếm xe theo trạng thái + theo hãng - ADMIN
CarRouter.get(
  "/countCarsByBrand/:brand",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  CarController.countCarsByBrand
);
// Đếm xe theo trạng thái + theo tình trạng - ADMIN
CarRouter.get(
  "/countCarsByState/:state",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  CarController.countCarsByState
);
// Đếm xe theo trạng thái + theo nhà cung cấp - ADMIN
CarRouter.get(
  "/countCarsByProvider/:idProvider",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  CarController.countCarsByProvider
);
// Lấy danh sách xe theo trạng thái - ADMIN
CarRouter.get(
  "/getAllCar",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  CarController.getAllCar
);
// Lấy danh sách xe theo trạng thái + theo hãng - ADMIN
CarRouter.get(
  "/carByBrand",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  CarController.getCarByBrand
);
// Lấy danh sách xe theo trạng thái + theo tình trạng - ADMIN
CarRouter.get(
  "/carByState",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  CarController.getCarByState
);
// Lấy danh sách xe theo trạng thái + theo nhà cung cấp - ADMIN
CarRouter.get(
  "/carByProvider",
  middlewares.verifyAccessToken,
  middlewares.validateAdmin,
  CarController.getCarByProvider
);
// Lấy danh sách xe của user qua id
CarRouter.get("/:idProvider", CarController.listUserCar);
//
// Thêm xe vào wishlist
CarRouter.post("/:idCar/wishlist/:userId", CarController.addToWishlist);
// Xoá xe trong wishlist
CarRouter.delete("/:idCar/wishlist/:userId", CarController.removeFromWishlist);
// Lấy xe trong wishlist
CarRouter.get("/wishlist/:userId", CarController.getWishlist);

export default CarRouter;
