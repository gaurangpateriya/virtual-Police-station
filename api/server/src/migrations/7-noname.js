'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "FIRs", deps: []
 * changeColumn "role" on table "Employees"
 *
 **/

var info = {
    "revision": 7,
    "name": "noname",
    "created": "2021-04-04T14:54:08.096Z",
    "comment": ""
};

var migrationCommands = function (transaction) {
    return [{
        fn: "createTable",
        params: [
            "FIRs",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "accusedDesciption": {
                    "type": Sequelize.TEXT,
                    "field": "accusedDesciption"
                },
                "complaint": {
                    "type": Sequelize.TEXT,
                    "field": "complaint"
                },
                "date": {
                    "type": Sequelize.DATE,
                    "field": "date"
                },
                "placeOfOccurence": {
                    "type": Sequelize.TEXT,
                    "field": "placeOfOccurence"
                },
                "propertyDamage": {
                    "type": Sequelize.TEXT,
                    "field": "propertyDamage"
                },
                "witnessDetails": {
                    "type": Sequelize.TEXT,
                    "field": "witnessDetails"
                },
                "UserId": {
                    "type": Sequelize.INTEGER,
                    "field": "UserId"
                },
                "EmployeeId": {
                    "type": Sequelize.INTEGER,
                    "field": "EmployeeId"
                },
                "status": {
                    "type": Sequelize.STRING,
                    "field": "status",
                    "defaultValue": "Not Assigned"
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
                }
            },
            {
                "transaction": transaction
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Employees",
            "role",
            {
                "type": Sequelize.STRING,
                "field": "role",

                "required": true
            },
            {
                transaction: transaction
            }
        ]
    }
    ];
};
var rollbackCommands = function (transaction) {
    return [{
        fn: "dropTable",
        params: ["FIRs", {
            transaction: transaction
        }]
    },
    {
        fn: "changeColumn",
        params: [
            "Employees",
            "role",
            {
                "type": Sequelize.STRING,
                "field": "role",

                "required": true
            },
            {
                transaction: transaction
            }
        ]
    }
    ];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function (queryInterface, Sequelize, _commands) {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function (resolve, reject) {
                function next() {
                    if (index < commands.length) {
                        let command = commands[index];
                        console.log("[#" + index + "] execute: " + command.fn);
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
    up: function (queryInterface, Sequelize) {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function (queryInterface, Sequelize) {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};
