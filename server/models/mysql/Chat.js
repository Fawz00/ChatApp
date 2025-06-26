module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define("Chat", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    isGroup: { type: DataTypes.BOOLEAN, defaultValue: false },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    groupPhoto: DataTypes.STRING,
  }, { timestamps: true });

  Chat.associate = models => {
    Chat.belongsToMany(models.User, {
      through: 'ChatParticipants',
      as: 'participants',
      foreignKey: 'chatId',
      otherKey: 'userId'
    });

    Chat.belongsToMany(models.User, {
      through: 'ChatAdmins',
      as: 'admins',
      foreignKey: 'chatId',
      otherKey: 'userId'
    });

    Chat.hasOne(models.Message, {
      as: 'lastMessage',
      foreignKey: 'chatId',
      constraints: false
    });

    Chat.hasMany(models.Message, { foreignKey: 'chatId' });
  };

  return Chat;
};
