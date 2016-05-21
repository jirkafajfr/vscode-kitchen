"use strict";

import { injectable } from "inversify";
import { IKitchenConfigDiscovery } from "./interfaces";

@injectable()
export class KitchenConfigDiscovery implements IKitchenConfigDiscovery {
    public list(): Thenable<string[]> {
        return null;
    }
}
