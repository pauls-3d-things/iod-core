import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { NodeValues } from "../entity/NodeValues";
import fetch from "node-fetch";
import { defaultRequest, resp2json, api } from "./common/test-helper";
import { NodeConfig } from "../entity/NodeConfig";
import { v4 as uuid } from "uuid";
const xrange = require("xrange");

chai.should();
chai.use(chaiAsPromised);

describe("IOD Core API Values", function () {
    const numTests = 100;
    const nodeUUID = uuid();
    let lastSeen = Date.now();

    it("should POST (create) a new node config", done => {
        fetch(api("/api/node/" + nodeUUID + "/config"), defaultRequest("POST"))
            .then(resp2json)
            .should.eventually.deep.include({ id: nodeUUID })
            .and.notify(done);
    });

    it("should store " + numTests + " separate values", function (done) {
        const values: Partial<NodeValues> = {
            dataId: 1,
            values: { BME280_TEMP: "1", BME280_HUM: "2" }
        };

        const results: NodeConfig[] = [];
        const storeData = (count: number) => {
            fetch(api("/api/node/" + nodeUUID + "/values"), { ...defaultRequest("POST"), body: JSON.stringify(values) })
                .then(resp2json)
                .then(json => results.push(json))
                .then(() => {
                    count--;
                    if (count > 0) {
                        storeData(count);
                    } else {
                        // verify test run
                        results.should.have.length(numTests);
                        done();
                    }
                }).catch(error => {
                    throw new Error(error);
                });
        };
        storeData(numTests);
    });

    it("should store " + numTests + " batch values", function (done) {
        const now = Date.now();
        const valuesList = xrange(numTests)
            .map((i: number) => ({ dataId: 1, timestamp: now + i, values: { BME280_TEMP: "" + i, BME280_HUM: "" + (i * i) } }));

        fetch(api("/api/node/" + nodeUUID + "/values/batch"), { ...defaultRequest("POST"), body: JSON.stringify(valuesList) })
            .then(resp2json)
            .then(json => json.lastSeen)
            .should.eventually.be.greaterThan(lastSeen) // verify last seen is updated in returned entity
            .and.notify(done);
    });

    it("should return 200 values", function (done) {
        fetch(api("/api/node/" + nodeUUID + "/values"), defaultRequest("GET"))
            .then(resp2json)
            .should.eventually.have.length(numTests * 2)
            .and.notify(done);
    });

});
