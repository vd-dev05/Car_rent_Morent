import bcrypt from "bcrypt";
// import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { io } from "../socket/socket.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

import UserModel from "../models/UserModel.js";
import CarModel from "../models/CarModel.js";
import ApplicationModel from "../models/ApplicationModel.js";
import { upload } from "../config/fileUpload.js";

const UserController = {
  // Đăng ký
  register: async (req, res) => {
    try {
      const { email, username, password, confirmPassword } = req.body;
      // if (!password || password.length < 6) {
      //   return res
      //     .status(400)
      //     .send({ message: "Password must be at least 6 characters." });
      // };
      // Tìm email đã tồn tại
      const existedEmail = await UserModel.findOne({ email });
      if (existedEmail) throw new Error("Email đã tồn tại!");
      // Tìm username đã tồn tại
      const existedUsername = await UserModel.findOne({ username });
      if (existedUsername) throw new Error("Username đã tồn tại!");
      // Kiểm tra mật khẩu nhập lại
      if (confirmPassword !== password)
        throw new Error("Mật khẩu nhập lại không đúng!");
      //
      const checkUser = await UserModel.find({});
      let role;
      if (checkUser.length === 0) {
        role = "ADMIN";
      }
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = await UserModel.create({
        email,
        username,
        fullname: "",
        dateOfBirth: "",
        address: "",
        phoneNumber: "",
        password: hashedPassword,
        salt,
        avatar:
          "https://res.cloudinary.com/dxkokrlhr/image/upload/v1732884464/uj1miv0g9t5hduvbfvlg.png",
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      res.status(201).send({
        message: "Đăng ký thành công!",
        data: newUser,
      });
    } catch (error) {
      res.status(401).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Tìm user qua email nhập vào
      const findUser = await UserModel.findOne({ email });
      if (!findUser) throw new Error("Email không đúng!");
      // Đối chiếu mật khẩu
      const comparePassword = bcrypt.compareSync(password, findUser.password);
      if (!comparePassword) throw new Error("Mật khẩu không đúng!");
      //
      const getUser = {
        ...findUser.toObject(),
      };
      delete getUser.salt;
      delete getUser.password;
      const accessToken = jwt.sign(getUser, SECRET_KEY, {
        // expiresIn: 10,
        expiresIn: 60 * 60 * 24,
      });
      const refreshToken = jwt.sign(getUser, SECRET_KEY, {
        expiresIn: 60 * 60 * 24 * 7,
      });
      req.getUser = {
        ...getUser,
        accessToken,
        refreshToken,
      };
      res.status(200).send({
        message: "Đăng nhập thành công!",
        data: req.getUser,
      });
    } catch (error) {
      res.status(401).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Lấy thông tin người dùng theo id
  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id, "-password -salt");
      res.status(200).send({
        message: "Lấy thông tin người dùng thành công!",
        data: user,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Đếm tất cả người dùng theo vai trò
  countUsers: async (req, res) => {
    try {
      const totalUsers = await UserModel.find({});
      const admin = await UserModel.find({ role: "ADMIN" });
      const provider = await UserModel.find({ role: "PROVIDER" });
      const customer = await UserModel.find({ role: "CUSTOMER" });
      res.status(200).send({
        message: "Đếm người dùng thành công!",
        totalUsers: totalUsers.length,
        admin: admin.length,
        provider: provider.length,
        customer: customer.length,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Lấy tất cả người dùng theo vai trò
  getListUser: async (req, res) => {
    try {
      const { limit, currentPage, role } = req.query;
      const upperCaseRole = role.toUpperCase();
      const dataLimit = parseInt(limit);
      const pageNumber = parseInt(currentPage) || 1;
      const skip = (pageNumber - 1) * dataLimit;
      if (upperCaseRole === "ALL") {
        const totalUsers = await UserModel.find({}, "-password -salt");
        const result = await UserModel.find({}, "-password -salt")
          .skip(skip)
          .limit(dataLimit)
          .sort({ createdAt: -1 });
        res.status(200).send({
          message: "Lấy thông tin tất cả người dùng thành công!",
          data: result,
          totalPages: Math.ceil(totalUsers.length / dataLimit),
        });
      } else {
        const totalUsers = await UserModel.find(
          {
            role: upperCaseRole,
          },
          "-password -salt"
        );
        const result = await UserModel.find(
          {
            role: upperCaseRole,
          },
          "-password -salt"
        )
          .skip(skip)
          .limit(dataLimit)
          .sort({ createdAt: -1 });
        res.status(200).send({
          message: "Lấy thông tin tất cả người dùng theo vai trò thành công!",
          data: result,
          totalPages: Math.ceil(totalUsers.length / dataLimit),
        });
      }
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  // Chỉnh sửa thông tin
  modifyUser: [
    upload.single("avatar"),
    async (req, res) => {
      try {
        //verify token
        // const user = req.user;
        const { id } = req.params;
        const { email, username, fullname, phoneNumber, address, dateOfBirth } =
          req.body;
        // if (id !== user._id) throw new Error('Permisson denined!');
        const crrUser = await UserModel.findById(id);
        // tìm email đã tồn tại
        const existedEmail = await UserModel.findOne({ email });
        if (existedEmail && existedEmail.email !== crrUser.email)
          throw new Error("Email đã tồn tại!");
        // tìm username đã tồn tại
        const existedUsername = await UserModel.findOne({ username });
        if (existedUsername && existedUsername.username !== crrUser.username)
          throw new Error("Username đã tồn tại!");
        // avatar
        const avatar = req.file;
        if (avatar) {
          // handle upload
          const dataUrl = `data:${
            avatar.mimetype
          };base64,${avatar.buffer.toString("base64")}`;
          const uploaded = await cloudinary.uploader.upload(dataUrl, {
            resource_type: "auto",
          });
          crrUser.avatar = uploaded.url;
        }
        if (email) {
          crrUser.email = email;
        }
        if (username) {
          crrUser.username = username;
        }
        if (fullname) {
          crrUser.fullname = fullname;
        } else {
          crrUser.fullname = "";
        }
        if (phoneNumber) {
          crrUser.phoneNumber = phoneNumber;
        } else {
          crrUser.phoneNumber = "";
        }
        if (address) {
          crrUser.address = address;
        } else {
          crrUser.address = "";
        }
        if (dateOfBirth) {
          crrUser.dateOfBirth = dateOfBirth;
        } else {
          crrUser.dateOfBirth = "";
        }
        await crrUser.save();
        res.status(201).send({
          message: "Cập nhật thông tin người dùng thành công!",
          data: crrUser,
        });
      } catch (error) {
        res.status(500).send({
          message: error.message,
          data: null,
        });
      }
    },
  ],
  // xóa người dùng
  deleteUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const findByIdAndDelete = await UserModel.findByIdAndDelete(id);
      res.status(200).send({
        message: "Xóa người dùng thành công!",
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
};

export default UserController;
