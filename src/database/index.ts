// handle the database connection and pool configurations
import path from "path";

import { Pool, PoolConfig } from "pg";
import { migrate } from "postgres-migrations";

const poolConfig: PoolConfig = {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    max: Number(process.env.POSTGRES_POOL_SIZE),
    idleTimeoutMillis: Number(process.env.POSTGRES_CLIENT_TIMEOUT),
    connectionTimeoutMillis: Number(process.env.POSTGRES_CONNECTION_TIMEOUT),
};

const pool = new Pool(poolConfig);

// yeah, this is actually singleton object
const database = {
    // exporting the connection aka client, to perform queries
    runQuery: async (sql: string, params?: any[]) => {
        const client = await pool.connect();
        try {
            const result = await client.query(sql, params);
            return result;
        } catch (error) {
            console.error("Error running query: ", error);
            throw error;
        } finally {
            client.release();
        }
    },
    runMigrations: async () => {
        const client = await pool.connect();
        try {
            const migrationPath = path.resolve(__dirname, "migrations/sql");
            await migrate({ client }, migrationPath);
        } catch (error) {
            console.error("Migrations failed to run due to: ", error);
        } finally {
            // release the client back to the pool to accept requests
            client.release();
        }
    },
};

export default database;
