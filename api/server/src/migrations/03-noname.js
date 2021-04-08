'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "pincode" to table "Users"
 * addColumn "address" to table "Users"
 * addColumn "gender" to table "Users"
 * addColumn "aadharNumber" to table "Users"
 *
 **/

var info = {
    "revision": 3,
    "name": "noname",
    "created": "2021-03-15T07:37:19.759Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "addColumn",
            params: [
                "Users",
                "pincode",
                {
                    "type": Sequelize.STRING,
                    "field": "pincode",
                    "len": 6
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "Users",
                "address",
                {
                    "type": Sequelize.STRING,
                    "field": "address"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "Users",
                "gender",
                {
                    "type": Sequelize.ENUM('M', 'F', 'O'),
                    "field": "gender"
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "Users",
                "aadharNumber",
                {
                    "type": Sequelize.STRING,
                    "field": "aadharNumber",
                    "unique": true,
                    "len": 12,
                    "allowNull": false,
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
                "Users",
                "pincode",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "Users",
                "address",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "Users",
                "gender",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "Users",
                "aadharNumber",
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
