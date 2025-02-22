import http from "../http";

export const UserAPI = {
  finishTutorial: async (finishedTutorial: any) => {
    const response = await http.put("/user/tutorial", finishedTutorial);
    if (response.status !== 200) {
      throw new Error("Logout failed");
    }
    return response.data;
  },
};
