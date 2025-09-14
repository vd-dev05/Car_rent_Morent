import bcrypt from "bcrypt";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

import NewsModel from "../models/NewsModel.js";
import { uploadNewPost } from "../config/fileUpload.js";

const newsController = {
    // Tạo tin tức mới
    createNews: [ uploadNewPost.single('file'), async (req, res) => {
        try {
            const currentUser = req.currentUser;
            const {title, subTitle, content, isCategory, isStatus} = req.body;
            const file = req.file;
            if (!file) throw new Error('Chưa lựa chọn ảnh!');
            const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const fileName = file.originalname.split('.')[0];
            const result = await cloudinary.uploader.upload(dataUrl, {
                public_id: fileName,
                resource_type: 'auto',
            });
            const createNews = await NewsModel.create({
                author: currentUser._id,
                title,
                subTitle,
                content,
                img: result.secure_url,
                isCategory,
                isStatus,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            if (isStatus === 'published') {
                res.status(201).send({
                    message: 'Đăng bài viết mới thành công!',
                    data: createNews,
                });
            };
            if (isStatus === 'draft') {
                res.status(201).send({
                    message: 'Đã lưu bản nháp!',
                    data: createNews,
                });
            };
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    }],
    // Chỉnh sửa tin tức
    editNews: [ uploadNewPost.single('file'), async (req, res) => {
        try {
            const currentUser = req.currentUser;
            const {title, subTitle, content, addImg, isCategory, isStatus} = req.body;
            const {id} = req.params;
            const file = req.file;
            if (!file) {
                const editNews = await NewsModel.findByIdAndUpdate({
                    _id: id,
                }, {
                    author: currentUser._id,
                    title,
                    subTitle,
                    content,
                    img: addImg,
                    isCategory,
                    isStatus,
                    updatedAt: new Date(),
                });
                res.status(201).send({
                    message: 'Sửa bài viết thành công!',
                    data: editNews,
                });
            } else {
                const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const fileName = file.originalname.split('.')[0];
                const result = await cloudinary.uploader.upload(dataUrl, {
                    public_id: fileName,
                    resource_type: 'auto',
                });
                const editNews = await NewsModel.findByIdAndUpdate({
                    _id: id,
                }, {
                    author: currentUser._id,
                    title,
                    subTitle,
                    content,
                    img: result.secure_url,
                    isCategory,
                    isStatus,
                    updatedAt: new Date(),
                });
                res.status(201).send({
                    message: 'Sửa bài viết thành công!',
                    data: editNews,
                });
            }
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    }],
    // Đếm tất cả tin theo trạng thái
    countNews: async (req, res) => {
        try {
            const totalNews = await NewsModel.find({}, '-content');
            const publishedNews = await NewsModel.find({isStatus: 'published'}, '-content');
            const draftNews = await NewsModel.find({isStatus: 'draft'}, '-content');
            res.status(200).send({
                message: 'Đếm tin tức thành công!',
                totalNews: totalNews.length,
                publishedNews: publishedNews.length,
                draftNews: draftNews.length,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Lấy tất cả tin theo trạng thái
    getAllNews: async (req, res) => {
        try {
            const {limit, currentPage, isStatus} = req.query;
            const dataLimit = parseInt(limit);
            const pageNumber = parseInt(currentPage) || 1;
            const skip = (pageNumber - 1) * dataLimit;
            if (isStatus === 'all') {
                const totalNews = await NewsModel.find({}, '-content');
                const result = await NewsModel.find({}, '-content')
                .skip(skip)
                .limit(dataLimit)
                .sort({createdAt: -1})
                .populate('author', 'username avatar');
                res.status(200).send({
                    message: 'Lấy thông tin tất cả bài viết thành công!',
                    data: result,
                    totalPages: Math.ceil(totalNews.length / dataLimit),
                });
            } else {
                const totalNews = await NewsModel.find({
                    isStatus: isStatus
                }, '-content');
                const result = await NewsModel.find({
                    isStatus: isStatus
                }, '-content')
                .skip(skip)
                .limit(dataLimit)
                .sort({createdAt: -1})
                .populate('author', 'username avatar');
                res.status(200).send({
                    message: 'Lấy thông tin tất cả bài viết theo trạng thái thành công!',
                    data: result,
                    totalPages: Math.ceil(totalNews.length / dataLimit),
                });
            }
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Đếm tất cả tin theo trạng thái theo danh mục
    countNewsByCategory: async (req, res) => {
        try {
            const {isCategory} = req.params;
            const totalNews = await NewsModel.find({
                isCategory: isCategory,
            }, '-content');
            const publishedNews = await NewsModel.find({
                isStatus: 'published',
                isCategory: isCategory,
            }, '-content');
            const draftNews = await NewsModel.find({
                isStatus: 'draft',
                isCategory: isCategory,
            }, '-content');
            res.status(200).send({
                message: 'Đếm tin tức theo danh mục thành công!',
                totalNews: totalNews.length,
                publishedNews: publishedNews.length,
                draftNews: draftNews.length,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Lấy tất cả tin theo trạng thái theo danh mục
    getNewsByCategory: async (req, res) => {
        try {
            const {limit, currentPage, isStatus, isCategory} = req.query;
            const dataLimit = parseInt(limit);
            const pageNumber = parseInt(currentPage) || 1;
            const skip = (pageNumber - 1) * dataLimit;
            if (isStatus === 'all') {
                const totalNews = await NewsModel.find({
                    isCategory: isCategory,
                }, '-content');
                const result = await NewsModel.find({
                    isCategory: isCategory,
                }, '-content')
                .skip(skip)
                .limit(dataLimit)
                .sort({createdAt: -1})
                .populate('author', 'username avatar');
                res.status(200).send({
                    message: 'Lấy thông tin tất cả bài viết theo danh mục thành công!',
                    data: result,
                    totalPages: Math.ceil(totalNews.length / dataLimit),
                });
            } else {
                const totalNews = await NewsModel.find({
                    isStatus: isStatus,
                    isCategory: isCategory,
                }, '-content');
                const result = await NewsModel.find({
                    isStatus: isStatus,
                    isCategory: isCategory,
                }, '-content')
                .skip(skip)
                .limit(dataLimit)
                .sort({createdAt: -1})
                .populate('author', 'username avatar');
                res.status(200).send({
                    message: 'Lấy thông tin tất cả bài viết theo trạng thái theo danh mục thành công!',
                    data: result,
                    totalPages: Math.ceil(totalNews.length / dataLimit),
                });
            }
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Lấy 3 tin mới nhất mỗi danh mục
    getThe3LatestNewsPerCategory: async (req, res) => {
        try {
            const result = await NewsModel.find({
                isStatus: 'published'
            }, '-content')
            .sort({createdAt: -1})
            .populate('author', 'username avatar');
            const listCarNews = result.filter((item) => item.isCategory === 'carNews').slice(0,3);
            const listMarketNews = result.filter((item) => item.isCategory === 'marketNews').slice(0,3);
            const listExplore = result.filter((item) => item.isCategory === 'explore').slice(0,3);
            res.status(200).send({
                message: 'Lấy thông tin 3 bài viết mới nhất mỗi danh mục thành công!',
                dataListCarNews: listCarNews,
                dataListMarketNews: listMarketNews,
                dataListExplore: listExplore,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Lấy tất cả tin đã xuất bản theo danh mục
    getNewsPublishedByCategory: async (req, res) => {
        try {
            const {isCategory, limit, currentPage} = req.query;
            const dataLimit = parseInt(limit) || 4;
            const pageNumber = parseInt(currentPage) || 1;
            const skip = (pageNumber - 1) * dataLimit;
            const totalNews = await NewsModel.find({
                isCategory: isCategory,
                isStatus: 'published'
            }, '-content')
            const result = await NewsModel.find({
                isCategory: isCategory,
                isStatus: 'published'
            }, '-content')
            .skip(skip)
            .limit(dataLimit)
            .sort({createdAt: -1})
            .populate('author', 'username avatar');
            res.status(200).send({
                message: 'Lấy thông tin tất cả bài viết theo danh mục thành công!',
                data: result,
                totalPages: Math.ceil(totalNews.length / dataLimit),
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Lấy thông tin tin tức theo id
    getNewsById: async (req, res) => {
        try {
            const {id} = req.params;
            const result = await NewsModel.findById(id)
            .populate('author', 'username avatar');
            res.status(200).send({
                message: 'Lấy thông tin bài viết thành công!',
                data: result,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Xóa tin
    deleteNewsById: async (req, res) => {
        try {
            const {id} = req.params;
            const findByIdAndDelete = await NewsModel.findByIdAndDelete(id)
            res.status(200).send({
                message: 'Xóa tin tức thành công!',
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
}

export default newsController