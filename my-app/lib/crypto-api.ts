import { Cryptocurrency } from './crypto-data';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
  };
}

export async function getCryptoPrices(cryptoIds: string[]): Promise<CoinGeckoPrice> {
  const response = await fetch(
    `${COINGECKO_API_BASE}/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch crypto prices');
  }

  return response.json();
}

export async function updateCryptoPrice(crypto: Cryptocurrency): Promise<number> {
  try {
    const prices = await getCryptoPrices([crypto.id]);
    return prices[crypto.id].usd;
  } catch (error) {
    console.error(`Error fetching price for ${crypto.id}:`, error);
    return crypto.currentPrice; // Return current price as fallback
  }
}

// Function to get historical prices for the last minute (in 10-second intervals)
export async function getHistoricalPrices(cryptoId: string, minutes: number = 1): Promise<number[]> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const from = now - (minutes * 60);
    
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/${cryptoId}/market_chart/range?vs_currency=usd&from=${from}&to=${now}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch historical prices');
    }

    const data = await response.json();
    return data.prices.map((price: [number, number]) => price[1]);
  } catch (error) {
    console.error(`Error fetching historical prices for ${cryptoId}:`, error);
    return [];
  }
} 