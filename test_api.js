import { api } from './src/services/api.js';

// Mock fetch for node environment if needed, or just use node's fetch (Node 18+)
// Assuming Node 18+ is available which supports fetch globally.

async function test() {
    try {
        const bookId = "41000122939"; // ID from previous run
        console.log("Fetching Detail...");
        const detail = await api.getDetail(bookId);
        console.log("Detail Data:", JSON.stringify(detail, null, 2).slice(0, 500));

        console.log("Fetching Chapters...");
        const chapters = await api.getChapters(bookId);
        console.log("Chapters Data:", JSON.stringify(chapters, null, 2).slice(0, 500));
    } catch (e) {
        console.error(e);
    }
}

test();
