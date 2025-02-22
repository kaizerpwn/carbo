import http from "../http";

export const UserAPI = {
  getUserStats: async (userId: string) => {
    const response = await http.get(`/api/user/stats?userId=${userId}`);
    return response.data;
  },
  finishTutorial: async (finishedTutorial: any) => {
    const response = await http.put("/user/tutorial", finishedTutorial);
    if (response.status !== 200) {
      throw new Error("Logout failed");
    }
    return response.data;
  },
};
