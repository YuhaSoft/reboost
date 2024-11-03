export interface User{
    id?:number,
    first:string,
    middle ?:string
    last:string,
    email:string,
    password:string,
    phoneNumber?:string,
    username:string
}