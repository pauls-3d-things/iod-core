import * as express from "express";
import * as bodyParser from "body-parser";
import { createBasicAuth, BasicAuthConfig } from "./basic-auth";

export const createServerConfig = (config: { basicAuth: BasicAuthConfig }) => {

    const serverConfig = express();

    serverConfig.use(bodyParser.urlencoded({ extended: true }));
    serverConfig.use(bodyParser.json());

    const router = express.Router();

    serverConfig.use("/api", createBasicAuth(config.basicAuth), router);

    return serverConfig;
};
