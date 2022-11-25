/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("blog").del();
  await knex("employee").insert([
    {
      first_name: "Rehan",
      last_name: "Karol",
      email: "testemail@gmail.com",
      password: "hashpassword",
    },
    {
      first_name: "Usman",
      last_name: "Karol",
      email: "testemail1@gmail.com",
      password: "hashpassword",
    },
    {
      first_name: "Rehan",
      last_name: "Karol",
      email: "testemail2@gmail.com",
      password: "hashpassword",
    },
  ]);
}
