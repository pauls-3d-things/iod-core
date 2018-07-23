import { JsonController, Get, Param, Body, Post, HttpError } from "routing-controllers";
import { OrmRepository } from "typeorm-typedi-extensions";
import { NodeValuesRepository } from "../repositories/NodeValuesRepository";
import { NodeValues, NodeValuesDTO } from "../entity/NodeValues";
import { NodeConfigRepository } from "../repositories/NodeConfigRepository";
import { NodeConfig } from "../entity/NodeConfig";

@JsonController("/api/node/")
export class NodeValuesController {

    constructor(
        @OrmRepository()
        private readonly valuesRepository: NodeValuesRepository,
        @OrmRepository()
        private readonly configRepository: NodeConfigRepository
    ) { }

    @Post(":id/values")
    storeValues( @Param("id") id: string, @Body() valuesDTO: NodeValuesDTO): Promise<Partial<NodeConfig>> {
        return this.configRepository
            .findOne({ id })
            .then((config: NodeConfig | undefined) => {
                if (config) {
                    const nodeValues: Partial<NodeValues> = {
                        ...valuesDTO,
                        timestamp: valuesDTO.timestamp || Date.now(),
                        dataId: config.dataId
                    };
                    // node is configured, store data
                    return this.valuesRepository.save(nodeValues)
                        .then(() => this.configRepository
                            .save({ ...config, lastSeen: Date.now() })
                            .then((updatedConfig: Partial<NodeConfig>) => {
                                return updatedConfig ? updatedConfig : config;
                            }));
                } else {
                    // node unconfigured
                    throw new HttpError(500, "Unconfigured device " + id);
                }
            });
    }

    @Post(":id/values/batch")
    storeBatchValues( @Param("id") id: string, @Body() valuesList: NodeValuesDTO[]): Promise<NodeConfig> {
        return this.configRepository
            .findOne({ id })
            .then((config: NodeConfig | undefined) => {
                if (config) {
                    // map dto to entiy
                    valuesList = valuesList.map(valuesDTO => ({
                        dataId: config.dataId, values: valuesDTO.values, timestamp: valuesDTO.timestamp
                    } as NodeValues));
                    valuesList.forEach(values => addMissingTimestamp(values));
                    valuesList.forEach(values => addMissingDataId(values, config.dataId));
                    return this.valuesRepository.save(valuesList as NodeValues[])
                        .then(() => config);
                } else {
                    // node unconfigured
                    throw new HttpError(500, "Unconfigured device " + id);
                }
            });
    }

    @Get(":id/values")
    getValues( @Param("id") id: string) {
        return this.configRepository
            .findOne({ id }).then(config => {
                if (config) {
                    return this.valuesRepository.find({ dataId: config.dataId });
                } else {
                    throw new HttpError(404, "No node with id " + id);
                }
            });
    }
}

function addMissingTimestamp(values: Partial<NodeValues>) {
    if (values.timestamp === undefined) {
        values.timestamp = Date.now();
    }
}

function addMissingDataId(values: Partial<NodeValues>, dataId: number) {
    if (values.dataId === undefined) {
        values.dataId = dataId;
    }
}
