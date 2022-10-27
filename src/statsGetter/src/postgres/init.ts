import PostgresQuery from "./query";

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
    user_id serial PRIMARY KEY,
    username VARCHAR (255) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    github_user_id INT UNIQUE NOT NULL
    );
`;
const createConfigTable = `
CREATE TABLE IF NOT EXISTS configs (
    config_id serial PRIMARY KEY,
    user_id INT NOT NULL,
    config_name VARCHAR (255) NOT NULL,
    interval INT NOT NULL,
    host VARCHAR (255),
    port INT,
    shard VARCHAR (255),
    prefix VARCHAR (255) NOT NULL,
    stats_path VARCHAR (255),
    stats_segment INT,
    token VARCHAR (255) NOT NULL,
    username VARCHAR (255) NOT NULL,
    private_server_password VARCHAR (255),
    is_private_server BOOLEAN NOT NULL,
    is_stats_segment BOOLEAN NOT NULL,
    include_server_stats BOOLEAN NOT NULL,
    active BOOLEAN NOT NULL
    );
    `;

async function Initialize(): Promise<void> {
  console.log("Waiting for database to start...");
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log("Waited 10 seconds");
  await PostgresQuery(createUserTable);
  await PostgresQuery(createConfigTable);
  console.log("Created tables");
}
Initialize();
