"use strict";

import "reflect-metadata";
import * as interfaces from "./interfaces";
import * as vscode from "vscode";
import { Kernel } from "inversify";
import { InstanceInspector} from "./instance_inspector";
import { Configuration } from "./configuration";
import { KitchenConfigDiscovery } from "./kitchen_config_discovery";
import { CommandWrapper } from "./command_wrapper";
import { ProcessManager } from "./process_manager";
import { ExtensionRegistrator } from "./extension_registrator";

let kernel = new Kernel();
kernel.bind<interfaces.IConfiguration>("IConfiguration").to(Configuration).inSingletonScope();
kernel.bind<interfaces.IInstanceInspector>("IInstanceInspector").to(InstanceInspector);
kernel.bind<interfaces.IKitchenConfigDiscovery>("IKitchenConfigDiscovery").to(KitchenConfigDiscovery);
kernel.bind<interfaces.ICommandWrapper>("ICommandWrapper").to(CommandWrapper);
kernel.bind<interfaces.IProcessManager>("IProcessManager").to(ProcessManager).inSingletonScope();
kernel.bind<ExtensionRegistrator>("ExtensionRegistrator").to(ExtensionRegistrator);

export function registerUIElements() {
    let output = vscode.window.createOutputChannel("Test Kitchen");
    kernel.bind<vscode.OutputChannel>("KitchenOutput").toConstantValue(output);

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.command = "kitchen.runContext";
    kernel.bind<vscode.StatusBarItem>("KitchenStatusBarItem").toConstantValue(statusBarItem);
}

export default kernel;



