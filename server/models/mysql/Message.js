module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    content: DataTypes.TEXT,
    media: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM('text', 'image', 'file'),
      defaultValue: 'text'
    },
    sceduledAt: DataTypes.DATE
  }, { timestamps: true });

  Message.associate = models => {
    Message.belongsTo(models.Chat, { foreignKey: 'chatId' });
    Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });

    Message.belongsToMany(models.User, {
      through: 'DeliveredMessages',
      as: 'deliveredTo',
      foreignKey: 'messageId',
      otherKey: 'userId'
    });

    Message.belongsToMany(models.User, {
      through: 'ReadMessages',
      as: 'readBy',
      foreignKey: 'messageId',
      otherKey: 'userId'
    });
  };

  return Message;
};
