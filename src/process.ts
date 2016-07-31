"use strict";

import * as vscode from "vscode";
import { ChildProcess } from "child_process";

export class Process {

    private name: string;
    private childProcess: ChildProcess;
    private outputChannel: vscode.OutputChannel;

    public constructor(outputChannel: vscode.OutputChannel, childProcess: ChildProcess, name: string) {
        this.name = name;
        this.childProcess = childProcess;
        this.outputChannel = outputChannel;
    }

    public getName(): string {
        return this.name;
    }

    public getPID(): number {
        return this.childProcess.pid;
    }

    public getChildProcess(): ChildProcess {
        return this.childProcess;
    }

    public kill() {
        let treeKill = require("tree-kill");
        treeKill(this.childProcess.pid, "SIGKILL");

        const message = `Termination request was sent to process ${this.childProcess.pid} running command '${this.name}'.`;
        this.outputChannel.appendLine(message);
    }
}
