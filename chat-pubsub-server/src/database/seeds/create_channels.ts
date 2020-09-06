import Knex from "knex";

export async function seed(knex: Knex) {
  await knex("channels").insert([
    { level: "A" },
    { level: "B" },
    { level: "C" },
    { level: "D" },
  ]);
}
