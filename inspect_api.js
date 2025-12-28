
const BASE_URL = 'https://dramabox-api-rho.vercel.app';

async function inspect() {
    console.log("Fetching chapters...");
    try {
        const res = await fetch(`${BASE_URL}/api/chapters/42000000651`);
        const data = await res.json();
        console.log("Status:", res.status);
        if (data.data) {
            console.log("Total chapters:", data.data.length);
            console.log("First chapter sample:", JSON.stringify(data.data[0], null, 2));
            if (data.data.length > 5) {
                console.log("Last chapter sample:", JSON.stringify(data.data[data.data.length - 1], null, 2));
            }
        } else {
            console.log("No data found or structure different:", data);
        }

        console.log("\nFetching detail...");
        const resDetail = await fetch(`${BASE_URL}/api/detail/42000000651/v2`);
        const dataDetail = await resDetail.json();
        console.log("Detail sample:", JSON.stringify(dataDetail.data?.book, null, 2));

    } catch (e) {
        console.error("Error:", e);
    }
}

inspect();
