import { createClientV2 } from "@0x/swap-ts-sdk";

const client = createClientV2({
    apiKey: process.env.ZEROX_API_KEY as string,
});
