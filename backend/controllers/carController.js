import CarModel from "../models/CarModel.js";
import UserModel from "../models/UserModel.js";
import MailModel from "../models/MailModel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { uploadRateLimit } from "../config/fileUpload.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
// const getCloudinaryConfig = JSON.parse(process.env.CLOUD_DAINARY_CONFIG);
// cloudinary.config(getCloudinaryConfig);
// const storage = multer.memoryStorage();
// const uploadImgCar = multer({ storage: storage }).array("carImg", 5); // CHo phép tối đa 5 ảnh

// Hàm upload ảnh lên Cloudinary sử dụng Promise (sử dụn cho Api đăng tải xe)
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(file.buffer);
  });
};

const CarController = {
  // Tạo đơn đăng bán xe mới
  createCar: [
     uploadRateLimit,
    async (req, res) => {
      try {
        const { carName, carPrice } = req.body;
        const { idUser } = req.user;
        if (!carName) throw new Error("Cần nhập tên xe");
        if (!carPrice) throw new Error("Cần nhập giá xe");
        // Tải lên Cloudinary và lấy URL
        const files = req.files;
        if (!files || files.length === 0) {
          return res
            .status(400)
            .send({ message: "Chưa có file ảnh nào được tải lên" });
        }
        // Duyệt qua tất cả các ảnh và tải lên Cloudinary
        const imageUrls = await Promise.all(files.map(uploadToCloudinary));
        // Tạo xe mới trong database
        const newCar = await CarModel.create({
          carName,
          carPrice,
          carImg: imageUrls,
          color: req.body.color,
          version: req.body.version,
          ODO: req.body.ODO, //odograph: máy ghi quãng đường của ô tô
          year: req.body.year,
          origin: req.body.origin,
          gearBox: req.body.gearBox, //Hộp số
          driveSystem: req.body.driveSystem, //Hệ dẫn động,
          torque: req.body.torque, //Momen xoắn,
          engine: req.body.engine, //Động cơ
          horsePower: req.body.horsePower, //Mã lực
          power: req.body.power, //năng lượng
          brand: req.body.brand,
          describe: req.body.describe,
          state: req.body.state, //trạng thái: cũ/mới
          color: req.body.color,
          sitChairs: req.body.sitChairs,
          idProvider: idUser,
        });

        res.status(201).send({
          message: "Tạo xe thành công!",
          data: newCar,
        });
      } catch (error) {
        res.status(500).send({
          message: error.message,
          data: null,
        });
      }
    },
  ],
  // Lấy thông tin xe theo id
  getCarById: async (req, res) => {
    try {
      const { idCar } = req.params;
      const car = await CarModel.findById(idCar).populate("idProvider");
      res.status(200).send({
        message: "Successful",
        data: car,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Lấy tất cả xe (có limit)
  getListCar: async (req, res) => {
    try {
      const { limit, page, brand, state, color, year, minPrice, maxPrice } =
        req.query;
      const dataLimit = parseInt(limit) || 9;
      const pageNumber = parseInt(page) || 1;
      const skip = (pageNumber - 1) * dataLimit;
      // console.log("Min Price:", minPrice, "Max Price:", maxPrice);
      const filters = { isStatus: "approved" };
      if (brand) filters.brand = { $regex: brand, $options: "i" }; //áp các điều kiện vô filter - k phân biệt hoa thường
      if (state) filters.state = state;
      if (color) filters.color = color;
      if (year) filters.year = parseInt(year);
      if (minPrice && maxPrice) {
        filters.carPrice = { $gte: Number(minPrice), $lte: Number(maxPrice) };
      }
      const listCar = await CarModel.find(filters)
        .skip(skip)
        .limit(dataLimit)
        .sort({ updatedAt: -1 }); //find({color : color})
      const totalCars = await CarModel.countDocuments(filters); //Đếm những phần tử thỏa mãn đk
      res.status(200).send({
        message: "Successful",
        data: listCar,
        totalPages: Math.ceil(totalCars / dataLimit),
        currentPage: pageNumber,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Lấy tất xe theo brand
  findCarsByBrand: async (req, res) => {
    try {
      const { brand, limit } = req.query;
      const dataLimit = parseInt(limit) || 0;
      if (!brand) {
        return res.status(400).send({
          message: "Thiếu thông tin brand",
          data: null,
        });
      }
      const cars = await CarModel.find({
        brand: { $regex: brand, $options: "i" }, // Regex không phân biệt hoa thường
      }).limit(dataLimit);
      if (!cars.length) {
        return res.status(404).send({
          message: "Không tìm thấy xe với brand được cung cấp",
          data: [],
        });
      }
      res.status(200).send({
        message: `Tìm thấy ${cars.length} xe theo brand '${brand}'`,
        data: cars,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Hàm thêm lại ghế ngồi (trước đăng lên thiếu)
  updateCarColors: async (req, res) => {
    try {
      const result = await CarModel.updateMany(
        { sitChairs: { $exists: false } }, // chỉ up cái nào cần
        { $set: { sitChairs: 7 } } // Set chỗ ngồi
      );

      res.status(200).send({
        message: "sitChairs updated successfully for all cars",
        modifiedCount: result.modifiedCount, // Number of documents modified
      });
    } catch (error) {
      res.status(500).send({
        message: "Error updating car sitChairs",
        error: error.message,
      });
    }
  },
  // Tìm xe theo tên
  searchingCar: async (req, res) => {
    const { carName, limit, page } = req.query;
    const dataLimit = parseInt(limit) || 9;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * dataLimit;
    try {
      const regex = new RegExp(carName, "i"); //k pbiet hoa thường
      const cars = await CarModel.find({ carName: regex })
        .limit(dataLimit)
        .skip(skip);
      const totalCars = await CarModel.countDocuments({ carName: regex }); //hàm này cần điều kiện truy vấn (ở đây là carName)
      res.status(200).send({
        message: "Xe bạn tìm",
        data: cars,
        totalPages: Math.ceil(totalCars / dataLimit),
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
  // Lấy tất cả xe của Provider theo id
  listUserCar: async (req, res) => {
    try {
      const { idProvider } = req.params;
      const cars = await CarModel.find({ idProvider, isStatus: "approved" });
      res.status(200).send({
        message: "Successful",
        data: cars,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Sửa thông tin của xe
  updatedCar: [
    // uploadImgCar,
    async (req, res) => {
      try {
        const { carId } = req.params;
        // ////Tải lên Cloudinary và lấy URL
        // const files = req.files;
        // if (!files || files.length === 0) {
        //   return res
        //     .status(400)
        //     .send({ message: "Chưa có file ảnh nào được tải lên" });
        // }

        ////Duyệt qua tất cả các ảnh và tải lên Cloudinary
        // const imageUrls = await Promise.all(files.map(uploadToCloudinary));
        const {
          carPrice,
          color,
          ODO,
          year,
          origin,
          gearBox,
          driveSystem,
          torque,
          engine,
          horsePower,
          power,
          brand,
          describe,
          state,
          sitChairs,
          version,
        } = req.body;
        const updatedCar = await CarModel.findByIdAndUpdate(carId, {
          carPrice,
          color,
          ODO,
          year,
          origin,
          gearBox,
          driveSystem,
          torque,
          engine,
          horsePower,
          power,
          brand,
          describe,
          state,
          sitChairs,
          version,
        });
        //xóa phần img với name ở 2 dòng trên
        res.status(201).send({
          message: "Cập nhật thông tin xe thành công!",
          data: updatedCar,
        });
      } catch (error) {
        res.status(500).send({
          message: error.message,
          data: null,
        });
      }
    },
  ],
  // Xoá xe
  deleteCar: async (req, res) => {
    try {
      const { carId } = req.params;
      // Xóa tất cả mail có liên quan đến xe
      await MailModel.deleteMany({ carId });

      // Xóa xe
      const deletedCar = await CarModel.findByIdAndDelete(carId);

      if (!deletedCar) {
        return res.status(404).send({
          message: "Xe không tồn tại!",
          data: null,
        });
      }
      res.status(201).send({
        message: "Xóa xe thành công!",
        data: deletedCar,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
  // Phương thêm từ đây để dử dụng cho trang quản trị
  // Thay đổi trạng thái xe (Duyệt - Bỏ duyệt)
  changeStatusCar: async (req, res) => {
    try {
      const { id } = req.params;
      const { newStatus } = req.body;
      const changeStatusCar = await CarModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          isStatus: newStatus,
          updatedAt: new Date(),
        }
      );
      if (newStatus === "approved") {
        return res.status(201).send({
          message: "Duyệt xe thành công!",
          data: changeStatusCar,
        });
      }
      if (newStatus === "pending") {
        return res.status(201).send({
          message: "Bỏ duyệt xe thành công!",
          data: changeStatusCar,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
  // Đếm xe theo trạng thái
  countCars: async (req, res) => {
    try {
      const totalCars = await CarModel.find({});
      const approvedCars = await CarModel.find({ isStatus: "approved" });
      const pendingCars = await CarModel.find({ isStatus: "pending" });
      res.status(200).send({
        message: "Đếm xe thành công!",
        totalCars: totalCars.length,
        approvedCars: approvedCars.length,
        pendingCars: pendingCars.length,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Lấy danh sách xe theo trạng thái
  getAllCar: async (req, res) => {
    try {
      const { limit, currentPage, isStatus } = req.query;
      const dataLimit = parseInt(limit);
      const pageNumber = parseInt(currentPage) || 1;
      const skip = (pageNumber - 1) * dataLimit;
      if (isStatus === "all") {
        const totalCars = await CarModel.find(
          {},
          "carName brand state isStatus updatedAt"
        );
        const result = await CarModel.find(
          {},
          "carName brand state isStatus updatedAt"
        )
          .skip(skip)
          .limit(dataLimit)
          .sort({ createdAt: -1 })
          .populate("idProvider", "username avatar");
        res.status(200).send({
          message: "Lấy danh sách xe thành công!",
          data: result,
          totalPages: Math.ceil(totalCars.length / dataLimit),
        });
      } else {
        const totalCars = await CarModel.find(
          {
            isStatus: isStatus,
          },
          "carName brand state isStatus updatedAt"
        );
        const result = await CarModel.find(
          {
            isStatus: isStatus,
          },
          "carName brand state isStatus updatedAt"
        )
          .skip(skip)
          .limit(dataLimit)
          .sort({ createdAt: -1 })
          .populate("idProvider", "username avatar");
        res.status(200).send({
          message: "Lấy danh sách xe theo trạng thái thành công!",
          data: result,
          totalPages: Math.ceil(totalCars.length / dataLimit),
        });
      }
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Đếm xe theo trạng thái + theo hãng
  countCarsByBrand: async (req, res) => {
    try {
      const { brand } = req.params;
      const totalCars = await CarModel.find({
        brand: brand,
      });
      const approvedCars = await CarModel.find({
        brand: brand,
        isStatus: "approved",
      });
      const pendingCars = await CarModel.find({
        brand: brand,
        isStatus: "pending",
      });
      res.status(200).send({
        message: "Đếm xe theo hãng thành công!",
        totalCars: totalCars.length,
        approvedCars: approvedCars.length,
        pendingCars: pendingCars.length,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Lấy danh sách xe theo trạng thái + theo hãng
  getCarByBrand: async (req, res) => {
    try {
      const { limit, currentPage, isStatus, brand } = req.query;
      const dataLimit = parseInt(limit);
      const pageNumber = parseInt(currentPage) || 1;
      const skip = (pageNumber - 1) * dataLimit;
      if (isStatus === "all") {
        const totalCars = await CarModel.find(
          {
            brand: brand,
          },
          "carName brand state isStatus updatedAt"
        );
        const result = await CarModel.find(
          {
            brand: brand,
          },
          "carName brand state isStatus updatedAt"
        )
          .skip(skip)
          .limit(dataLimit)
          .sort({ createdAt: -1 })
          .populate("idProvider", "username avatar");
        res.status(200).send({
          message: "Lấy danh sách xe theo hãng thành công!",
          data: result,
          totalPages: Math.ceil(totalCars.length / dataLimit),
        });
      } else {
        const totalCars = await CarModel.find(
          {
            brand: brand,
            isStatus: isStatus,
          },
          "carName brand state isStatus updatedAt"
        );
        const result = await CarModel.find(
          {
            brand: brand,
            isStatus: isStatus,
          },
          "carName brand state isStatus updatedAt"
        )
          .skip(skip)
          .limit(dataLimit)
          .sort({ createdAt: -1 })
          .populate("idProvider", "username avatar");
        res.status(200).send({
          message: "Lấy danh sách xe theo trạng thái + theo hãng thành công!",
          data: result,
          totalPages: Math.ceil(totalCars.length / dataLimit),
        });
      }
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Đếm theo trạng thái + theo nhà cung cấp
  countCarsByProvider: async (req, res) => {
    try {
      const { idProvider } = req.params;
      const totalCars = await CarModel.find({
        idProvider: idProvider,
      });
      const approvedCars = await CarModel.find({
        idProvider: idProvider,
        isStatus: "approved",
      });
      const pendingCars = await CarModel.find({
        idProvider: idProvider,
        isStatus: "pending",
      });
      res.status(200).send({
        message: "Đếm xe theo nhà cung cấp thành công!",
        totalCars: totalCars.length,
        approvedCars: approvedCars.length,
        pendingCars: pendingCars.length,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Lấy tất cả xe theo trạng thái + theo nhà cung cấp
  getCarByProvider: async (req, res) => {
    try {
      const { limit, currentPage, isStatus, idProvider } = req.query;
      const dataLimit = parseInt(limit);
      const pageNumber = parseInt(currentPage) || 1;
      const skip = (pageNumber - 1) * dataLimit;
      const provider = await UserModel.findById(idProvider);
      if (isStatus === "all") {
        const totalCars = await CarModel.find(
          {
            idProvider: idProvider,
          },
          "carName brand state isStatus updatedAt"
        );
        const result = await CarModel.find(
          {
            idProvider: idProvider,
          },
          "carName brand state isStatus updatedAt"
        )
          .skip(skip)
          .limit(dataLimit)
          .sort({ createdAt: -1 })
          .populate("idProvider", "username avatar");
        res.status(200).send({
          message: "Lấy danh sách xe theo nhà cung cấp thành công!",
          data: result,
          totalPages: Math.ceil(totalCars.length / dataLimit),
          usernameProvider: provider.username,
        });
      } else {
        const totalCars = await CarModel.find(
          {
            idProvider: idProvider,
            isStatus: isStatus,
          },
          "carName brand state isStatus updatedAt"
        );
        const result = await CarModel.find(
          {
            idProvider: idProvider,
            isStatus: isStatus,
          },
          "carName brand state isStatus updatedAt"
        )
          .skip(skip)
          .limit(dataLimit)
          .sort({ createdAt: -1 })
          .populate("idProvider", "username avatar");
        res.status(200).send({
          message:
            "Lấy danh sách xe theo trạng thái + theo nhà cung cấp thành công!",
          data: result,
          totalPages: Math.ceil(totalCars.length / dataLimit),
          usernameProvider: provider.username,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Đếm xe theo trạng thái + theo tình trạng
  countCarsByState: async (req, res) => {
    // đổi tên tình trạng
    const getStateName = (state) => {
      switch (state) {
        case "old":
          return "Cũ";
        case "new":
          return "Mới";
        default:
          return "Không xác định";
      }
    };
    try {
      const { state } = req.params;
      const totalCars = await CarModel.find({
        state: getStateName(state),
      });
      const approvedCars = await CarModel.find({
        state: getStateName(state),
        isStatus: "approved",
      });
      const pendingCars = await CarModel.find({
        state: getStateName(state),
        isStatus: "pending",
      });
      res.status(200).send({
        message: "Đếm xe theo tình trạng thành công!",
        totalCars: totalCars.length,
        approvedCars: approvedCars.length,
        pendingCars: pendingCars.length,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Lấy tất cả xe theo trạng thái + theo tình trạng
  getCarByState: async (req, res) => {
    // đổi tên tình trạng
    const getStateName = (state) => {
      switch (state) {
        case "old":
          return "Cũ";
        case "new":
          return "Mới";
        default:
          return "Không xác định";
      }
    };
    try {
      const { limit, currentPage, isStatus, state } = req.query;
      const dataLimit = parseInt(limit);
      const pageNumber = parseInt(currentPage) || 1;
      const skip = (pageNumber - 1) * dataLimit;
      if (isStatus === "all") {
        const totalCars = await CarModel.find(
          {
            state: getStateName(state),
          },
          "carName brand state isStatus updatedAt"
        );
        const result = await CarModel.find(
          {
            state: getStateName(state),
          },
          "carName brand state isStatus updatedAt"
        )
          .skip(skip)
          .limit(dataLimit)
          .sort({ createdAt: -1 })
          .populate("idProvider", "username avatar");
        res.status(200).send({
          message: "Lấy danh sách xe theo tình trạng thành công!",
          data: result,
          totalPages: Math.ceil(totalCars.length / dataLimit),
        });
      } else {
        const totalCars = await CarModel.find(
          {
            state: getStateName(state),
            isStatus: isStatus,
          },
          "carName brand state isStatus updatedAt"
        );
        const result = await CarModel.find(
          {
            state: getStateName(state),
            isStatus: isStatus,
          },
          "carName brand state isStatus updatedAt"
        )
          .skip(skip)
          .limit(dataLimit)
          .sort({ createdAt: -1 })
          .populate("idProvider", "username avatar");
        res.status(200).send({
          message:
            "Lấy danh sách xe theo trạng thái + theo tình trạng thành công!",
          data: result,
          totalPages: Math.ceil(totalCars.length / dataLimit),
        });
      }
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Anh Duy thêm từ đây để làm chức năng yêu thích xe
  // Thêm danh sách xe yêu thích
  addToWishlist: async (req, res) => {
    try {
      const { idCar, userId } = req.params;
      const user = await UserModel.findById(userId);
      if (!user) throw new Error("user not found");
      if (user.wishlist?.includes(idCar)) {
        return res.status(400).send({ message: "Car already in wishlist" });
      }
      user.wishlist.push(idCar);
      await user.save();
      res.status(200).send({
        message: "Car added to wishlist",
        isLiked: true, // Trả về trạng thái yêu thích
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Xoá danh sách xe yêu thích
  removeFromWishlist: async (req, res) => {
    try {
      const { idCar, userId } = req.params;
      const user = await UserModel.findById(userId);
      if (!user) throw new Error("user not found");
      user.wishlist = user.wishlist.filter(
        (carId) => carId.toString() !== idCar
      );
      await user.save();
      res.status(200).send({
        message: "Car removed from wishlist",
        isLiked: false, // Trả về trạng thái yêu thích
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Lấy danh sách xe yêu thích
  getWishlist: async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit, page } = req.query;
      const dataLimit = parseInt(limit) || 9;
      const pageNumber = parseInt(page) || 1;
      const skip = (pageNumber - 1) * dataLimit;
      const user = await UserModel.findById(userId);
      
      if (!user) throw new Error("User not found");
      const totalCars = user.wishlist.length;
      // Lấy danh sách ID xe trong wishlist và phân trang
      const wishlistIds = user.wishlist.slice(skip, skip + dataLimit);
      // Populate thông tin xe từ danh sách ID đã phân trang
      const wishlistCars = await CarModel.find({ _id: { $in: wishlistIds } });
      console.log("Wishlist IDs:", wishlistIds);
      console.log("Wishlist Cars:", wishlistCars);
      // Trả về danh sách xe yêu thích đã phân trang
      res.status(200).send({
        message: "Wishlist retrieved successfully",
        data: wishlistCars,
        totalPages: Math.ceil(totalCars / dataLimit),
        currentPage: pageNumber,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
};

export default CarController;

//Giải thích code:
/*
I) Api create xe

*/
