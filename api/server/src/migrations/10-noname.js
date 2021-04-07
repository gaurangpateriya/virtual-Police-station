'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "notifToken" to table "Employees"
 * addColumn "remark" to table "FIRs"
 * changeColumn "role" on table "Employees"
 *
 **/

var info = {
    "revision": 10,
    "name": "noname",
    "created": "2021-04-07T06:57:29.461Z",
    "comment": ""
};

var migrationCommands = function (transaction) {
    return [{
        fn: "addColumn",
        params: [
            "Employees",
            "notifToken",
            {
                "type": Sequelize.STRING,
                "field": "notifToken"
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
            "remark",
            {
                "type": Sequelize.TEXT,
                "field": "remark"
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
                "defaultValue": "Not Assigned",
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
        fn: "removeColumn",
        params: [
            "Employees",
            "notifToken",
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: "removeColumn",
        params: [
            "FIRs",
            "remark",
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
