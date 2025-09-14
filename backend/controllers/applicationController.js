import bcrypt from "bcrypt";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { io } from "../socket/socket.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

import UserModel from "../models/UserModel.js";
import ApplicationModel from "../models/ApplicationModel.js";

const ApplicationController = {
    // Đăng ký làm nhà cung cấp
    registerProvider: async (req, res) => {
        try {
            const { id } = req.params;
            const findApplicationExist = await ApplicationModel.findOne({
                userId: id,
            });
            if (findApplicationExist) throw new Error("Bạn đã đăng ký, vui lòng chờ phản hồi!");
            const application = await ApplicationModel.create({
                userId: id,
            });
            // io.to("admin-room").emit("register-provider", {
            //   message: `Có người đăng ký làm provider`,
            // });
            io.to("67743d92d77271d4f50a0c1a").emit("register-provider", {
                message: `Có người đăng ký làm provider`,
            });
            res.status(200).send({
                message: "Gửi thành công, chờ được phê duyệt",
                data: application,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Đếm đơn
    countApplys: async (req, res) => {
        try {
            const totalApplys = await ApplicationModel.find({});
            res.status(200).send({
                message: "Đếm đơn đăng ký làm nhà cung cấp thành công!",
                totalApplys: totalApplys.length,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
      },
    // Lấy tất cả đơn đăng ký theo trạng thái
    getAllApplys: async (req, res) => {
        try {
            const { limit, currentPage } = req.query;
            const dataLimit = parseInt(limit);
            const pageNumber = parseInt(currentPage) || 1;
            const skip = (pageNumber - 1) * dataLimit;

            const totalApplys = await ApplicationModel.find({});
            const result = await ApplicationModel.find({})
            .skip(skip)
            .limit(dataLimit)
            .sort({ createdAt: -1 })
            .populate("userId", "avatar username email fullname phoneNumber address dateOfBirth");
            res.status(200).send({
                message: "Lấy danh sách đơn thành công!",
                data: result,
                totalPages: Math.ceil(totalApplys.length / dataLimit),
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Duyệt đơn
    approve: async (req, res) => {
        try {
            const { id } = req.params;
            const find = await ApplicationModel.findById(id);
            const userId = find.userId;
            await UserModel.findByIdAndUpdate(userId, {
                role: 'PROVIDER'
            });
            await ApplicationModel.findByIdAndDelete(id);
            return res.status(201).send({
                message: "Duyệt đơn thành công!",
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
            });
        }
    },
}

export default ApplicationController;