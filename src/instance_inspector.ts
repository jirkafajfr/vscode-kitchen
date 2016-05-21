import { inject, injectable } from "inversify";
import { IInstanceInspector, IConfiguration } from "./interfaces";
import { spawn } from "child_process";

@injectable()
export class InstanceInspector implements IInstanceInspector {

    private config: IConfiguration;

    public constructor(
        @inject("IConfiguration") config: IConfiguration
    ) {
        this.config = config;
    }

    public list(): Thenable<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let buffer = "";
            let list = spawn("kitchen", ["list", "--bare"]);
            list.stdout.on("data", (data) => {
                buffer += `${data}`;
            });
            list.stderr.on("data", (data) => {
                // TODO error
            });
            list.on("close", (code) => {
                let machineList = buffer.toString();
                let lines = machineList.split("\n");
                let validLines = lines.filter(element => element.length > 0);
                resolve(validLines);
            });
        });
    }
}
