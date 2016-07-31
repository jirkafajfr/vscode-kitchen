"use strict";

import * as vscode from "vscode";
import * as interfaces from "./interfaces";
import { inject, injectable } from "inversify";

const ITEM_ALL = "[All]";

@injectable()
export class ExtensionRegistrator {

    private commandWrapper: interfaces.ICommandWrapper;
    private outputChannel: vscode.OutputChannel;
    private processManager: interfaces.IProcessManager;
    private instanceInspector: interfaces.IInstanceInspector;
    private instanceList: Thenable<string[]>;

    public constructor(
        @inject("ICommandWrapper") commandWrapper: interfaces.ICommandWrapper,
        @inject("KitchenOutput") outputChannel: vscode.OutputChannel,
        @inject("IProcessManager") processManager: interfaces.IProcessManager,
        @inject("IInstanceInspector") instanceInspector: interfaces.IInstanceInspector
    ) {
        this.commandWrapper = commandWrapper;
        this.outputChannel = outputChannel;
        this.processManager = processManager;
        this.instanceInspector = instanceInspector;

        this.instanceList = instanceInspector.list();
    }

    // Helper method wrapping picking of instance
    public registerInstanceCommand(commandName: string): vscode.Disposable {
        return vscode.commands.registerCommand(`kitchen.${commandName}`, () => {
            // Load all active instances in kitchen
            this.instanceList.then((items: string[]) => {
                switch (items.length) {
                    case 0:
                        vscode.window.showWarningMessage("Solution doesn't define any kitchen instances. Please inspect your .kitchen.yml");
                        break;
                    case 1:
                        this.executeCommand(commandName, items[0]);
                        break;
                    default:
                        this.executeCommandWithInstanceSelector(commandName, items);
                }
            });
        });
    }

    public registerCommand(commandName: string): vscode.Disposable {
        return vscode.commands.registerCommand(`kitchen.${commandName}`, () => {
            this.commandWrapper.execute([commandName]);
        });
    }

    public registerWatcher() {
        let watcher = vscode.workspace.createFileSystemWatcher("**/.kitchen.yml", false, false, true);
        watcher.onDidChange(listener => {
            this.instanceList = this.instanceInspector.list();
        });
        return watcher;
    }

    public registerTerminateProcess(): vscode.Disposable {
        const YES = "Yes";
        return vscode.commands.registerCommand("kitchen.terminateProcess", () => {
            const process = this.processManager.getCurrentProcess();

            if (process == null) {
                return;
            }

            const message = `Do you want to terminate currently running process '${process.getName()}' (pid: ${process.getPID()})?`;
            vscode.window.showInformationMessage(message, YES).then(value => {
                if (value === YES) {
                    process.kill();
                    this.outputChannel.show();
                }
            });
        });
    }

    private executeCommandWithInstanceSelector(commandName: string, items: string[]) {
        // Prepend "all items" option and show quick pick
        let extendedItems = [ITEM_ALL].concat(items);
        let instance = vscode.window.showQuickPick(extendedItems);
        instance.then((instanceName: string) => {
            // When no selection made skip execution
            if (instanceName !== undefined) {
                this.executeCommand(commandName, instanceName);
            }
        });
    }

    private executeCommand(commandName: string, instanceName: string) {
        if (instanceName === ITEM_ALL) {
            this.commandWrapper.execute([commandName]);
        } else {
            this.commandWrapper.execute([commandName, instanceName]);
        }
    }
}
