import fs from "fs";
import https from "https";
import app from "./app";
import database from "./database";

const port = parseInt(process.env.PORT as string, 10) || 3000;

if (process.env.NODE_ENV === "production") {
    const sslConfig = {
        key: fs.readFileSync("./privkey.pem"),
        cert: fs.readFileSync("./fullchain.pem"),
    };
    database.runMigrations();
    https.createServer(sslConfig, app).listen(process.env.PORT);
} else {
    app.listen(port, () => {
        console.log(
            `Listening on port ${port}, running on: ${process.env.NODE_ENV}`,
        );
        console.log("Running db migrations...");
        database.runMigrations();
    });
}
