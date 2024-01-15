// it's important to configure the env before creating anything
import { configureEnv } from "./utils/env";
configureEnv();

import createApp from "./app";

// this is a dirty hack to make sure the database is initialized before the server starts
import database from "./database/index";
import { initServer } from "./utils/init";

const app = createApp();

initServer(app, database).then((server) => {
    server.start();
});
