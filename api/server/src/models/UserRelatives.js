
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class UserRelatives extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  UserRelatives.init(
    {
      name: DataTypes.TEXT,
      mobileNo: DataTypes.TEXT,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserRelatives',
    },
  );

  UserRelatives.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return UserRelatives;
};
