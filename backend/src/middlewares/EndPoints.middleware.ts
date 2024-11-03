import { NextFunction, Response } from "express";
import { AdvancedRequest } from "../interfaces/AdvancedRequest";
import { EndPointsActions } from "../enums/EndPointsActions";

export function EndPointsActionsMiddleware(endPointsActions: EndPointsActions) {
    return (req: AdvancedRequest, res: Response, next: NextFunction) => {
      req.Action = endPointsActions;
      next();
    };
  }