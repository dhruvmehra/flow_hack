"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.createTable("block_cursor", async (table) => {
        table.uuid("id").primary();
        table.bigInteger("current_block_height");
        table.timestamps(true, true);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable("block_cursor");
}
exports.down = down;
