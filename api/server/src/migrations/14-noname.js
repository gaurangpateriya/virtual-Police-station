'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "NocApplications", deps: []
 * createTable "NocApplicationDocs", deps: [NocApplications]
 *
 **/

var info = {
    "revision": 14,
    "name": "noname",
    "created": "2021-04-19T08:56:26.430Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "NocApplications",
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
                    "form": {
                        "type": Sequelize.TEXT,
                        "field": "form"
                    },
                    "status": {
                        "type": Sequelize.STRING,
                        "field": "status",
                        "defaultValue": "Submitted"
                    },
                    "verifiedCertificate": {
                        "type": Sequelize.TEXT,
                        "field": "verifiedCertificate"
                    },
                    "remarks": {
                        "type": Sequelize.TEXT,
                        "field": "remarks"
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
            fn: "createTable",
            params: [
                "NocApplicationDocs",
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
                    "file": {
                        "type": Sequelize.TEXT,
                        "field": "file"
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
                    "NocApplicationId": {
                        "type": Sequelize.INTEGER,
                        "field": "NocApplicationId",
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "NocApplications",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "dropTable",
            params: ["NocApplications", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["NocApplicationDocs", {
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
