/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  const query = `create table blog(id Serial Primary key,description text,employee_id int,CONSTRAINT fk_employee
      FOREIGN KEY(employee_id) 
	  REFERENCES employee(id)
	  ON DELETE SET NULL)`;
  return knex.schema.raw(query);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  const query = "drop table blog";
  return knex.schema.raw(query);
}
