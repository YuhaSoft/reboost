import axios from 'axios';
import { User } from '../interfaces/User';
import { Login } from '../interfaces/Login';
import { Error } from '../interfaces/Error';
import { getToken } from '../utils/auth';


const BASE_URL = 'http://localhost:6200/api/v1/';
const USER_URL = BASE_URL + 'user';
export const IMAGE_URL = BASE_URL + 'image/profile/';


export const register = async (data: User):Promise<Login|Error> => {
  const response = await axios.post(`${USER_URL}/register`, data);
  if(response.data){
    return response.data as Login;
    }
    return response.data as Error;
};

export const login = async (data: { username: string, password: string }):Promise<Login|any>=> {
  const response = await axios.post(`${USER_URL}/login`, data);
if(response.status){
return response.data as Login
}
return response as any;
};

export const getUser = async (uuid:string):Promise<any>=> {
  const response = await axios.get(`${USER_URL}/${uuid}`,{
    headers: {
      Authorization: `Bearer ${getToken()}`
    }});
if(response.status){
return response.data 
}
return response ;
};

export const updateProfileImage = async (image: File): Promise<any> => {
  const formData = new FormData();
  formData.append('profileImage', image);

  const response = await axios.post(`${USER_URL}/upload-profile-image`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data'
    },
  });

  if (response.status) {
    return response.data;
  }

  return response;
};

export const updateProfile = async (email?:string,phoneNumer?:string): Promise<any> => {
  const formData = new FormData();

  if(email)
  formData.append("email",email)
  if(phoneNumer)
  formData.append("phoneNumber",phoneNumer);

  if(!email&&!phoneNumer){
    Promise.reject("not have any changing in profile"); 
  }
  const response = await axios.patch(`${USER_URL}/change-profile`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data'
    },
  });

  if (response.status) {
    return response.data;
  }

  return response;
};

export const updatePassword = async (oldPass:string,newPass:string) :Promise<any>=>{
  const formData = new FormData();

  formData.append("oldPass",oldPass);
  formData.append("newPass",newPass);
  if(!oldPass&&!newPass){
    Promise.reject("not have any changing in profile"); 
  }
  const response = await axios.patch(`${USER_URL}/change-password`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data'
    },
  });

  if (response.status) {
    return response.data;
  }

  return response;
}
export const getAllUsers = async (filters: string, orderBy: string, page: number, pageSize: number): Promise<any> => {
  const response = await axios.get(USER_URL+'/', {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    params: { filters, orderBy, page, pageSize }
  });
  return response.data;
};
