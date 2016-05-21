"use strict";

import * as vscode from "vscode";
import { injectable } from "inversify";
import { IConfiguration } from "./interfaces";

@injectable()
export class Configuraiton implements IConfiguration {

    public getKitchenConfig(): string {
        // TOOD: add validator
        return ".kitchen.yml";
    }

    public setKitchenConfig(configName: string) {
        throw new Error("Not yet implemented");
    }

    public getWorkingDirectory(): string {
        return vscode.workspace.rootPath;
    }
}
