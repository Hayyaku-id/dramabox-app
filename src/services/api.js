// Use empty string for Vite proxy in browser, absolute URL for Node.js testing
const BASE_URL = 'https://dramabox-api-rho.vercel.app';

export const api = {
    getHome: async () => {
        const res = await fetch(`${BASE_URL}/api/home`);
        return res.json();
    },

    getVip: async () => {
        const res = await fetch(`${BASE_URL}/api/vip`);
        return res.json();
    },

    getDubbed: async () => {
        const res = await fetch(`${BASE_URL}/api/dubbed`);
        return res.json();
    },

    getSearch: async (keyword) => {
        const res = await fetch(`${BASE_URL}/api/search?keyword=${encodeURIComponent(keyword)}`);
        return res.json();
    },

    getDetail: async (bookId) => {
        const res = await fetch(`${BASE_URL}/api/detail/${bookId}/v2`);
        return res.json();
    },

    getChapters: async (bookId) => {
        const res = await fetch(`${BASE_URL}/api/chapters/${bookId}`);
        return res.json();
    },

    getStream: async (bookId, chapterId) => {
        // Endpoint: /api/stream
        // Based on error: "Parameter bookId dan episode wajib diisi."
        const res = await fetch(`${BASE_URL}/api/stream?bookId=${bookId}&episode=${chapterId}`);
        return res.json();
    },

    getCategory: async (id) => {
        const res = await fetch(`${BASE_URL}/api/category/${id}`);
        return res.json();
    },

    getCategories: async () => {
        const res = await fetch(`${BASE_URL}/api/categories`);
        return res.json();
    },

    getRecommend: async () => {
        const res = await fetch(`${BASE_URL}/api/recommend`);
        return res.json();
    }
};
