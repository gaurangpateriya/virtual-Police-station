

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: true,
      },
      password: DataTypes.STRING,
      mobileNo: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        len: 12,
        unique: true,
      },
      aadharNumber: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        len: 12,
        unique: true,
      },
      gender: {
        type: DataTypes.ENUM(['M', 'F', 'O'])
      },
      address: DataTypes.STRING,
      pincode: {
        type: DataTypes.STRING, len: 6,
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};
