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
let isLoggingIn = false;

export const AuthAPI = {
  loginUser: async (values: UserLoginValues) => {
    if (isLoggingIn) return;

    try {
      isLoggingIn = true;
      const response = await http.post("/auth/login", values);
      return response.data;
    } finally {
      isLoggingIn = false;
    }
  },

  registerUser: async (values: RegisterUserValues) => {
    console.log("values", values);
    const response = await http.post("/auth/register", values);
    if (response.status !== 200) {
      throw new Error("Registration failed");
    }
    return response.data;
  },

  logout: async () => {
    const response = await http.post("/auth/logout");
    if (response.status !== 200) {
      throw new Error("Logout failed");
    }
    return response.data;
  },
};
