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
  STUDENT = 'STUDENT',
  DOCTOR = 'DOCTOR'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
