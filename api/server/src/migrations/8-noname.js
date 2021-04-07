'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "role" on table "Employees"
 * changeColumn "UserId" on table "FIRs"
 * changeColumn "UserId" on table "FIRs"
 * changeColumn "EmployeeId" on table "FIRs"
 * changeColumn "EmployeeId" on table "FIRs"
 *
 **/

var info = {
    "revision": 8,
    "name": "noname",
    "created": "2021-04-04T14:55:24.615Z",
    "comment": ""
};

var migrationCommands = function (transaction) {
    return [{
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
    },
    {
        fn: "changeColumn",
        params: [
            "FIRs",
            "UserId",
            {
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
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FIRs",
            "UserId",
            {
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
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FIRs",
            "EmployeeId",
            {
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
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FIRs",
            "EmployeeId",
            {
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
            {
                transaction: transaction
            }
        ]
    }
    ];
};
var rollbackCommands = function (transaction) {
    return [{
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
    },
    {
        fn: "changeColumn",
        params: [
            "FIRs",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "field": "UserId"
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FIRs",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "field": "UserId"
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FIRs",
            "EmployeeId",
            {
                "type": Sequelize.INTEGER,
                "field": "EmployeeId"
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FIRs",
            "EmployeeId",
            {
                "type": Sequelize.INTEGER,
                "field": "EmployeeId"
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
