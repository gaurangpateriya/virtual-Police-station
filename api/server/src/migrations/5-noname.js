'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "status" to table "Sos"
 * changeColumn "role" on table "Employees"
 *
 **/

var info = {
    "revision": 5,
    "name": "noname",
    "created": "2021-03-28T17:37:23.085Z",
    "comment": ""
};

var migrationCommands = function (transaction) {
    return [{
        fn: "addColumn",
        params: [
            "Sos",
            "status",
            {
                "type": Sequelize.STRING,
                "field": "status"
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
            "Sos",
            "status",
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
