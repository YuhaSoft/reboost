

import { IImage } from "./IImage";
import { OBase } from "./OBase";

export interface OUser extends OBase {
  first: string | null ;
  middle: string | null ;
  last: string | null ;
  email: string;
  username: string;
  password: string;
  phoneNumber: string | null;
  isAdmin: boolean;
  lastLogin: Date | null;
  profileImage?: Partial<IImage> | null;
}
