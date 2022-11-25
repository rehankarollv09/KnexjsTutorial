/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("employee").del();
  const query = `insert into employee(id,firstName,lastName,email,password) values(1,'Rehan','Karol','rehan@gmail.com','rehan8989'),(2,'suf','karol','email@email.com','hashPassword')`;
  await knex.raw(query);
}
