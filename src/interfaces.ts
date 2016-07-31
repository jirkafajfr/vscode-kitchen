"use strict";

import { Process } from "./process";

export interface IInstanceInspector {
    list(): Thenable<string[]>;
}

export interface IKitchenConfigDiscovery {
    // TODO: chnage to path
    list(): Thenable<string[]>;
}

export interface IConfiguration {
    // TODO: change to path
    getKitchenConfig(): string;
    setKitchenConfig(configName: string);
    getWorkingDirectory(): string;
}

export interface ICommandWrapper {
    execute(args: string[]);
}

export interface IProcessManager {
    getCurrentProcess(): Process;
    createProcess(args: string[]): Process;
}
