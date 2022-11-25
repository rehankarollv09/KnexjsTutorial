import env from "dotenv";
env.config();
export const development = {
  client: "postgresql",
  connection: {
    database: "Blog",
    user: "postgres",
    password: "1234",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
