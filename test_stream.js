import { api } from './src/services/api.js';

async function testStream() {
    try {
        console.log("Fetching VIP...");
        const vip = await api.getVip();
        console.log("VIP Data:", JSON.stringify(vip, null, 2).slice(0, 500));

        console.log("Fetching Dubbed...");
        const dubbed = await api.getDubbed();
        console.log("Dubbed Data:", JSON.stringify(dubbed, null, 2).slice(0, 500));

    } catch (e) {
        console.error(e);
    }
}

testStream();
