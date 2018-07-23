import {
    JsonController,
    Get,
    Put,
    Param,
    Body,
    Post,
    HttpError
} from "routing-controllers";
import { OrmRepository } from "typeorm-typedi-extensions";

import { NodeConfig } from "../entity/NodeConfig";
import { NodeConfigRepository } from "../repositories/NodeConfigRepository";
import { arrayToPgArrayString } from "../test/common/test-helper";

@JsonController("/api/node/")
export class NodeConfigController {

    constructor(
        @OrmRepository()
        private readonly repository: NodeConfigRepository
    ) { }

    @Get(":id/config")
    getConfig( @Param("id") id: string): Promise<NodeConfig> {
        return this.repository.findOne({ id })
            .then(config => {
                if (config) {
                    return config;
                } else {
                    throw new HttpError(404, "No configuration for node " + id);
                }
            });
    }

    @Post(":id/config")
    createConfig( @Param("id") id: string) {
        const createConfig = (dataId: number) => {
            const now = new Date().getTime();
            const defaultNodeConfig: Partial<NodeConfig> = {
                id,
                dataId,
                name: "Node_" + dataId,
                firstSeen: now,
                lastSeen: now,
                activeSensors: [],
                activeFeatures: []
            };

            return this.repository.save(defaultNodeConfig)
                .then(config => {
                    if (config) {
                        return config;
                    } else {
                        throw new HttpError(500, "Could not create config for node " + id);
                    }
                });
        };
        return this.repository.count()
            .then(c => {
                const internalId = c + 1;
                return createConfig(internalId);
            });
    }

    @Put(":id/config")
    updateConfig( @Param("id") id: string, @Body() body: Partial<NodeConfig>) {
        return this.repository.update(
            {
                id //    find by id
            },
            {
                ...body,
                activeSensors: arrayToPgArrayString(body.activeSensors), // fix pg array
                activeFeatures: arrayToPgArrayString(body.activeFeatures) // fix pg array
            }
        ).then(() => {
            return { success: true };
        });
    }

    @Get("configs")
    getConfigs() {
        return this.repository.find();
    }
}
