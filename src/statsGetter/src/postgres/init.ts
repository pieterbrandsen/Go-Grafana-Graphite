import PostgresQuery from './query.js'

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
    user_id serial PRIMARY KEY,
    username VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL
 );
`
const createConfigTable = `
CREATE TABLE IF NOT EXISTS configs (
    config_id serial PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users (user_id),
    config_name VARCHAR (255) NOT NULL,
    interval INT NOT NULL,
    host VARCHAR (255),
    port INT,
    shard VARCHAR (255),
    stats_path VARCHAR (255),
    stats_segment VARCHAR (255),
    token VARCHAR (255) NOT NULL,
    username VARCHAR (255) NOT NULL,
    privateServerPassword VARCHAR (255),
    is_private_server BOOLEAN NOT NULL,
    is_stats_segment BOOLEAN NOT NULL
);
    `

function Initialize (): void {
  PostgresQuery(createUserTable)
  PostgresQuery(createConfigTable)
}
Initialize()
