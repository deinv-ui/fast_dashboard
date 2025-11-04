// src/data/stockApi.ts
import axios from "axios";

export interface StockQuote {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  timestamp: string;
}

const API_KEY = "d44qb2hr01qr9l826r3gd44qb2hr01qr9l826r40"; 
const BASE = "https://finnhub.io/api/v1";

/**
 * Fetch a single stock quote from Finnhub
 */
export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const { data } = await axios.get(`${BASE}/quote`, {
      params: {
        symbol,
        token: API_KEY,
      },
    });

    if (!data || Object.keys(data).length === 0) {
      throw new Error(`No data returned for ${symbol}`);
    }

    return {
      symbol,
      price: data.c,           // current price
      open: data.o,            // open price
      high: data.h,            // high price
      low: data.l,             // low price
      previousClose: data.pc,  // previous close
      timestamp: new Date(data.t * 1000).toISOString(), // convert UNIX timestamp to ISO
    };
  } catch (err) {
    console.error(`Failed to fetch quote for ${symbol}`, err);
    throw err;
  }
}
