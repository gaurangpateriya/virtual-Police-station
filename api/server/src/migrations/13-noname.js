'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "FirImages", deps: [FIRs]
 * addColumn "vehicleType" to table "FIRs"
 * addColumn "vehicleModel" to table "FIRs"
 * addColumn "registrationNumber" to table "FIRs"
 * addColumn "vehicleNumber" to table "FIRs"
 * addColumn "stolenMobileIMEINumber" to table "FIRs"
 * addColumn "stolenMobileModel" to table "FIRs"
 * addColumn "stolenMobileNumber" to table "FIRs"
 *
 **/

var info = {
    "revision": 13,
    "name": "noname",
    "created": "2021-04-17T16:50:19.157Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "FirImages",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "name": {
                        "type": Sequelize.STRING,
                        "field": "name"
                    },
                    "type": {
                        "type": Sequelize.STRING,
                        "field": "type"
                    },
                    "image": {
                        "type": Sequelize.TEXT,
                        "field": "image"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "FIRId": {
                        "type": Sequelize.INTEGER,
                        "field": "FIRId",
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "FIRs",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "FIRs",
                "vehicleType",
                {
                    "type": Sequelize.STRING,
                    "field": "vehicleType"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "FIRs",
                "vehicleModel",
                {
                    "type": Sequelize.STRING,
                    "field": "vehicleModel"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "FIRs",
                "registrationNumber",
                {
                    "type": Sequelize.STRING,
                    "field": "registrationNumber"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "FIRs",
                "vehicleNumber",
                {
                    "type": Sequelize.STRING,
                    "field": "vehicleNumber"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "FIRs",
                "stolenMobileIMEINumber",
                {
                    "type": Sequelize.STRING,
                    "field": "stolenMobileIMEINumber"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "FIRs",
                "stolenMobileModel",
                {
                    "type": Sequelize.STRING,
                    "field": "stolenMobileModel"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "FIRs",
                "stolenMobileNumber",
                {
                    "type": Sequelize.STRING,
                    "field": "stolenMobileNumber"
                },
                {
                    transaction: transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "removeColumn",
            params: [
                "FIRs",
                "vehicleType",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "FIRs",
                "vehicleModel",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "FIRs",
                "registrationNumber",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "FIRs",
                "vehicleNumber",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "FIRs",
                "stolenMobileIMEINumber",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "FIRs",
                "stolenMobileModel",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "FIRs",
                "stolenMobileNumber",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "dropTable",
            params: ["FirImages", {
                transaction: transaction
            }]
        }
    ];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function(queryInterface, Sequelize, _commands)
    {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log("[#"+index+"] execute: " + command.fn);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};
