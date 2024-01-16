// initial the server : express and database based on the environment
// in the index.ts : const server = await initServer(app, database); then server.start();
// the initServer should take the app with generic type and database with generic type
import fs from "fs";
import https from "https";
import { Express } from "express";
import { Database } from "../database";

interface Server {
    start: () => void;
}

export const initServer = async <T extends Express, U extends Database>(
    app: T,
    database: U,
): Promise<Server> => {
    let sslConfig;
    const port = parseInt(process.env.PORT as string, 10) || 3000;
    switch (process.env.NODE_ENV) {
        case "production":
            sslConfig = {
                key: fs.readFileSync("./privkey.pem"),
                cert: fs.readFileSync("./fullchain.pem"),
            };
            await database.runMigrations();
            https.createServer(sslConfig, app).listen(port);
            break;
        default:
            app.listen(port, async () => {
                console.log(
                    `Listening on port ${port}, running on: ${process.env.NODE_ENV}`,
                );
                console.log("Running db migrations...");
                await database.runMigrations();
            });
            break;
    }
    return {
        start: () => {
            console.log("Server has been started 🚀");
        },
    };
};
