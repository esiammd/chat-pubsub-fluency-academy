import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("channels", (table) => {
    table.increments("id").primary();
    table.string("channel").notNullable().unique();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("channels");
}
