import http from "../http";

export interface UserLoginValues {
  email: string;
  password: string;
}

export const UserAPI = {
  loginUser: async (values: UserLoginValues) => {
    const response = await http.post("/users/login", values);
    return response;
  },
};
