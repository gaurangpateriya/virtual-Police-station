
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class FirImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  FirImage.init(
    {

      name: DataTypes.STRING,
      type: DataTypes.STRING,
      image: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'FirImage',
    },
  );

  FirImage.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return FirImage;
};
