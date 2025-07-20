import { IncomingMessage, ServerResponse } from "http";
import { RouteBase } from "../routeBase";

const os = require('os');
const { exec } = require('child_process');

interface DeviceDetails{
    uptime: number,
    hostName: string
}


export class SystemEndpoint extends RouteBase{
    GetBaseRoute(): string {
        return "system";
    }
     
    async HandleGet(localRoute: string, req: IncomingMessage, res: ServerResponse): Promise<any> {
        if(localRoute.startsWith("ping"))
            return "pong";

        if(localRoute.startsWith("details"))
            return this.GetDeviceDetails();

        if(localRoute.startsWith("updates"))
            return this.GetUpdates();

        if(localRoute.startsWith("neofetch"))
            return await this.Neofetch();
    }

    GetDeviceDetails(): DeviceDetails{
        return {
            uptime: os.uptime(),
            hostName: os.hostname()
        }
    }

    GetUpdates(): string[]{
        exec('ssh matthew@192.168.0.10 "yay -Qua"', (error: any, stdout: any, stderr: any) => {
            if(error){
                throw error;
            }

            console.log(stdout);
        });

        return []
    }

    Neofetch(): Promise<string[]>{
        return new Promise<string[]>((res, rej) => {
            exec('pfetch', (error: any, stdout: any, stderr: any) => {
                if(error){
                    rej(error);
                }

                const lines: string[] = removeAnsiCodes(stdout).split("\n");
                res(lines);
            });
        });    
    }
}

function removeAnsiCodes(str: string) {
  return str.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
}