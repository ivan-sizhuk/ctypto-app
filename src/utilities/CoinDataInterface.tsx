export interface CoinData {
  id: string;
  symbol: string;
  image: string;
  thumb: string;
  name: string;
  current_price: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  total_volume: any;
  circulating_supply: any;
  total_supply: any;
  market_cap_rank: any;
  market_cap: any;
  description: {
    en: string;
  };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    ath: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    atl_date: { usd: string };
    market_cap: { usd: number };
    fully_diluted_valuation: {
      usd: string;
    };
    total_volume: { usd: number };
    circulating_supply: number;
    max_supply: number;
  };
  links: {
    homepage: string;
  };
}
