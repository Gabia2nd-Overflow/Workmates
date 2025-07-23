module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nickname: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    tableName: 'USER',
    timestamps: false
  });

  return User;
};