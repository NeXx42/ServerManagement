import { IncomingMessage, ServerResponse } from 'http';
import { RouteBase } from './routeBase';

import { SystemEndpoint } from './system/systemEndpoints';

const routes: RouteBase[] = [
    new SystemEndpoint()
];

export class RouteManager{

    async Handle(req: IncomingMessage, res: ServerResponse) {
        let foundRoute: RouteBase | undefined;

        routes.forEach(route => {
            if (req.url?.startsWith(`/${route.GetBaseRoute()}/`))
                foundRoute = route;
        });
        
        let response: any | undefined = undefined;

        try{
            response = await this.HandleRouting(foundRoute, req, res);
        }
        catch (e: any){
            console.log(e);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: true,
                message: e?.message ?? 'Internal Server Error',
                stack: e?.stack ?? undefined
            }));

            return;
        }

        if(response == undefined){
            res.writeHead(404);
            res.end("No endpoint found");
        }
        else{
            res.writeHead(200);
            res.end(JSON.stringify(response));
        }
    }

    async HandleRouting(foundRoute: RouteBase | undefined, req: IncomingMessage, res: ServerResponse): Promise<any>{
        if(foundRoute === undefined)
            return;

        const localRoute = req.url?.replace(`/${foundRoute.GetBaseRoute()}/`, "") ?? "";

        switch(req.method){
            case "GET": return await foundRoute.HandleGet(localRoute, req, res);
            case "POST": return await foundRoute.HandlePost(localRoute, req, res);
        }
    }
}


