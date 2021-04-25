

const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class SafeTravel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  SafeTravel.init(
    {
      UserId: DataTypes.INTEGER,
      startLocation: DataTypes.STRING,
      endLocation: DataTypes.STRING,
      lastLocation: DataTypes.STRING,
      status: DataTypes.STRING,
      vehicleNumber: DataTypes.STRING,
      endDate: DataTypes.DATE

    },
    {
      sequelize,
      modelName: 'SafeTravel',
    },
  );

  SafeTravel.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return SafeTravel;
};
