
const BASE_URL = 'https://dramabox-api-rho.vercel.app';

async function probe() {
    console.log("Probing chapters with query params...");
    const params = [
        '?page=1&size=20',
        '?pageNum=1&pageSize=20',
        '?limit=20',
        '?getAll=true',
        '?count=20'
    ];

    for (const p of params) {
        try {
            console.log(`Trying ${p}...`);
            const res = await fetch(`${BASE_URL}/api/chapters/42000000651${p}`);
            const data = await res.json();
            if (data.data) {
                console.log(`  Count for ${p}:`, data.data.length);
            }
        } catch (e) {
            console.log(`  Error for ${p}:`, e.message);
        }
    }

    console.log("\nInspecting Detail result again...");
    try {
        const res = await fetch(`${BASE_URL}/api/detail/42000000651/v2`);
        const json = await res.json();
        console.log("Full Detail Keys:", Object.keys(json));
        if (json.data) {
            console.log("Data Keys:", Object.keys(json.data));
            if (json.data.book) {
                console.log("Book Keys:", Object.keys(json.data.book));
                console.log("Chapter Count in Book Info:", json.data.book.chapterCount);
            }
        }
    } catch (e) {
        console.log("Detail Error:", e);
    }
}

probe();
