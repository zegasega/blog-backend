const BaseController = require('../core/base_controller');

class commentController extends BaseController {
    constructor() {
        super();
    }

    async createComment(req, res) {
        const userId = req.user.id;
        const commentPayload = {
            ...req.body,
            user_id: userId,
        };

        try {
            const result = await this.service.commentService.createComment(commentPayload);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getCommentsByPost(req, res) {
        const postId = req.params.postId;

        try {
            const result = await this.service.commentService.getCommentsByPostId(postId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteComment(req, res) {
        const commentId = req.params.commentId;
        const userId = req.user.id;

        try {
            const result = await this.service.commentService.deleteComment(commentId, userId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateComment(req, res) {
        const commentId = req.params.commentId;
        const userId = req.user.id;
        const updateData = req.body;

        try {
            const result = await this.service.commentService.updateComment(commentId, userId, updateData);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllComments(req, res) {
        try {
            const result = await this.service.commentService.getAllComments();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}




module.exports = new commentController();