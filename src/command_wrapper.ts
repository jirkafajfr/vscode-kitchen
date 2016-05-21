import { inject, injectable } from "inversify";
import { OutputChannel } from "vscode";
import { spawn } from "child_process";

@injectable()
export class CommandWrapper {

    private kitchenOutput: OutputChannel;

    public constructor(@inject("KitchenOutput") kitchenOutput: OutputChannel) {
        this.kitchenOutput = kitchenOutput;
    }

    public execute(args: string[]) {
        let process = spawn("kitchen", args);
        this.kitchenOutput.show();
        process.stdout.on("data", (data) => {
            this.kitchenOutput.append(`${data}`);
        });
        process.stderr.on("data", (data) => {
            // TODO error
        });
        process.stdout.on("close", (code) => {
            // finalization code
        });
    }
}
