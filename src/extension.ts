"use strict";

import * as vscode from "vscode";
import * as inversify from "./inversify.config";
import { ExtensionRegistrator } from "./extension_registrator";

export function activate(context: vscode.ExtensionContext) {

    inversify.registerUIElements();
    let registrator = inversify.default.get<ExtensionRegistrator>("ExtensionRegistrator");

    // Creates standard kitchen commands with instance list submenu
    ["converge", "create", "destroy", "test", "verify"].forEach(name => {
        context.subscriptions.push(registrator.registerInstanceCommand(name));
    });

    // Command without instance list submenu
    ["list"].forEach(name => {
        context.subscriptions.push(registrator.registerCommand(name));
    });

    context.subscriptions.push(registrator.registerKitchenContext());
    context.subscriptions.push(registrator.registerWatcher());
}
