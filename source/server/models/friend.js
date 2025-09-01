const { timeStamp } = require("console");

module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    //define : 테이블 설계
    "Friend",
    {
      id: { type: DataTypes.STRING, primaryKey: true }, // uuid
      requester_id: { type: DataTypes.STRING, allowNull: false }, // 보낸 사람
      receiver_id: { type: DataTypes.STRING, allowNull: false }, // 받은 사람
      status: {
        // 친구 관계 상태
        type: DataTypes.ENUM("pending", "accepted", "rejected"), // pending = 대기중 / accepted = 수락됨 / rejected = 거절됨
        allowNull: false,
        defaultValue: "pending", // 기본값 = pending
      },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // 요청이 만들어진 날짜/시간
    },
    {
      tableName: "FRIEND",
      timeStamp: false,
    }
  );

  // User 테이블과 관계 맺기
  Friend.associate = (models) => {
    //associate : 다른 테이블(User)와 연결 규칙
    Friend.belongsTo(models.User, {
      foreignKey: "requester_id",
      as: "Requester",
    });
    Friend.belongsTo(models.User, {
      foreignKey: "receiver_id",
      as: "Receiver",
    });
  };
  return Friend;
};
