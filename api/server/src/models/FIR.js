
const { Model } = require('sequelize');
import { firStatus } from '../../../../constants'

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
      stolenMobileNumber: { type: DataTypes.STRING },
      stolenMobileModel: { type: DataTypes.STRING },
      stolenMobileIMEINumber: { type: DataTypes.STRING },
      vehicleNumber: { type: DataTypes.STRING },
      registrationNumber: { type: DataTypes.STRING },
      vehicleModel: { type: DataTypes.STRING },
      vehicleType: { type: DataTypes.STRING }

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
