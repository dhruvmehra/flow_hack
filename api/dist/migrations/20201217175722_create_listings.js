"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable("listings", async (table) => {
        table.integer("listing_resource_id").primary();
        table.integer("item_id");
        table.integer("item_kind");
        table.integer("item_rarity");
        table.text("owner");
        table.text("name");
        table.text("image");
        table.decimal("price", null);
        table.text("transaction_id");
        table.timestamps(true, true);
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable("listings");
}
exports.down = down;
