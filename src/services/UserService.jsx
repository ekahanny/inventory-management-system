import axiosInstance from "../utils/api";

const UserService = {
  userLogin: async (userData) => {
    try {
      const res = await axiosInstance.post("/login", userData);
      return res.data;
    } catch (error) {
      console.error("Gagal login: ", error);
      throw error;
    }
  },
};

export default UserService;
