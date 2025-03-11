"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string; // Lấy locale từ params
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin", // include credentials so the cookie is stored
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            // Buộc reload toàn trang để middleware được kích hoạt lại
            window.location.href = `/${locale}/admin`;
        } else {
            const data = await res.json();
            setError(data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-1">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}
