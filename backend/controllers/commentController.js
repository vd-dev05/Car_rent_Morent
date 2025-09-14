import CommentModel from "../models/CommentModel.js";
import NewsModel from "../models/NewsModel.js";

const commentController = {
    // Tạo bình luận mới
    createComment: async (req, res) => {
        try {
            const currentUser = req.currentUser;
            const {newsId, content} = req.body;
            const newComment = await CommentModel.create({
                user: currentUser._id,
                news: newsId,
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            res.status(201).send({
                message: 'Tạo bình luận thành công!',
                data: newComment
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Đếm tất cả bình luận theo trạng thái
    countComments: async (req, res) => {
        try {
            const totalComments = await CommentModel.find({});
            const approvedComments = await CommentModel.find({isStatus: 'approved'});
            const spamComments = await CommentModel.find({isStatus: 'spam'});
            res.status(200).send({
                message: 'Đếm bình luận thành công!',
                totalComments: totalComments.length,
                approvedComments: approvedComments.length,
                spamComments: spamComments.length,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Lấy tất cả bình luận theo trạng thái
    getAllComment: async (req, res) => {
        try {
            const {limit, currentPage, isStatus} = req.query;
            const dataLimit = parseInt(limit);
            const pageNumber = parseInt(currentPage) || 1;
            const skip = (pageNumber - 1) * dataLimit;
            if (isStatus === 'all') {
                const totalComments = await CommentModel.find({});
                const result = await CommentModel.find({})
                .skip(skip)
                .limit(dataLimit)
                .sort({createdAt: -1})
                .populate('user', 'username avatar')
                .populate('news', 'title');
                res.status(200).send({
                    message: 'Lấy thông tin tất cả bình luận thành công!',
                    data: result,
                    totalPages: Math.ceil(totalComments.length / dataLimit),
                });
            } else {
                const totalComments = await CommentModel.find({
                    isStatus: isStatus
                });
                const result = await CommentModel.find({
                    isStatus: isStatus

                })
                .skip(skip)
                .limit(dataLimit)
                .sort({createdAt: -1})
                .populate('user', 'username avatar')
                .populate('news', 'title');
                res.status(200).send({
                    message: 'Lấy thông tin tất cả bình luận theo trạng thái thành công!',
                    data: result,
                    totalPages: Math.ceil(totalComments.length / dataLimit),
                });
            }
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Đếm tất cả bình luận theo trạng thái theo tin
    countCommentsByNews: async (req, res) => {
        try {
            const {newsId} = req.params;
            const totalComments = await CommentModel.find({
                news: newsId,
            });
            const approvedComments = await CommentModel.find({
                isStatus: 'approved',
                news: newsId,
            });
            const spamComments = await CommentModel.find({
                isStatus: 'spam',
                news: newsId,
            });
            res.status(200).send({
                message: 'Đếm bình luận theo tin thành công!',
                totalComments: totalComments.length,
                approvedComments: approvedComments.length,
                spamComments: spamComments.length,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Lấy tất cả bình luận theo trạng thái theo tin
    getCommentByNewsId: async (req, res) => {
        try {
            const {limit, currentPage, isStatus, newsId} = req.query;
            const dataLimit = parseInt(limit);
            const pageNumber = parseInt(currentPage) || 1;
            const skip = (pageNumber - 1) * dataLimit;
            if (isStatus === 'all') {
                const news = await NewsModel.findOne({
                    _id: newsId,
                });
                const newsTitle = news.title;
                const totalComment = await CommentModel.find({
                    news: newsId
                });
                const result = await CommentModel.find({
                    news: newsId
                })
                .skip(skip)
                .limit(dataLimit)
                .sort({createdAt: -1})
                .populate('user', 'username avatar')
                .populate('news', 'title');
                res.status(200).send({
                    message: 'Lấy thông tin tất cả bình luận theo tin thành công!',
                    data: result,
                    newsTitle: newsTitle,
                    totalPages: Math.ceil(totalComment.length / dataLimit)
                });
            } else {
                const news = await NewsModel.findOne({
                    _id: newsId,
                });
                const newsTitle = news.title;
                const totalComment = await CommentModel.find({
                    news: newsId,
                    isStatus: isStatus,
                });
                const result = await CommentModel.find({
                    news: newsId,
                    isStatus: isStatus,
                })
                .skip(skip)
                .limit(dataLimit)
                .sort({createdAt: -1})
                .populate('user', 'username avatar')
                .populate('news', 'title');
                res.status(200).send({
                    message: 'Lấy thông tin tất cả bình luận theo trạng thái theo tin thành công!',
                    data: result,
                    newsTitle: newsTitle,
                    totalPages: Math.ceil(totalComment.length / dataLimit)
                });
            }
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Chỉnh sửa bình luận
    editComment: async (req, res) => {
        const {id} = req.params;
        const {content} = req.body;
        const editComment = await CommentModel.findByIdAndUpdate({
            _id: id,
        }, {
            content,
            updatedAt: new Date(),
        });
        res.status(201).send({
            message: 'Sửa bình luận thành công!',
            data: editComment,
        });
    },
    // Thay đổi trạng thái bình luận
    changeCommentStatus: async (req, res) => {
        try {
            const {commentId, newStatus} = req.body;
            const changeCommentStatus = await CommentModel.findByIdAndUpdate({
                _id: commentId,
            }, {
                isStatus: newStatus,
                updatedAt: new Date(),
            });
            res.status(201).send({
                message: 'Thay đổi trạng thái bình luận thành công!',
                data: changeCommentStatus,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
    // Xóa bình luận
    deleteCommentById: async (req, res) => {
        try {
            const {id} = req.params;
            const findByIdAndDelete = await CommentModel.findByIdAndDelete(id)
            res.status(200).send({
                message: 'Xóa bình luận thành công!',
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
}

export default commentController