const TOKEN_KEY = 'jwtToken';
const IS_ADMIN = 'isAdmin';
const UUID = 'uuid'
export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const saveIsAdmin = (isAdmin: boolean) => {
    
    localStorage.setItem(IS_ADMIN,(isAdmin)?'true':'false');
  };
  
  export const getIsAdmin = (): boolean | null => {
    return 'true'==localStorage.getItem(IS_ADMIN);
  };
  
  export const removeIsAdmin = () => {
    localStorage.removeItem(IS_ADMIN);
  };


  export const saveUUID = (uuid: string) => {
    
    localStorage.setItem(UUID,(uuid)? uuid+"":'');
  };
  
  export const getUUID = (): string | null => {
    return localStorage.getItem(UUID);
  };
  
  export const removeUUID = () => {
    localStorage.removeItem(UUID);
  };


  export const logout = () => {
    removeUUID();
    removeIsAdmin();
    removeToken();
    window.location.reload();
  }  