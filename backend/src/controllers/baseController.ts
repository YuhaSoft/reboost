// src/controllers/BaseController.ts
import { NextFunction, Request, Response } from "express";
import { BaseService } from "../services/baseService";
import Template from "../global/response"
import Err from "../global/response/errorcode";
import { error } from "console";
import { ServerException } from "../../lib/custom-errors";

import { IBase } from "../interfaces/IBase";
export abstract class BaseController<M extends IBase, S extends BaseService<M>> {
  protected service: S;

  constructor(service:S) {
    this.service = service;
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await this.service.create(req.body);
      res.json({ success: true, data: item });
    } catch (error:any) {
      next(new ServerException(error.message));
    }
}

  public findOne(req: Request, res: Response,next:any){
            const id = parseInt(req.params.id, 10);
          this.service.findOne(id).then(item=>{
            if (!item) {
                res.json(Template.error("Not Found!", "", Err.NotFound ));
              }
              res.json(Template.success(item, ""));
          }).catch(error=>{
            next(new ServerException(error.message));
          }); 
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    const filters: any = req.query.filters ? JSON.parse(req.query.filters as string) : {};
    const orderBy: any = req.query.orderBy ? JSON.parse(req.query.orderBy as string) : {};
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 10;
  
    this.service.getAll(filters, orderBy, page, pageSize).then(items => {
      res.json(Template.success( items, ""));
    }).catch(error => {
      next(new ServerException(error.message));
    });
  }


  public  update(req: Request, res: Response,next:any) {
      const id = parseInt(req.params.id, 10);
      this.service.update(id, req.body).then(item=>{
        res.json(Template.success(item, ""));
      }).catch(error=>{
        next(new ServerException(error.message));
      });
  }

  public  delete(req: Request, res: Response,next:any) {
      const id = parseInt(req.params.id, 10);
       this.service.delete(id).then(()=>{
        res.json(Template.success("", "Deleted!"));
       }).catch(error=>{
        next(new ServerException(error.message));
       });
  }

  public  deactivate(req: Request, res: Response,next:any) {
      const id = parseInt(req.params.id, 10);
      this.service.deactivate(id).then(item=>{
        res.json(Template.success(item, "Deactivate Done!"));
      }).catch(error=>{
        next(new ServerException(error.message));
      });
      
  }

  public  activate(req: Request, res: Response,next:any) {
      const id = parseInt(req.params.id, 10);
       this.service.activate(id).then(item=>{
        res.json(Template.success(item, "Activate Done!"));
       }).catch(error=>{
        next(new ServerException(error.message));
       });
  }
}
