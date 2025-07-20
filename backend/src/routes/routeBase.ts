import { IncomingMessage, ServerResponse } from 'http';

export abstract class RouteBase{
    abstract GetBaseRoute(): string;

    HandleGet(localRoute: string, req: IncomingMessage, res: ServerResponse): Promise<any> {
        return new Promise((res) => res(false));
    }

    HandlePost(localRoute: string, req: IncomingMessage, res: ServerResponse): Promise<any> {
        return new Promise((res) => res(false));
    }
}