export interface LoginResponse {
  message:string;
  isAuthenticated:boolean;
  username:string;
  name:string;
  imagePath:string;
  email:string;
  roles:string[];
  token:string;
  expiredOn:Date;
}
