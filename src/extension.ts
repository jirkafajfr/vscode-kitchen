"use strict";

import * as vscode from "vscode";
import * as interfaces from "./interfaces";
import * as inversify from "./inversify.config";

export function activate(context: vscode.ExtensionContext) {

    inversify.registerOutputChannel();

    // Load instance inspector and fetch list of kitchen instances
    let instanceInspector = inversify.default.get<interfaces.IInstanceInspector>("IInstanceInspector");
    let instanceList = instanceInspector.list();

    // Helper method wrapping picking of instance
    function registerCommand(commandName: string): vscode.Disposable {
        const ALL_ITEM = "[All]";
        return vscode.commands.registerCommand(`kitchen.${commandName}`, () => {
            // Load all active instances in kitchen
            instanceList.then((items: string[]) => {
                // Prepend "all items" option and show quick pick
                let extendedItems = [ALL_ITEM].concat(items);
                let instance = vscode.window.showQuickPick(extendedItems);
                instance.then((name: string) => {
                    // When no selection made skip execution
                    if (name === undefined) {
                        return;
                    }

                    // Retrieve command from IoC container and pass selected instance as argument
                    let command = inversify.default.get<interfaces.ICommandWrapper>("ICommandWrapper");
                    if (name === ALL_ITEM) {
                        command.execute([commandName]);
                    } else {
                        command.execute([commandName, name]);
                    }
                });
            });
        });
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
