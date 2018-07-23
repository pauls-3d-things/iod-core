import "reflect-metadata";
import * as fs from "fs";
import * as path from "path";
import * as express from "express";
import { BasicAuthConfig, createBasicAuth } from "./basic-auth";
import { NodeConfigController } from "../controller/NodeConfigController";
import { useContainer as routingUseContainer, useExpressServer } from "routing-controllers";
import { useContainer as ormUseContainer, createConnection } from "typeorm";
import { Container } from "typedi";
import { UtilController } from "../controller/Util";
import { NodeValuesController } from "../controller/NodeValuesController";

export const startServer = (
    logger: (message: any, ...optionalParams: any[]) => void,
    host?: string,
    port?: number
) => {
    const enableDestroy = require("server-destroy");

    routingUseContainer(Container);
    ormUseContainer(Container);

    const serverConfig = express();
    serverConfig.use("/", createBasicAuth(JSON.parse(fs.readFileSync(path.join(__dirname, "../../config/basic-auth.json"), "utf8")) as BasicAuthConfig));
    serverConfig.use("/", express.static("dist/"));

    const HTTP_PORT: number = port || Number.parseInt(process.env.HTTP_PORT || "8080");
    const HTTP_HOST = host || process.env.HTTP_IP || "0.0.0.0";

    logger("Starting...");
    return createConnection(require(path.join(__dirname, "../../config/ormconfig.json")))
        .then(async connection => {
            logger("Connected to DB...");

            const server = useExpressServer(
                serverConfig,
                {
                    controllers: [NodeConfigController, NodeValuesController, UtilController]
                })
                .listen(HTTP_PORT, HTTP_HOST, () => {
                    logger(`Started IoD-Core on ${HTTP_HOST}:${HTTP_PORT}`);
                    logger("URL: http://127.0.0.1:" + HTTP_PORT);
                });

            enableDestroy(server);
            return server;
        })
        .catch(error => {
            throw new Error(error);
        });
};
