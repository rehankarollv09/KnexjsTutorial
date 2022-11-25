/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('blog').del()
  await knex('blog').insert([
    {id: 1, description: "first blog",employee_id:2},
    {id: 2, description: "second Blog",employee_id:2},
  ]);
}
