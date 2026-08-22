const API_URL = import.meta.env.VITE_API_URL;


export const UserService = {
    getAllUsers: async () => {
        const response = await fetch(`${API_URL}/users`);
        return response.json();
    },
    getProfile: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            credentials: 'include'
        });
        return response.json();
    }
}