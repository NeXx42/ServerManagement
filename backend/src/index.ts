import http from 'http';

import { RouteManager } from './routes/routeManager'

require("dotenv").config();

const server = http.createServer((req, res) => {
    const routes = new RouteManager();
    routes.Handle(req, res);
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
