/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.js`)[env];
const db = {};

// console.log(config);
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter(
    (file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js',
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Associations will be defined here
// user has many sos 
db.User.hasMany(db.Sos, { onDelete: 'CASCADE' });
db.Sos.belongsTo(db.User);

db.Employee.hasMany(db.Sos);
db.Sos.belongsTo(db.Employee);

db.User.hasMany(db.FIR, { onDelete: 'CASCADE' });
db.FIR.belongsTo(db.User);

db.Employee.hasMany(db.FIR);
db.FIR.belongsTo(db.Employee);

db.User.hasMany(db.UserRelatives, { onDelete: 'CASCADE' });
db.UserRelatives.belongsTo(db.User);

db.FIR.hasMany(db.FirImage, { onDelete: 'CASCADE' });
db.FirImage.belongsTo(db.FIR);

db.User.hasMany(db.NocApplication, { onDelete: 'CASCADE' });
db.NocApplication.belongsTo(db.User);

db.NocApplication.hasMany(db.NocApplicationDoc, { onDelete: 'CASCADE', as: 'relatedDocuments' });
db.NocApplicationDoc.belongsTo(db.NocApplication);

module.exports = db;
