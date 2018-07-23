import { defaultFetch } from "./common";
import { NodeConfig } from "../entity/NodeConfig";

export const fetchAllNodeConfigs = () => {
    return fetch("/api/node/configs", defaultFetch())
        .then((response: Response) => response.json());
};

export const saveNodeConfig = (updatedConfig: Partial<NodeConfig>) => {
    const body = JSON.stringify({ ...updatedConfig, id: undefined });
    console.log(body);
    return fetch("/api/node/" + updatedConfig.id + "/config",
        {
            ...defaultFetch(),
            method: "PUT",
            body
        })
        .then(resp => resp.json())
        .then(json => json as NodeConfig);
};
