"use strict";

import "reflect-metadata";
import * as interfaces from "./interfaces";
import * as vscode from "vscode";
import { Kernel } from "inversify";
import { InstanceInspector} from "./instance_inspector";
import { Configuration } from "./configuration";
import { KitchenConfigDiscovery } from "./kitchen_config_discovery";
import { CommandWrapper } from "./command_wrapper";
import { ProcessMonitor } from "./process_monitor";

let kernel = new Kernel();
kernel.bind<interfaces.IConfiguration>("IConfiguration").to(Configuration).inSingletonScope();
kernel.bind<interfaces.IInstanceInspector>("IInstanceInspector").to(InstanceInspector);
kernel.bind<interfaces.IKitchenConfigDiscovery>("IKitchenConfigDiscovery").to(KitchenConfigDiscovery);
kernel.bind<interfaces.ICommandWrapper>("ICommandWrapper").to(CommandWrapper);
kernel.bind<interfaces.IProcessMonitor>("IProcessMonitor").to(ProcessMonitor).inSingletonScope();

export function registerOutputChannel() {
    let output = vscode.window.createOutputChannel("Test Kitchen");
    kernel.bind<vscode.OutputChannel>("KitchenOutput").toConstantValue(output);
}

export default kernel;



