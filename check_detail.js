
const BASE_URL = 'https://dramabox-api-rho.vercel.app';

async function check() {
    console.log("Checking Detail API...");
    try {
        const res = await fetch(`${BASE_URL}/api/detail/42000000651/v2`);
        const json = await res.json();

        if (json.data) {
            if (json.data.chapters) {
                console.log("Chapters in Detail:", json.data.chapters.length);
                const first = json.data.chapters[0];
                console.log("First Chapter Keys:", Object.keys(first));
                // Check for video related keys
                console.log("Has videoPath?", !!first.videoPath);
                console.log("Has cdnList?", !!first.cdnList);
            } else {
                console.log("No chapters in detail data");
            }

            if (json.data.drama) {
                console.log("Drama Info Keys:", Object.keys(json.data.drama));
                console.log("Drama Name:", json.data.drama.name || json.data.drama.title);
                console.log("Drama Intro:", json.data.drama.introduction || json.data.drama.description);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

check();
