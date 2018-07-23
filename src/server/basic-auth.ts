import * as express from "express";
import * as basicAuth from "basic-auth";

export interface BasicAuthConfig {
    user: string;
    pass: string;
}

export const createBasicAuth =
    (config: BasicAuthConfig):
        ((req: express.Request, res: express.Response, next: express.NextFunction) => void) => {

        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const unauthorized = (res: express.Response) => {
                res.set("WWW-Authenticate", "Basic realm=Authorization Required");
                return res.sendStatus(401);
            };

            const user = basicAuth(req);

            if (!user || !user.name || !user.pass) {
                return unauthorized(res);
            }

            if (user.name === config.user && user.pass === config.pass) {
                return next();
            } else {
                return unauthorized(res);
            }
        };
    };
