'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Sos", deps: [Users, Employees]
 * addColumn "currentLocation" to table "Employees"
 * addColumn "aadharNo" to table "Employees"
 * addColumn "onDuty" to table "Employees"
 * changeColumn "role" on table "Employees"
 *
 **/

var info = {
    "revision": 4,
    "name": "noname",
    "created": "2021-03-28T08:51:27.428Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "Sos",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "reason": {
                        "type": Sequelize.TEXT,
                        "field": "reason"
                    },
                    "feedback": {
                        "type": Sequelize.TEXT,
                        "field": "feedback"
                    },
                    "UserId": {
                        "type": Sequelize.INTEGER,
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "Users",
                            "key": "id"
                        },
                        "allowNull": true,
                        "field": "UserId"
                    },
                    "EmployeeId": {
                        "type": Sequelize.INTEGER,
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "Employees",
                            "key": "id"
                        },
                        "allowNull": true,
                        "field": "EmployeeId"
                    },
                    "stars": {
                        "type": Sequelize.INTEGER,
                        "field": "stars"
                    },
                    "currentLocation": {
                        "type": Sequelize.STRING,
                        "field": "currentLocation"
                    },
                    "startLocation": {
                        "type": Sequelize.STRING,
                        "field": "startLocation"
                    },
                    "endLocation": {
                        "type": Sequelize.STRING,
                        "field": "endLocation"
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
            fn: "addColumn",
            params: [
                "Employees",
                "currentLocation",
                {
                    "type": Sequelize.STRING,
                    "field": "currentLocation"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "Employees",
                "aadharNo",
                {
                    "type": Sequelize.STRING,
                    "field": "aadharNo",
                    "unique": true,
                    "len": 12
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "Employees",
                "onDuty",
                {
                    "type": Sequelize.BOOLEAN,
                    "field": "onDuty",
                    "defaultValue": false
                },
                {
                    transaction: transaction
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
                    "defaultValue": "NOT ASSIGNED",
                    "required": true
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
                "Employees",
                "currentLocation",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "Employees",
                "aadharNo",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "Employees",
                "onDuty",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "dropTable",
            params: ["Sos", {
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
                    "defaultValue": "NOT ASSIGNED"
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
