

const { Model } = require('sequelize');
import { emplyoeeSosResponse, SosRoles } from '../../../../constants'

module.exports = (sequelize, DataTypes) => {
  class Sos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Sos.init(
    {
      reason: DataTypes.TEXT,
      feedback: DataTypes.TEXT,
      UserId: DataTypes.INTEGER,
      EmployeeId: DataTypes.INTEGER,
      stars: DataTypes.INTEGER,
      currentLocation: DataTypes.STRING,
      startLocation: DataTypes.STRING,
      endLocation: DataTypes.STRING,
      status: DataTypes.STRING,
      employeeResponse: { type: DataTypes.STRING, defaultValue: emplyoeeSosResponse.NO_RESPONSE },
    },
    {
      sequelize,
      modelName: 'Sos',
    },
  );

  Sos.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return Sos;
};
