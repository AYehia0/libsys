// allowing multiple database types
import createPgDatabase from "./postgres";

export interface Database {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runQuery: (sql: string, params?: unknown[]) => Promise<any>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runTransaction: (callback: (client: any) => Promise<any>) => Promise<any>;
    runMigrations: () => Promise<void>;
    closeConnection: () => Promise<void>;
}

const initDatabase = (): Database => {
    // it's possible to add more database types here
    return createPgDatabase();
};

export default initDatabase();
