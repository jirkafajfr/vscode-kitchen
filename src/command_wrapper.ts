"use strict";

import * as interfaces from "./interfaces";
import { inject, injectable } from "inversify";
import { spawn } from "child_process";
import { OutputChannel } from "vscode";

@injectable()
export class CommandWrapper implements interfaces.ICommandWrapper {

    private kitchenOutput: OutputChannel;
    private configuration: interfaces.IConfiguration;

    public constructor(
        @inject("KitchenOutput") kitchenOutput: OutputChannel,
        @inject("IConfiguration") configuration: interfaces.IConfiguration
    ) {
        this.kitchenOutput = kitchenOutput;
        this.configuration = configuration;
    }

    public execute(args: string[]) {
        let process = spawn("kitchen", args, {cwd: this.configuration.getWorkingDirectory()});
        this.kitchenOutput.show();
        process.stdout.on("data", (data) => {
            this.kitchenOutput.append(`${data}`);
        });
        process.stderr.on("data", (data) => {
            // TODO error
        });
        process.stdout.on("close", (code) => {
            // finalization code
        });
    }
}
