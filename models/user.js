const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    // 첫번째 인수는 컬럼 정의, 두번째 인수는 모델 설정
    User.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true,
        },
        nickname: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false, // allowNull : required?
        },
      },
      {
        sequelize,
        timestamps: true, // createdAt, updatedAt
        underscored: false, // created-at, update-at
        modelName: "User",
        tableName: "users",
        paranoid: true, // deletedAt
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post); // 사용자와 게시글은 일대다 관계
  }
}

module.exports = User;
