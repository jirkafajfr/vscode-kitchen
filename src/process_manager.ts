"use strict";

import * as vscode from "vscode";
import * as interfaces from "./interfaces";
import { inject, injectable } from "inversify";
import { Process } from "./process";
import { spawn } from "child_process";
import { IProcessManager } from "./interfaces";

@injectable()
export class ProcessManager implements IProcessManager {

    private currentProcess: Process;
    private outputChannel: vscode.OutputChannel;
    private configuration: interfaces.IConfiguration;

    public constructor(
        @inject("KitchenOutput") outputChannel: vscode.OutputChannel,
        @inject("IConfiguration") configuration: interfaces.IConfiguration
    ) {
        this.outputChannel = outputChannel;
        this.configuration = configuration;
    }

    public getCurrentProcess(): Process {
        return this.currentProcess;
    }

    public createProcess(args: string[]): Process {
        let process = spawn("kitchen", args, {
            cwd: this.configuration.getWorkingDirectory(),
            shell: true,
        });
        process.stdout.on("close", (code) => {
            this.currentProcess = null;
        });
        this.currentProcess = new Process(this.outputChannel, process, "kitchen " + args.join(" "));
        return this.currentProcess;
    }
}
