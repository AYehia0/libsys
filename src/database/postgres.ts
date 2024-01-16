import path from "path";
import { Pool, PoolClient } from "pg";
import { migrate } from "postgres-migrations";
import { Database } from "./index";
import { poolConfig } from "./config";

const createPgDatabase = (): Database => {
    const pool = new Pool(poolConfig);
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        runTransaction: async (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            callback: (client: PoolClient) => Promise<any>,
        ) => {
            const client = await pool.connect();
            try {
                await client.query("BEGIN");
                const result = await callback(client);
                await client.query("COMMIT");
                return result;
            } catch (error) {
                await client.query("ROLLBACK");
                console.error("Error running transaction: ", error);
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
        closeConnection: async () => {
            await pool.end();
        },
    };
};

export default createPgDatabase;
