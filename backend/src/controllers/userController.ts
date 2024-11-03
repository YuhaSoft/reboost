import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/IUser";
import prisma from '../config/db'
import { UserService } from "../services/userService";
import { BaseController } from "./baseController";
import Template from "../global/response"
import Err from "../global/response/errorcode";
import { ResolveHostnameOptions } from "nodemailer/lib/shared";
import APIError from "../global/response/apierror";
import { PrismaClient } from "@prisma/client";
import { ServerException } from "../../lib/custom-errors";
import { AdvancedRequest } from "../interfaces/AdvancedRequest";
import { SharpService } from "../services/SharpService";
import { LogEnum } from "../enums/logEnum";
import { logMe } from "../decorators/logger";

const service = new UserService();
export class UserController extends BaseController<IUser, UserService> {
  constructor(inpservice: UserService) {
    super(inpservice);
    this.create = this.create.bind(this);
    this.findOne = this.findOne.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  @logMe(LogEnum.Register)
  public register(req: Request, res: Response, next: NextFunction) {
    service
      .register(req.body)
      .then((item) => {
        res.json(Template.success(item, "Register Done"));
      })
      .catch((err) => {
        if (err.meta.target == 'User_username_key') {
          next(new APIError("Username already exist", err.ErrorID));
        }
        if (err.meta.target == 'User_email_key') {
          next(new APIError("Email already exist", err.ErrorID));
        }
        if (err.ErrorID == 5200) {
          next(new APIError(err.message, err.ErrorID));
        }
        next(new APIError(err.message, err.ErrorID));
      });
  }
  @logMe(LogEnum.UpdateProfilePhoto)
  public changeProfilePhoto(
    req: AdvancedRequest,
    res: Response,
    next: NextFunction
  ) {
    if (req.file) {
      var width;
      var height;
      SharpService.getImageDimensions(req.file.path)
        .then((dim) => {
          height = dim.height;
          width = dim.width;
          if (req.file && req.updatedUser && req.updatedUser.id) {
            prisma.image
              .create({
                data: {
                  url: req.file.filename,
                  fileSize: req.file.size,
                  fileType: req.file.mimetype,
                  width: width ?? 0,
                  height: height ?? 0,
                },
              })
              .then(async (image) => {
                if (req.updatedUser && req.updatedUser.id)
                  var user = await prisma.user.update({
                    where: { id: req.updatedUser.id },
                    data: { profileImageId: image.id },
                  });
                res.json(Template.success(null, "profile change success"));
              });
          }
        })
        .catch((err) => {
          if (err.ErrorID == 2110) {
            next(new APIError(err.message, err.ErrorID));
          }
          if (err.ErrorID == 5200) {
            next(new APIError(err.message, err.ErrorID));
          }
          next(new APIError(err.message, err.ErrorID));
        });
    }
  }
  @logMe(LogEnum.Login)
  public login(req: Request, res: Response, next: any) {
    service
      .login(req.body)
      .then((login) => {
        if (login) {
          res.json(Template.success(login, "Login Passed"));
        }
      })
      .catch((err) => {
        if (err.ErrorID == 2110) {
          next(new APIError("Invalid Credentials", Err.InvalidCredentials));
        }
        if (err.ErrorID == 5200) {
          next(new APIError("Invalid Credentials", err.InvalidCredentials));
        }
        next(new APIError("Invalid Credentials", err.InvalidCredentials));
      });
  }

  @logMe(LogEnum.UpdateProfile)
  public ChangeProfile(req: AdvancedRequest, res: Response, next: any) {
    if(req.updatedUser){
    service
      .updateProfile(req.updatedUser?.id,req.body)
      .then((profile) => {
        if (profile) {
          res.json(Template.success(profile, "Profile Updated Done!"));
        }
      })
      .catch((err) => {
        if (err.ErrorID == 2110) {
          next(new APIError(err.message, err.ErrorID));
        }
        if (err.ErrorID == 5200) {
          next(new APIError(err.message, err.ErrorID));
        }
        next(new APIError(err.message, err.ErrorID));
      });}
  }

  @logMe(LogEnum.UpdatePassword)
  public ChangePassword(req: AdvancedRequest, res: Response, next: any) {
    if(req.updatedUser){
    service
      .updatePassword(req.updatedUser.username,req.body.oldPass,req.body.newPass)
      .then((profile) => {
        if (profile) {
          res.json(Template.success(profile, "Password Changed!"));
        }
      })
      .catch((err) => {
        if (err.ErrorID == 2110) {
          next(new APIError(err.message, err.ErrorID));
        }
        if (err.ErrorID == 5200) {
          next(new APIError(err.message, err.ErrorID));
        }
        next(new APIError(err.message, err.ErrorID));
      });}
  }

  @logMe(LogEnum.UserSelect)
  public findOne(req: AdvancedRequest, res: Response, next: any){
    const uuid = req.params.uuid;
  this.service.findOneByUUIDWithImage(uuid).then(item=>{
    if (!item) {
        res.json(Template.error("Not Found!", "", Err.NotFound ));
      }
      res.json(Template.success(item, ""));
  }).catch(error=>{
    next(new ServerException(error.message));
  }); 
}
}