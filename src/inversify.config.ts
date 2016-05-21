import "reflect-metadata";
import * as interfaces from "./interfaces";
import { Kernel } from "inversify";
import { InstanceInspector} from "./instance_inspector";
import { Configuraiton } from "./configuration";
import { KitchenConfigDiscovery } from "./kitchen_config_discovery";
import { CommandWrapper } from "./command_wrapper";

let kernel = new Kernel();
kernel.bind<interfaces.IConfiguration>("IConfiguration").to(Configuraiton);
kernel.bind<interfaces.IInstanceInspector>("IInstanceInspector").to(InstanceInspector);
kernel.bind<interfaces.IKitchenConfigDiscovery>("IKitchenConfigDiscovery").to(KitchenConfigDiscovery);
kernel.bind<CommandWrapper>("CommandWrapper").to(CommandWrapper);

export default kernel;
