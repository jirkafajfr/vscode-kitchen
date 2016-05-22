"use strict";

import * as interfaces from "./interfaces";
import { inject, injectable } from "inversify";
import { spawn } from "child_process";
import { OutputChannel } from "vscode";

@injectable()
export class CommandWrapper implements interfaces.ICommandWrapper {

    private outputChannel: OutputChannel;
    private configuration: interfaces.IConfiguration;

    public constructor(
        @inject("KitchenOutput") outputChannel: OutputChannel,
        @inject("IConfiguration") configuration: interfaces.IConfiguration
    ) {
        this.outputChannel = outputChannel;
        this.configuration = configuration;
    }

    public execute(args: string[]) {
        let process = spawn("kitchen", args, { cwd: this.configuration.getWorkingDirectory() });
        this.outputChannel.show();
        process.stdout.on("data", (data) => {
            this.outputChannel.append(`${data}`);
        });
        process.stderr.on("data", (data) => {
            // TODO error
        });
        process.stdout.on("close", (code) => {
            // finalization code
        });
    }
}
