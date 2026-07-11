import { Zernio } from "@zernio/node";

if (!process.env.ZERNIO_API_KEY) {
  throw new Error("ZERNIO_API_KEY environment variable is not set");
}

const zernio = new Zernio({
  apiKey: process.env.ZERNIO_API_KEY,
  baseURL: "https://zernio.com/api",
});

export default zernio;
