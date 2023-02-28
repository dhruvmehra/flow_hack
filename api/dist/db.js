"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("knex");
const objection_1 = require("objection");
const initDB = config => {
    // Use a Postgres DB in production.
    const DBConfig = process.env.NODE_ENV === 'production' ? {
        client: "postgresql",
        connection: {
            connectionString: config.databaseUrl,
            ssl: process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
        },
        migrations: {
            directory: config.databaseMigrationPath,
        },
    } : {
        client: "better-sqlite3",
        useNullAsDefault: true,
        connection: {
            filename: "./" + config.dbPath,
        },
        migrations: {
            directory: config.databaseMigrationPath,
        },
    };
    const knexInstance = (0, knex_1.knex)(DBConfig);
    objection_1.Model.knex(knexInstance);
    return knexInstance;
};
exports.default = initDB;
