import { Router } from "express";
import { UserController } from "../controllers/userController";
import { EndPointsActionsMiddleware } from "../middlewares/EndPoints.middleware";
import { EndPointsActions } from "../enums/EndPointsActions";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import { UserService } from "../services/userService";
import { handleUpload, uploadProfileImage } from "../services/uploadService";

const router = Router();

const upload = multer();
const Service = new UserService();
const Controller = new UserController(Service);

router.get('/',EndPointsActionsMiddleware(EndPointsActions.SELECT), adminAuthMiddleware, Controller.getAll);

router.get('/:uuid',EndPointsActionsMiddleware(EndPointsActions.SELECT), authMiddleware, Controller.findOne);

router.post('/login',EndPointsActionsMiddleware(EndPointsActions.OTHER),upload.none(), Controller.login);

router.post('/register',EndPointsActionsMiddleware(EndPointsActions.ADD), upload.none(), Controller.register);

router.patch('/change-password',EndPointsActionsMiddleware(EndPointsActions.UPDATE),authMiddleware, upload.none(), Controller.ChangePassword);

router.patch('/change-profile',EndPointsActionsMiddleware(EndPointsActions.UPDATE),authMiddleware, upload.none(), Controller.ChangeProfile);

router.post('/upload-profile-image',EndPointsActionsMiddleware(EndPointsActions.UPDATE),authMiddleware, uploadProfileImage, handleUpload,Controller.changeProfilePhoto);


export default router;
