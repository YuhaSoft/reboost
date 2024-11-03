import express, { NextFunction, Request, Response, Router } from 'express';
import user from './userRoute'
import image from './imageRoute'
const routes = Router();
routes.use('/v1/user', user);
routes.use('/v1/image', image);
export { routes };