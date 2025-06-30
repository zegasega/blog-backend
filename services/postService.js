const BaseService = require("../core/base_service");
const db = require("../db/index");

class PostService extends BaseService {
    constructor() {
        super(db.Post);
        this.db = db;
    }

    async createPost(postPayload) {
        return await this.db.sequelize.transaction(async (t) => {
            const category = await this.db.Category.findByPk(postPayload.category_id, { transaction: t });
            if (!category) throw new Error("Kategori bulunamadı");

            const newPost = await this.db.Post.create(postPayload, { transaction: t });
            return newPost;
        });
    }

    async getPostById(postId) {
        const post = await this.db.Post.findByPk(postId, {
            include: [{ model: this.db.User, as: "author" }],
        });
        if (!post) throw new Error("Post not found");
        return post;
    }

    async updatePost({ postId, userId, updateData }) {
        const post = await this.db.Post.findByPk(postId);
        if (!post) throw new Error("Post not found");
        if (post.user_id !== userId) throw new Error("You are not authorized to update this post");

        return await post.update(updateData);
    }

    async deletePost(postId, userId) {
        return await this.db.sequelize.transaction(async (t) => {
            const post = await this.db.Post.findByPk(postId, { transaction: t });
            if (!post) throw new Error("Post not found");
            if (post.user_id !== userId) throw new Error("You are not authorized to delete this post");

            await this.db.Comment.destroy({ where: { post_id: postId }, transaction: t });
            await this.db.Like.destroy({ where: { post_id: postId }, transaction: t });
            await post.destroy({ transaction: t });

            return { message: "Post deleted successfully" };
        });
    }


    // total record pagınatıon 5 er 5er getir"  
    async getAllPosts() {
        return await this.db.Post.findAll({
            // For better performance on a list view, consider getting only the count of likes
            // instead of all the like objects. This can be done with a subquery.
            attributes: {
                include: [
                    [this.db.sequelize.literal('(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."post_id" = "Post"."id")'), 'likeCount']
                ]
            },
            include: [
                {
                    model: this.db.User,
                    as: "author",
                    attributes: ["username"]
                },
                {
                    model: this.db.Category,
                    as: "category",
                    attributes: ["name"]
                },
                // The 'likes' include is now replaced by the likeCount attribute above.
            ]
        });
    }




    async getPostsByUserId(userId) {
        return await this.db.Post.findAll({
            where: { user_id: parseInt(userId, 10) },
            include: [
                { model: this.db.User, as: "author", attributes: ["id", "username"] },
                { model: this.db.Category, as: "category", attributes: ["id", "name"] },
            ],
        });
    }

    async updatePostImage(post_id, imageUrl) {
        const post = await this.db.Post.findByPk(post_id);
        if (!post) {
            throw new Error("Post not found");
        }

        post.image_url = imageUrl;
        await post.save();

        return post;
    }


    async pagination(page = 1, limit = 5) {
        page = Math.max(1, parseInt(page));
        limit = Math.min(100, Math.max(1, parseInt(limit)));

        const offset = (page - 1) * limit;
        const total = await this.db.Post.count();

        const results = await this.db.Post.findAll({
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            include: [
                { model: this.db.User, as: "author", attributes: ["id", "username"] },
                { model: this.db.Category, as: "category", attributes: ["id", "name"] },
            ],
        });

        const hasMore = (page * limit) < total;

        return {
            page,
            limit,
            total,
            hasMore,
            results
        };
    }

    async searchPost(query) {
        return await this.db.Post.findAll({
            where: {
                title: {
                    [this.db.Sequelize.Op.like]: `%${query}%`
                }
            },
            include: [
                {
                    model: this.db.User,
                    as: "author",
                    attributes: ["username"]
                },
                {
                    model: this.db.Category,
                    as: "category",
                    attributes: ["name"]
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    }
}

module.exports = new PostService();
