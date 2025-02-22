import http from "../http";

export interface UserLoginValues {
  email: string;
  password: string;
}

export const AuthAPI = {
  loginUser: async (values: UserLoginValues) => {
    const response = await http.post("/auth/login", values);
    return response;
  },
};
