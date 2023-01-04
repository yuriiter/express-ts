import { Application, Router } from "express";

const apiPath = "/";

const initRouters = (app: Application, routers: Router[]): void => {
  routers.forEach((router: Router) => app.use(apiPath, router));
};

export default initRouters;
