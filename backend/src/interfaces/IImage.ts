
import { IBase } from "./IBase";

export interface IImage extends IBase {
    url ?: string|null,
    fileType? : string|null,
    fileSize : number|null,
    width : number|null,
    height : number|null,
}
