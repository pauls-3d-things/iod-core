import { EntityManager } from "typeorm";
import { OrmManager } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import * as express from "express";

@Service()
export class BaseController<T> {

    protected repository: any;
    constructor(
        @OrmManager()
        protected entityManager: EntityManager
    ) {
        this.repository = entityManager.getCustomRepository<T>(() => { /* nop */ });
    }

    createLog = (req: express.Request) => {
        if (process.env.DEBUG) {
            console.log(new Date(), req.headers["x-forwarded-for"] || req.connection.remoteAddress, req.method, req.originalUrl);
        }
    }
}
