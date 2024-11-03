
import { IBase } from "./IBase";
import { IImage } from "./IImage";

export interface IUser extends IBase {
  username: string;
  password: string;
  isAdmin:boolean;
}
