"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { spawn } from "child_process";
import kernel from "./inversify.config";
import * as interfaces from "./interfaces";
import { CommandWrapper } from "./command_wrapper";

export function activate(context: vscode.ExtensionContext) {

    // Create new channel for extension and register in IoC container
    let output = vscode.window.createOutputChannel("kitchen");
    kernel.bind<vscode.OutputChannel>("KitchenOutput").toConstantValue(output);

    // Load instance inspector and fetch list of kitchen instances
    let instanceInspector = kernel.get<interfaces.IInstanceInspector>("IInstanceInspector");
    let instanceList = instanceInspector.list();

    // Helper method wrapping picking of instance
    function kitchenCommand(kitchenArgument: string) {
        let instance = vscode.window.showQuickPick(instanceList);
        instance.then((name) => {
            let command = kernel.get<CommandWrapper>("CommandWrapper");
            command.execute([kitchenArgument, name]);
        });
    }

    let converge = vscode.commands.registerCommand("kitchen.converge", () => {
       kitchenCommand("converge");
    });

    let create = vscode.commands.registerCommand("kitchen.create", () => {
        kitchenCommand("create");
    });

    let destroy = vscode.commands.registerCommand("kitchen.destroy", () => {
        kitchenCommand("destroy");
    });

    let list = vscode.commands.registerCommand("kitchen.list", () => {
        let command = kernel.get<CommandWrapper>("CommandWrapper");
        command.execute(["list"]);
    });

    let test = vscode.commands.registerCommand("kitchen.test", () => {
        kitchenCommand("test");
    });

    let verify = vscode.commands.registerCommand("kitchen.verify", () => {
        kitchenCommand("verify");
    });

    context.subscriptions.push(converge);
    context.subscriptions.push(create);
    context.subscriptions.push(destroy);
    context.subscriptions.push(list);
    context.subscriptions.push(test);
    context.subscriptions.push(verify);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
