import postgresql from 'pg'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const { Pool } = postgresql

export default function GetPool (): postgresql.Pool {
  const pool = new Pool({
    user: process.env.POSTGRES_USER ?? 'postgres',
    database: process.env.POSTGRES_DB ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'postgres',
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: (process.env.POSTGRES_PORT as unknown as number) ?? 5432
  })

  return pool
};
