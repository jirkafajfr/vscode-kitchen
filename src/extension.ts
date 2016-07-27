"use strict";

import * as vscode from "vscode";
import * as interfaces from "./interfaces";
import * as inversify from "./inversify.config";

export function activate(context: vscode.ExtensionContext) {

    inversify.registerOutputChannel();

    const ITEM_ALL = "[All]";

    // Load instance inspector and fetch list of kitchen instances
    let instanceInspector = inversify.default.get<interfaces.IInstanceInspector>("IInstanceInspector");
    let instanceList = instanceInspector.list();

    // Helper method wrapping picking of instance
    function registerCommand(commandName: string): vscode.Disposable {
        return vscode.commands.registerCommand(`kitchen.${commandName}`, () => {
            // Load all active instances in kitchen
            instanceList.then((items: string[]) => {
                switch (items.length) {
                    case 0:
                        vscode.window.showWarningMessage("Solution doesn't define any kitchen instances. Please inspect your .kitchen.yml");
                        break;
                    case 1:
                        executeCommand(commandName, items[0]);
                        break;
                    default:
                        executeCommandWithInstanceSelector(commandName, items);
                }
            });
        });
    }

    function executeCommandWithInstanceSelector(commandName: string, items: string[]) {
        // Prepend "all items" option and show quick pick
        let extendedItems = [ITEM_ALL].concat(items);
        let instance = vscode.window.showQuickPick(extendedItems);
        instance.then((instanceName: string) => {
            // When no selection made skip execution
            if (instanceName !== undefined) {
                executeCommand(commandName, instanceName);
            }
        });
    }

    function executeCommand(commandName: string, instanceName: string) {
        // Retrieve command from IoC container and pass selected instance as argument
        let command = inversify.default.get<interfaces.ICommandWrapper>("ICommandWrapper");
        if (instanceName === ITEM_ALL) {
            command.execute([commandName]);
        } else {
            command.execute([commandName, instanceName]);
        }
    }

    // Creates standard kitchen commands with instance list submenu
    ["converge", "create", "destroy", "test", "verify"].forEach(name => {
        let command = registerCommand(name);
        context.subscriptions.push(command);
    });

    // Creates kitchen list command
    let list = vscode.commands.registerCommand("kitchen.list", () => {
        let command = inversify.default.get<interfaces.ICommandWrapper>("ICommandWrapper");
        command.execute(["list"]);
    });
    context.subscriptions.push(list);

    // Creates watcher for .kitchen.yml which refreshes instance list in background
    let watcher = vscode.workspace.createFileSystemWatcher("**/.kitchen.yml", false, false, true);
    watcher.onDidChange(listener => {
        instanceList = instanceInspector.list();
    });
    context.subscriptions.push(watcher);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
