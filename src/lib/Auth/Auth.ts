import http from "../http";

export interface UserLoginValues {
  email: string;
  password: string;
}

export interface RegisterUserValues {
  email: string;
  password: string;
  username: string;
  fullName: string;
  country: string;
  town: string;
  transport: string;
  energy: string;
  recycle: string;
}

export const AuthAPI = {
  loginUser: async (values: UserLoginValues) => {
    const response = await http.post("/auth/login", values);
    if (response.status !== 200) {
      throw new Error("Login failed");
    }
    return response.data;
  },

  registerUser: async (values: RegisterUserValues) => {
    console.log("values", values);
    const response = await http.post("/auth/register", values);
    if (response.status !== 200) {
      throw new Error("Registration failed");
    }
    return response.data;
  },
};
