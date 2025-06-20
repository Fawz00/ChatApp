module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    username: DataTypes.STRING,
    profilePhoto: DataTypes.STRING,
    bannerPhoto: DataTypes.STRING,
    description: DataTypes.TEXT,
    phoneNumber: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,
  }, { timestamps: true });

  User.associate = models => {
    User.hasMany(models.Message, { foreignKey: 'senderId' });
    User.hasMany(models.Notification, { foreignKey: 'userId' });
  };

  return User;
};
