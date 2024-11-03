import { Request } from "express";

import { EndPointsActions } from "../enums/EndPointsActions";
import { IUser } from "./IUser";

export interface AdvancedRequest extends Request {
    createdUser?: IUser;
    updatedUser?: IUser;
    deletedUser?: IUser;
    selectedUser?:IUser;
    Action?:EndPointsActions;


  }