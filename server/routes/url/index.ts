import { Router, Request, Response, NextFunction } from "express";
import { UrlController } from "../../controllers/url/index";
class UrlRoute {
  public path = "/url/";
  public router = Router();
  public urlController = new UrlController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/add`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const response = await this.urlController.add(req.body);
          res.json(response);
        } catch (e) {
          next(e);
        }
      }
    );

    this.router.get(
      `/:id`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const response = await this.urlController.get(req.params.id);
          res.json(response);
        } catch (e) {
          next(e);
        }
      }
    );
    this.router.get(
      `/user/:id`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const response = await this.urlController.getUrlsByUserId(req.params.id);
          res.json(response);
        } catch (e) {
          next(e);
        }
      }
    );

    this.router.post(
        `/:id`,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
           
            const response = await this.urlController.update(req.params.id, req.body);
            res.json(response);
          } catch (e) {
            next(e);
          }
        }
      );
      this.router.delete(
        `/:id`,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const response = await this.urlController.delete(req.params.id);
            res.json(response);
          } catch (e) {
            next(e);
          }
        }
      );
  }
}

export default UrlRoute;
