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
}
