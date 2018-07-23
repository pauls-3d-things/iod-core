
import { Repository, EntityRepository } from "typeorm";
import { Service } from "typedi";
import { NodeConfig } from "../entity/NodeConfig";

@Service()
@EntityRepository(NodeConfig)
export class NodeConfigRepository extends Repository<NodeConfig> {

}
