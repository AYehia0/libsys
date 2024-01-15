import { PoolConfig } from "pg";

export const poolConfig: PoolConfig = {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    max: Number(process.env.POSTGRES_POOL_SIZE),
    idleTimeoutMillis: Number(process.env.POSTGRES_CLIENT_TIMEOUT),
    connectionTimeoutMillis: Number(process.env.POSTGRES_CONNECTION_TIMEOUT),
};
