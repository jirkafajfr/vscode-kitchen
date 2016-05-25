"use strict";

import { inject, injectable } from "inversify";
import { IInstanceInspector, IConfiguration } from "./interfaces";
import { spawn } from "child_process";

@injectable()
export class InstanceInspector implements IInstanceInspector {

    private configuration: IConfiguration;

    public constructor(
        @inject("IConfiguration") configuration: IConfiguration
    ) {
        this.configuration = configuration;
    }

    public list(): Thenable<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let buffer = "";
            let list = spawn("kitchen", ["list", "--bare"], {
                cwd: this.configuration.getWorkingDirectory(),
                shell: true,
            });
            list.stdout.on("data", (data) => {
                buffer += `${data}`;
            });
            list.stderr.on("data", (data) => {
                // TODO error
            });
            list.on("close", (code) => {
                let machineList = buffer.toString();
                let lines = machineList.split("\n");
                let validLines = lines.filter(element => element.length > 0);
                resolve(validLines);
            });
        });
    }
}
