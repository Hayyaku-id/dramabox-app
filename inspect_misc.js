const BASE_URL = 'https://dramabox-api-rho.vercel.app';

async function inspectMisc() {
    console.log("Checking Search API with 'keyword'...");
    try {
        const query = "love";
        const res = await fetch(`${BASE_URL}/api/search?keyword=${query}`);
        const data = await res.json();
        console.log("Search Status:", res.status);
        if (data.data) {
            console.log("Search Data Keys:", Object.keys(data.data));
            // Assuming it returns a list or simliar
            console.log("Search Sample:", JSON.stringify(data.data, null, 2).substring(0, 300));
        } else {
            console.log("Search Resp:", data);
        }
    } catch (e) {
        console.error("Search Error:", e.message);
    }

    console.log("\nChecking Recommend API Sample...");
    try {
        const res = await fetch(`${BASE_URL}/api/recommend`);
        const data = await res.json();
        if (Array.isArray(data.data)) {
            console.log("Rec Array Length:", data.data.length);
            if (data.data.length > 0) {
                console.log("Rec Item Sample:", JSON.stringify(data.data[0], null, 2));
            }
        } else {
            console.log("Rec Data:", data.data);
        }
    } catch (e) {
        console.error("Rec Error:", e.message);
    }
}

inspectMisc();
