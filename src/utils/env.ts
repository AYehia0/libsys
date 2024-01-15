// configure .env file based on the environment
import * as dotenv from "dotenv";

export const configureEnv = () => {
    switch (process.env.NODE_ENV) {
        case "production":
            dotenv.config({ path: ".prod.env" });
            break;
        case "test":
            dotenv.config({ path: ".test.env" });
            break;
        default:
            dotenv.config({ path: ".env" });
            break;
    }
};
