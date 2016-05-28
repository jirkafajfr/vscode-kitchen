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
            instanceList.then(items => {
                let extendedItems = [ALL_ITEM].concat(items);
                let instance = vscode.window.showQuickPick(extendedItems);
                instance.then(name => {
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

    ["converge", "create", "destroy", "test", "verify"].forEach(name => {
        let command = registerCommand(name);
        context.subscriptions.push(command);
    });

    let list = vscode.commands.registerCommand("kitchen.list", () => {
        let command = inversify.default.get<interfaces.ICommandWrapper>("ICommandWrapper");
        command.execute(["list"]);
    });

    context.subscriptions.push(list);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
