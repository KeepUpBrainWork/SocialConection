export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  gender: "male" | "female";
  birthDate: string;
  confirmPassword: string;
}
