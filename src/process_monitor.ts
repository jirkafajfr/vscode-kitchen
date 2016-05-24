"use strict";

import { injectable } from "inversify";
import { ChildProcess } from "child_process";
import { IProcessMonitor } from "./interfaces";

@injectable()
export class ProcessMonitor implements IProcessMonitor {

    private currentProcess: ChildProcess;

    public getCurrentProcess(): ChildProcess {
        return this.currentProcess;
    }

    public setCurrentProcess(currentProcess: ChildProcess) {
        this.currentProcess = currentProcess;
    }
}
