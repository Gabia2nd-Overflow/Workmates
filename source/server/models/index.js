const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 모델 등록
db.User = require("./user")(sequelize, DataTypes);
db.Email = require("./email")(sequelize, DataTypes);
db.Friend = require("./friend")(sequelize, DataTypes);

// 관계 연결
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
