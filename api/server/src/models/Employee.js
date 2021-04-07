

const { Model } = require('sequelize');
import { employeeRoles } from '../../../../constants'

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Employee.init(
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

      role: {
        type: DataTypes.STRING,
        required: true,
        defaultValue: employeeRoles.UNASSIGNED
      },
      currentLocation: {
        type: DataTypes.STRING,
      },
      aadharNo: {
        type: DataTypes.STRING,
        len: 12,
        unique: true,
      },
      onDuty: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      notifToken: {
        type: DataTypes.STRING,

      }

    },
    {
      sequelize,
      modelName: 'Employee',
    },
  );

  Employee.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return Employee;
};
