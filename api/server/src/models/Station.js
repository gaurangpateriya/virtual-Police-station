
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Station.init(
    {
      name: { type: DataTypes.STRING, required: true },
      area: { type: DataTypes.STRING },

    },
    {
      sequelize,
      modelName: 'Station',
    },
  );

  Station.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return Station;
};
