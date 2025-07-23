module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define('Email', {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: DataTypes.STRING,
    auth_token: DataTypes.STRING
  }, {
    tableName: 'EMAIL',
    timestamps: false
  });

  Email.associate = models => {
    Email.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Email;
};
