import axios from "axios";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "https://www.vesaflow.com/",
	headers: {
		"Content-Type": "application/json",
	},
});

export default axiosInstance;
