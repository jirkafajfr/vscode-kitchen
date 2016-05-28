/// <reference path="../node_modules/typemoq/typemoq.node.d.ts" />
import "reflect-metadata";
import * as assert from "assert";
import { IConfiguration, IInstanceInspector } from "../src/interfaces";
import { Configuration } from "../src/configuration";
import { InstanceInspector } from "../src/instance_inspector";
typemoq = require("typemoq");
let mockSpawn = require("mock-spawn");

// Defines a Mocha test suite to group tests of similar kind together
suite("Instance Inspector Tests", () => {

    let spawn;
    let config: TypeMoq.Mock<IConfiguration>;
    let inspector: IInstanceInspector;

    const model = ["server-centos7", "client1-centos7", "client2-centos7", "web1-centos7"];

    setup(() => {

        // Mock spawn
        spawn = mockSpawn();
        require("child_process").spawn = spawn;

        // Create dummy configuration with empty cwd
        config = typemoq.Mock.ofType<IConfiguration>(Configuration);
        config.setup(x => x.getWorkingDirectory()).returns(() => "");

        // Create inspector which will be tested
        inspector = new InstanceInspector(config.instance);
    });

    test("Standard Test", () => {

        // Join model definitions by newline and mock output of process call
        spawn.setDefault(spawn.simple(1, model.join("\n")));

        // Compare that model and output of instances are equal
        let instances = inspector.list();
        instances.then(names => {
            for (let i = 0; i < names.length; ++i) {
                assert.equal(names[i], model[i]);
            }
        });
    });

    test("Policy File Test", () => {

        // Prepend model with banner which is generated when kithen is using policy file
        const policyfile_banner = "-----> Using policyfile mode for chef-client";
        let extended_model = model.slice();
        extended_model.unshift(policyfile_banner, policyfile_banner);

        // Push new model with banners to the spawn mock
        spawn.setDefault(spawn.simple(1, extended_model.join("\n")));

        // Compare that original model and output of instances are equal
        let instances = inspector.list();
        instances.then(names => {
            for (let i = 0; i < names.length; ++i) {
                assert.equal(names[i], model[i]);
            }
        });
    });
});
