import http from "../http";

export interface UserLoginValues {
  email: string;
  password: string;
}

export const AuthAPI = {
  loginUser: async (values: UserLoginValues) => {
    const response = await http.post("/api/auth/login", values);
    if (response.status !== 200) {
      throw new Error("Login failed");
    }
    return response.data;
  },
};
