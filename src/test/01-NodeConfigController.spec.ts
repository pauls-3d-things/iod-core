import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { api, defaultRequest, resp2json } from "./common/test-helper";
import fetch from "node-fetch";

import { v4 as uuid } from "uuid";
import { NodeConfig } from "../entity/NodeConfig";

chai.should();
chai.use(chaiAsPromised);

describe("IOD Core API Node Config", () => {
    const id = uuid();
    it("should return 404 on missing node config", done => {
        fetch(api("/api/node/" + id + "/config"), defaultRequest("GET"))
            .then(resp => resp.status)
            .should.eventually.equal(404)
            .and.notify(done);
    });

    it("should POST (create) a new node config", done => {
        fetch(api("/api/node/" + id + "/config"), defaultRequest("POST"))
            .then(resp2json)
            .then((json: any) => json)
            .should.eventually.deep.include({
                id,
                activeSensors: [],
                activeFeatures: []
            })
            .and.notify(done);
    });

    it("should GET a (default) node config", done => {
        fetch(api("/api/node/" + id + "/config"), defaultRequest("GET"))
            .then(resp2json)
            .should.eventually.to.deep.include({
                activeSensors: [],
                activeFeatures: [],
                sleepTimeMillis: 1000 * 60 * 3,
                numberOfSamples: 1
            })
            .and.notify(done);
    });

    const updatedConfig: Partial<NodeConfig> = {
        id,
        activeSensors: ["FakeSensor1", "FakeSensor2"],
        activeFeatures: ["I2C_DEVICE_ON_D3"],
        numberOfSamples: 1003,
        sleepTimeMillis: 1000 * 60 * 15 /*15mins*/
    };

    it("should PUT (update) a (partial) node config", done => {
        fetch(api("/api/node/" + id + "/config"),
            {
                ...defaultRequest("PUT"),
                body: JSON.stringify(updatedConfig)
            })
            .then(resp2json)
            .should.eventually.deep.equal({ success: true })
            .and.notify(done);
    });

    it("should GET updated node config", done => {
        fetch(api("/api/node/" + id + "/config"), defaultRequest("GET"))
            .then(resp2json)
            .should.eventually.to.deep.include(updatedConfig)
            .and.notify(done);
    });
});
