"use strict";

import * as interfaces from "./interfaces";
import * as vscode from "vscode";
import { inject, injectable } from "inversify";
import { spawn } from "child_process";

@injectable()
export class CommandWrapper implements interfaces.ICommandWrapper {

    private outputChannel: vscode.OutputChannel;
    private configuration: interfaces.IConfiguration;
    private processMonitor: interfaces.IProcessMonitor;

    public constructor(
        @inject("KitchenOutput") outputChannel: vscode.OutputChannel,
        @inject("IConfiguration") configuration: interfaces.IConfiguration,
        @inject("IProcessMonitor") processMonitor: interfaces.IProcessMonitor
    ) {
        this.outputChannel = outputChannel;
        this.configuration = configuration;
        this.processMonitor = processMonitor;
    }

    public execute(args: string[]) {
        const YES = "Yes";
        let process = this.processMonitor.getCurrentProcess();
        if (process != null) {
            let message = "Another kitchen command is currently running. ";
            message += "Do you want to abort currently running process?";
            vscode.window.showWarningMessage(message, YES).then(value => {
                if (value === YES) {
                    let treeKill = require("tree-kill");
                    treeKill(process.pid, "SIGKILL");
                    this.outputChannel.appendLine(`VSCode Test Kitchen: Process ${process.pid} was terminated.`);
                }
            });
        } else {
            this.executeCommand(args);
        }
    }

    private executeCommand(args: string[]) {
        let process = spawn("kitchen", args, {
            cwd: this.configuration.getWorkingDirectory(),
            shell: true,
        });
        this.outputChannel.show();
        process.stdout.on("data", (data) => {
            this.outputChannel.append(`${data}`);
        });
        process.stderr.on("data", (data) => {
            this.outputChannel.append(`${data}`);
        });
        process.stdout.on("close", (code) => {
            this.processMonitor.setCurrentProcess(null);
        });

        this.processMonitor.setCurrentProcess(process);
    }
}
