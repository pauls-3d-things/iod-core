import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { api, defaultHeaders } from "./common/test-helper";
import fetch, { Response } from "node-fetch";

chai.should();
chai.use(chaiAsPromised);

describe("IOD Core API Util", function () {
    it("should fail without authentication", function (done) {
        fetch(api("/api/util/time"), { method: "GET" })
            .then((r: Response) => {
                return r.status;
            })
            .should.eventually.equal(401).and.notify(done);
    });

    it("should provide time as millis", function (done) {
        const now = new Date().getTime();
        fetch(api("/api/util/time"), { method: "GET", headers: defaultHeaders() })
            .then((r: Response) => r.json())
            .then(res => res.millis)
            .should.eventually.be.greaterThan(now).and.notify(done);
    });
});
