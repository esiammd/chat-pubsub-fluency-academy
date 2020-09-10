import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("messages", (table) => {
    table.increments("id").primary();
    table.string("channel").notNullable();
    table.string("username").notNullable();
    table.string("message").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("messages");
}
