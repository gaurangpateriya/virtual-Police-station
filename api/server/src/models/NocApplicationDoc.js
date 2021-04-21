
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class NocApplicationDoc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  NocApplicationDoc.init(
    {

      name: DataTypes.STRING,
      type: DataTypes.STRING,
      file: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'NocApplicationDoc',
    },
  );

  NocApplicationDoc.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return NocApplicationDoc;
};
