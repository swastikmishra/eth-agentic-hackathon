import { User } from "@/stores/user";

export const callAPI = async (
    endpoint: string,
    method: string = "GET",
    data: object | null = null
) => {
    const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
    try {
        let res = await fetch(`${API_URL}${endpoint}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${User.privyAccessToken}`,
            },
            body: method != "GET" ? JSON.stringify(data) : null,
        });
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return await res.json();
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
};
