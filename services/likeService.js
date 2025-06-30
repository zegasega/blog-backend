const BaseService = require("../core/base_service");
const db = require("../db/index");

class LikeService extends BaseService {
  constructor() {
    super(db.Like);
  }

  async toggleLike({ userId, postId }) {

    const existingLike = await this.db.Like.findOne({
      where: { user_id: userId, post_id: postId },
    });

    if (existingLike) {

      await existingLike.destroy();
      return { message: "post unliked", post_id: postId };
    } else {
      await this.model.create({ user_id: userId, post_id: postId });
      return { message: "post liked", post_id: postId };
    }
  }

  async getLikesByPostId(postId) {
    // Renamed variable for clarity, as it returns an array of like objects, not a count.
    const likes = await this.db.Like.findAll({ where: { post_id: postId } });
    return likes;
  }

  async getLikeCountByPostId(postId) {
    return await this.db.Like.count({ where: { post_id: postId } });
  }
}

module.exports = new LikeService();