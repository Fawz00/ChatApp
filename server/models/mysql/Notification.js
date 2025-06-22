module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('other', 'new_message', 'added_to_chat', 'removed_from_chat', 'mentioned'),
      allowNull: false
    },
    messageId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Message',
        key: 'id'
      }
    },
    chatId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Chat',
        key: 'id'
      }
    },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { timestamps: true });

  Notification.associate = models => {
    Notification.belongsTo(models.User, { foreignKey: 'userId' });
    Notification.belongsTo(models.User, { foreignKey: 'sender' });
  };

  return Notification;
};
