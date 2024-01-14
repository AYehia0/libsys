import app from "./app";
import database from "./database";

const port = parseInt(process.env.PORT as string, 10) || 3000;

app.listen(port, () => {
    console.log(
        `Listening on port ${port}, running on: ${process.env.NODE_ENV}`,
    );
    console.log("Running db migrations...");
    database.runMigrations();
});
