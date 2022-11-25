/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  const query = `create table employee(
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) not null,
    lastName VARCHAR(255) not null,
    email VARCHAR(255) UNIQUE not null,
    password TEXT)
    
    `;
  return knex.schema.raw(query);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  const query = "drop table employee cascade";
  return knex.schema.raw(query);
}
