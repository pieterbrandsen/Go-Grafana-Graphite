import PostgresQuery from './query'

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
    user_id serial PRIMARY KEY,
    username VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL
 );
`
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
    include_server_stats BOOLEAN NOT NULL
);
    `

async function Initialize (): Promise<void> {
  await PostgresQuery(createUserTable)
  await PostgresQuery(createConfigTable)
}
Initialize()
