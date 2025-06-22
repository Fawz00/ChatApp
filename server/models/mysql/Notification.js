module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('other', 'new_message', 'added_to_group', 'removed_from_group'),
      allowNull: false
    },
    messageId: DataTypes.STRING, // bisa jadi string karena tidak dijadikan FK
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { timestamps: true });

  Notification.associate = models => {
    Notification.belongsTo(models.User, { foreignKey: 'userId' });
    Notification.belongsTo(models.User, { foreignKey: 'sender' });
  };

  return Notification;
};
