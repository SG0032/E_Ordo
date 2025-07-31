export interface User {
  id: number;
  firstName: string;
  familyName: string;
  email: string;
  userType: UserType;
  yearOfStudy?: number;
  specialisation?: string;
  studentCardFilename?: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
}

export enum UserType {
  STUDENT = 'STUDENT',  // Normal User
  DOCTOR = 'DOCTOR',    // Normal User
  ADMIN = 'ADMIN'       // Admin User
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}


export function isAdmin(user: User | null): boolean {
  return user?.userType === UserType.ADMIN;
}

export function isNormalUser(user: User | null): boolean {
  return user?.userType === UserType.STUDENT || user?.userType === UserType.DOCTOR;
}

export function canAccessAdmin(user: User | null): boolean {
  return isAdmin(user);
}
