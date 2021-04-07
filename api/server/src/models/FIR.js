
const { Model } = require('sequelize');
import { emplyoeeFIRResponse, FIRRoles, firStatus } from '../../../../constants'

module.exports = (sequelize, DataTypes) => {
  class FIR extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  FIR.init(
    {
      accusedDesciption: DataTypes.TEXT,
      complaint: DataTypes.TEXT,
      date: DataTypes.DATE,
      placeOfOccurence: DataTypes.TEXT,
      propertyDamage: DataTypes.TEXT,
      witnessDetails: DataTypes.TEXT,
      UserId: DataTypes.INTEGER,
      EmployeeId: DataTypes.INTEGER,
      crimeNature: DataTypes.STRING,
      status: { type: DataTypes.STRING, defaultValue: firStatus.NOT_ASSIGNED },
      remark: { type: DataTypes.TEXT },

    },
    {
      sequelize,
      modelName: 'FIR',
    },
  );

  FIR.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return FIR;
};
