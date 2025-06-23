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

    async updateComment(commentId, userId, updateData) {
        console.log('updateComment params:', { commentId, userId, updateData });

        const comment = await this.db.Comment.findOne({
            where: { id: commentId }
        });

        if (!comment) throw new Error("Comment not found");
        if (comment.user_id !== userId) throw new Error("You don't have permission to update this comment");

        return await comment.update(updateData);
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

        return {message: "Yorum başarıyla silindi"}
    
    }



    async getAllComments(){
        return await this.db.Comment.findAll();
    }


}

module.exports = new commentService();