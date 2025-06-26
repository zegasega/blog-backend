module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    category_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    title: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    content: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    image_url: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    is_published: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
  }, {
    tableName: 'posts',
    underscored: true,   // created_at, updated_at gibi sütun isimleri kullanılır
    timestamps: true,    // Sequelize otomatik createdAt ve updatedAt yönetir
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'author',
      onDelete: 'CASCADE',
    });

    Post.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
      onDelete: 'SET NULL',
    });

    Post.hasMany(models.Comment, {
      foreignKey: 'post_id',
      as: 'comments',
      onDelete: 'CASCADE',
      hooks: true,
    });

    Post.hasMany(models.Like, {
      as: 'likes',
      foreignKey: 'post_id',
    });
  };

  return Post;
};
