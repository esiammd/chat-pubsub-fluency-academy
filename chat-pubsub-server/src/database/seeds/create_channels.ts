import Knex from "knex";

export async function seed(knex: Knex) {
  await knex("channels").insert([
    { channel: "A" },
    { channel: "B" },
    { channel: "C" },
    { channel: "D" },
  ]);
}
