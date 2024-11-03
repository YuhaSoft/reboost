import prisma from '../config/db'
import { BaseService } from './baseService';
import { IUser } from '../interfaces/IUser';
import APIError from '../global/response/apierror';
import Err from '../global/response/errorcode';
import * as bcrypt from 'bcryptjs';
import { JWTService } from '../extras/JWTService';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { IImage } from '../interfaces/IImage';
import { OUser } from '../interfaces/OUser';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Login } from '../interfaces/LoginInterface';

const userPrisma = new PrismaClient();

export class UserService extends BaseService<IUser> {
  constructor() {
    super(prisma.user);
  }

  public async register(data: Prisma.UserCreateInput): Promise<User> {
    // Ensure required fields are provided and valid
    if (!data.username || !data.password || !data.email) {
      throw new Error("Username, password, and email are required.");
    }

    // Set default values
    data.isAdmin = false;
    data.password = this.hashPasswordNew(data.password);

 

    // Include the Image ID in the user data
    const userData: Prisma.UserCreateInput = {
      ...data
    };

    return await prisma.user.create({ data: userData,include:{profileImage:false} },
        

    );
  }
  hashPassword(pass: string): string {
    if (pass) {
      return bcrypt.hashSync(pass, 8);
    }
    return "";
  }

   async checkIfUnencryptedPasswordIsValid(
    unencryptedPassword: string,
    encPass: any,
  ): Promise<boolean> {
    return bcrypt.compare(unencryptedPassword,encPass);
  }

   hashPasswordNew(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  public async login(model: IUser): Promise<Login> {
    const { username, password } = model;
    const user = await this.findUser(username, password);
    if (!user) {
      return Promise.reject(new APIError("Not Found", Err.NotFound));
    }
    await this.updateUserLastLogin(user);
    const token = JWTService.generateJWT(user.uuid);
    const login = {
      JWT:token,isAdmin:(user.isAdmin)?user.isAdmin:false,UUID:user.uuid
    }
    return login as Login;
  }

  public async findOneByUUIDWithImage(uuid: string): Promise<User | null> {
try{
  return await  prisma.user.findUnique({ where: { uuid } ,include:{profileImage:true}});
}catch(err){
  throw new APIError("An error occurred", Err.DatabaseError);
}
  }

  private async findUser(
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (user) {
        const isPasswordValid =
          await this.checkIfUnencryptedPasswordIsValid(password,user.password);
        if (isPasswordValid) {
          return user;
        } else {
          throw new APIError("Incorrect Password", Err.IncorrectCurrPassword);
        }
      } else {
        throw new APIError("User not found", Err.UserNotFound);
      }
    } catch (err:any) {
      throw new APIError(err.message, Err.DatabaseError);
    }
  }

  private async updateUserLastLogin(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
  }

  public async updateProfile(updatedId:number ,user:any): Promise<User> {
try{
  const updateData = user;
  const {email,phoneNumber} = user;
  if(!email&&!phoneNumber){
    return Promise.reject("no data to update!");
  }
  if(!email){
    delete updateData.email;
  }
  if(!phoneNumber){
    delete updateData.phoneNumber
  }
  return await prisma.user.update({
    where: { id:updatedId },
    data: updateData,
  });
}catch(err){
  return Promise.reject(err);
}
  }

  public async getAll(filters?: any, orderBy?: any, page: number = 1, pageSize: number = 10): Promise<{ totalCount: number; results: any[] }> {
    const skip = (page - 1) * pageSize;

    const [totalCount, results] = await Promise.all([
        prisma.user.count({ where: filters }),
        prisma.user.findMany({
          where: filters,
          orderBy: orderBy,
          skip: skip,
          take: pageSize,
          include:{profileImage:true}
        },
      
      )
    ]);

    return { totalCount, results };
}

  public async updatePassword(username:string,oldPass:string ,newPass:string): Promise<boolean> {
    try{

    const user = await this.findUser(username, oldPass);
    if (!user) {
      return Promise.reject(new APIError("Old Password Not Valid !", Err.IncorrectCurrPassword));
    }
    await prisma.user.update({where:{id:user.id},data:{password:this.hashPasswordNew(newPass)}});
    return true;
  }
    catch(err){
      return Promise.reject(err);
    }
      }
}
