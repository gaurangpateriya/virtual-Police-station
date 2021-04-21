
const { Model } = require('sequelize');
import { NocApplicationStatus } from '../../../../constants'

module.exports = (sequelize, DataTypes) => {
  class NocApplication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  NocApplication.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      form: DataTypes.TEXT,
      status: { type: DataTypes.STRING, defaultValue: NocApplicationStatus.SUBMITTED },
      verifiedCertificate: DataTypes.TEXT,
      remarks: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'NocApplication',
    },
  );

  NocApplication.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return NocApplication;
};
