"use strict";

import * as interfaces from "./interfaces";
import * as vscode from "vscode";
import { inject, injectable } from "inversify";

@injectable()
export class CommandWrapper implements interfaces.ICommandWrapper {

    private outputChannel: vscode.OutputChannel;
    private statusBarItem: vscode.StatusBarItem;
    private processManager: interfaces.IProcessManager;

    public constructor(
        @inject("KitchenOutput") outputChannel: vscode.OutputChannel,
        @inject("KitchenStatusBarItem") statusBarItem: vscode.StatusBarItem,
        @inject("IProcessManager") processManager: interfaces.IProcessManager
    ) {
        this.outputChannel = outputChannel;
        this.statusBarItem = statusBarItem;
        this.processManager = processManager;
    }

    public execute(args: string[]) {
        const YES = "Yes";
        let process = this.processManager.getCurrentProcess();
        if (process != null) {
            let message = "Another kitchen command is currently running. ";
            message += "Do you want to abort currently running process?";
            vscode.window.showWarningMessage(message, YES).then(value => {
                if (value === YES) {
                    process.kill();
                }
            });
        } else {
            this.executeCommand(args);
        }
    }

    private executeCommand(args: string[]) {
        let process = this.processManager.createProcess(args);

        this.outputChannel.show();
        this.statusBarItem.show();

        process.getChildProcess().stdout.on("data", data => this.publishOutput(data));
        process.getChildProcess().stderr.on("data", data => this.publishOutput(data));
        process.getChildProcess().stdout.on("close", code => {
            this.statusBarItem.hide();
        });
    }

    private publishOutput(data) {
        let message = `${data}`;
        this.outputChannel.append(message);
        this.statusBarItem.text = `Kitchen: ${this.printableStatus(message)}`;
    }

    // Removes whitespaces & truncates message when longer than 50 characters
    private printableStatus(message: string) {
        let printable = message.trim().substr(0, 50);
        return printable.length !== message.length ? `${printable} ...` : printable;
    }
}
