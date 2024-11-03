import { Request, Response, NextFunction } from 'express';
import APIError from '../global/response/apierror';
import { AdvancedRequest } from '../interfaces/AdvancedRequest';
import { JWTService } from '../extras/JWTService';
import { UserService } from '../services/userService';
import { EndPointsActions } from '../enums/EndPointsActions';
export  const adminAuthMiddleware = async (
  req: AdvancedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
   
    const token = req.headers.authorization?.split(" ")[1];
    // //////console.log(token);
    if (!token) {
      return res.status(401).json(new APIError("Unauthorized", 401));
    }
    const decoded: any = JWTService.decryptJWT(token);
    const userUUID: string = decoded.userUUID;
    if (!userUUID) {
      return res.status(401).json(new APIError("Unauthorized", 401));
    }
    const userService = new UserService();
    const user = await userService.findOneByUUID(userUUID);
    if (!user) {
      return res.status(401).json(new APIError("Unauthorized", 401));
    }
    if(!user.isActive){
      return res.status(401).json(new APIError("Unauthorized", 401));
    }
    if (!user.isAdmin) {
        return res.status(404).json(new APIError("Not Found", 404));
    } 
 
    if (Object.is(req.Action, EndPointsActions.ADD)) {
      req.createdUser = user;
    } else if (Object.is(req.Action, EndPointsActions.UPDATE)) {
      req.updatedUser = user;
    } else if (Object.is(req.Action, EndPointsActions.DELETE)) {
      req.deletedUser = user;
    } else if(Object.is(req.Action, EndPointsActions.SELECT)) {
      req.selectedUser = user;
    }
    next();
    
  } catch (err:any) {
    if(err.message==="Cannot read properties of null (reading 'userUUID')"){
      return res.status(401).json(new APIError("Unauthorized", 401));
    }
    console.error("Error in authMiddleware:", err);
    return res.status(500).json(new APIError("Internal Server Error", 500));
  }

};