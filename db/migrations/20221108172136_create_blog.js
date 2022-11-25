/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("blog", (table) => {
    table.increments("id");
    table.string("description", 244).notNullable();
    table.integer("employee_id").references("id").inTable("employee");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  const query = "drop table blog";
  return knex.schema.raw(query);
}
