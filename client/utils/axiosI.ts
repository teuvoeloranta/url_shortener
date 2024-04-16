import axios from "axios";

const axiosI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + "/url",
});

export default axiosI;
