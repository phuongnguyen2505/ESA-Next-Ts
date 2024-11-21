
export const isAuthenticated = (): boolean => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		return !!token;
	}
	return false;
};

export const login = async (email: string, password: string): Promise<boolean> => {
	try {
		if (email === "admin@example.com" && password === "password123") {
			localStorage.setItem("token", "fake-jwt-token");
			return true;
		}
		return false;
	} catch (error) {
		console.error("Login error:", error);
		return false;
	}
};

export const logout = (): void => {
	localStorage.removeItem("token");
	window.location.href = "/login";
};
