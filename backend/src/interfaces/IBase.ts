import { EntityType } from "../enums/EntityType";

import { IUser } from "./IUser";

export interface IBase {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  version: number | null;
  dsc: string | null;
  arabicLabel: string | null;
  type?: EntityType |EntityType.BASE;
  isActive: boolean ;
  note: string | null;
  createdBy?:Partial<IUser> | null;
  modifiedBy?: Partial<IUser> | null;
  deletedBy?:Partial<IUser> | null;
}