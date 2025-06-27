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
        // URL parametresinden commentId alınıyor
        const commentId = Number(req.params.commentId);
        const userId = req.user.id;

        if (isNaN(commentId)) {
            return res.status(400).json({ error: 'Geçersiz commentId' });
        }

        try {
            const result = await this.service.commentService.deleteComment(commentId, userId);
            res.status(200).json(result);
        } catch (error) {
            console.error('Delete comment error:', error);
            res.status(403).json({ error: error.message });
        }
    }



    async updateComment(req, res) {
        const commentId = req.params.commentId;
        const userId = req.user?.id;
        const updateData = req.body;

        if (!commentId) {
            return res.status(400).json({ error: 'commentId parametresi eksik' });
        }

        try {
            const updatedComment = await this.commentService.updateComment(commentId, userId, updateData);
            return res.status(200).json(updatedComment);
        } catch (error) {
            return res.status(500).json({ error: error.message });
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