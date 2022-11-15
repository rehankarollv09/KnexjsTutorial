/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('blog').del()
  await knex('employee').insert([
    {id: 1, first_name: "Rehan",last_name:"Karol",email:"testemail@gmail.com",password:"hashpassword"},
    {id: 2, first_name: "Usman",last_name:"Karol",email:"testemail1@gmail.com",password:"hashpassword"},
    {id: 3, first_name: "Rehan",last_name:"Karol",email:"testemail2@gmail.com",password:"hashpassword"}
  ]);
};
