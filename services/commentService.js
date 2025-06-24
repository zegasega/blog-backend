const { where } = require("sequelize");
const BaseService = require("../core/base_service");
const db = require("../db/index");
const { message } = require("../validators/userSchema");
class commentService extends BaseService {
    constructor() {
        super(db.Comment);
        this.db = db;
    }

    async createComment(commentPayload) {
        const { post_id } = commentPayload;

        const post = await this.db.Post.findByPk(post_id);
        if (!post) throw new Error("Post not found");

        return await this.db.Comment.create(commentPayload);
    }

    async getCommentsByPostId(postId) {
        return await this.db.Comment.findAll({
            where: { post_id: postId },
            include: [
                {
                    model: this.db.User,
                    as: 'author',
                    attributes: ['id', 'username']
                }
            ],
            order: [['created_at', 'ASC']],
        });
    }

    async updateComment(req, res) {
        const commentId = req.params.commentId;

        if (!commentId) {
            return res.status(400).json({ error: 'Missing commentId in request parameters' });
        }

        const userId = req.user.id;
        const updateData = req.body;

        try {
            const result = await this.service.commentService.updateComment(commentId, userId, updateData);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }



    async deleteComment(commentId, userId) {
        const deletedRows = await this.db.Comment.destroy({
            where: {
                id: commentId,
                user_id: userId
            }
        });
        if (deletedRows === 0) {
            throw new Error('Yorum bulunamadı veya silme yetkiniz yok');
        }

        return { message: "Yorum başarıyla silindi" }

    }



    async getAllComments() {
        return await this.db.Comment.findAll();
    }


}

module.exports = new commentService();