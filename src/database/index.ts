// allowing multiple database types
import createPgDatabase from "./postgres";

export interface Database {
    runQuery: (sql: string, params?: unknown[]) => Promise<unknown>;
    runTransaction: (
        callback: (client: unknown) => Promise<unknown>,
    ) => Promise<unknown>;
    runMigrations: () => Promise<void>;
    closeConnection: () => Promise<void>;
}

const initDatabase = (): Database => {
    // it's possible to add more database types here
    return createPgDatabase();
};

export default initDatabase();
