import http from "../http";

export const UserAPI = {
  getUserStats: async (userId: string) => {
    const response = await http.get(`/user/stats?userId=${userId}`);
    return response.data;
  },
  finishTutorial: async (userId: string, finishedTutorial: boolean) => {
    const response = await http.put("/user/tutorial", {
      userId,
      finishedTutorial,
    });
    if (response.status !== 200) {
      throw new Error("Failed to finish tutorial");
    }
    return response.data;
  },
};
