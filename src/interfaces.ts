"use strict";

import { ChildProcess } from "child_process";

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

export interface IProcessMonitor {
    getCurrentProcess(): ChildProcess;
    setCurrentProcess(process: ChildProcess);
}
