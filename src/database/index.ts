// allowing multiple database types
import createPgDatabase from "./postgres";

export interface Database {
    runQuery: (sql: string, params?: any[]) => Promise<any>;
    runTransaction: (callback: (client: any) => Promise<any>) => Promise<any>;
    runMigrations: () => Promise<void>;
    closeConnection: () => Promise<void>;
}

const initDatabase = (): Database => {
    // it's possible to add more database types here
    return createPgDatabase();
};

export default initDatabase();
