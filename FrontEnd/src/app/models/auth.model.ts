import {User, UserType} from "./user.model";

export interface RegisterRequest {
  firstName: string;
  familyName: string;
  email: string;
  password: string;
  userType: UserType;
  yearOfStudy?: number;
  specialisation?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
