
import { Repository, EntityRepository } from "typeorm";
import { Service } from "typedi";
import { NodeValues } from "../entity/NodeValues";

@Service()
@EntityRepository(NodeValues)
export class NodeValuesRepository extends Repository<NodeValues> {

}
