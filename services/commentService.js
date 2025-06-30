const BaseService = require("../core/base_service");
const db = require("../db/index");
class CommentService extends BaseService {
    constructor() {
        super(db.Comment);
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
        const comment = await this.db.Comment.findOne({
            where: {
                id: commentId,
                user_id: userId
            }
        });

        if (!comment) {
            throw new Error('Comment not found or you do not have permission to update it.');
        }

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
            throw new Error('Comment not found or you do not have permission to delete it.');
        }

        return { message: "Comment deleted successfully" }

    }



    async getAllComments() {
        return await this.db.Comment.findAll();
    }


}

module.exports = new CommentService();