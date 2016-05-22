"use strict";

import * as vscode from "vscode";
import * as interfaces from "./interfaces";
import kernel from "./inversify.config";

export function activate(context: vscode.ExtensionContext) {

    const ALL_ITEM = "[All]";

    // Create new channel for extension and register in IoC container
    let output = vscode.window.createOutputChannel("Test Kitchen");
    kernel.bind<vscode.OutputChannel>("KitchenOutput").toConstantValue(output);

    // Load instance inspector and fetch list of kitchen instances
    let instanceInspector = kernel.get<interfaces.IInstanceInspector>("IInstanceInspector");
    let instanceList = instanceInspector.list();

    // Helper method wrapping picking of instance
    function registerCommand(commandName: string): vscode.Disposable {
        return vscode.commands.registerCommand(`kitchen.${commandName}`, () => {
            instanceList.then(items => {
                let extendedItems = [ALL_ITEM].concat(items);
                let instance = vscode.window.showQuickPick(extendedItems);
                instance.then((name) => {
                    let command = kernel.get<interfaces.ICommandWrapper>("ICommandWrapper");
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
        let command = kernel.get<interfaces.ICommandWrapper>("ICommandWrapper");
        command.execute(["list"]);
    });

    context.subscriptions.push(list);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
