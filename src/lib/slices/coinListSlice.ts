import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CoinData } from "@/utilities/CoinDataInterface";

export const formatNumber = (num: any) => {
  const parsedNum = typeof num === "string" ? parseFloat(num) : num;

  if (!isNaN(parsedNum)) {
    if (parsedNum >= 1e9) {
      return `${(parsedNum / 1e9).toFixed(1)}B`;
    } else if (parsedNum >= 1e6) {
      return `${(parsedNum / 1e6).toFixed(1)}M`;
    } else if (parsedNum >= 1e3) {
      return `${(parsedNum / 1e3).toFixed(1)}K`;
    } else {
      return `${parsedNum}`;
    }
  } else {
    return "Invalid number";
  }
};

export const fetchCoinData = createAsyncThunk<CoinData[], void>("coinData/fetchCoinData", async (_, thunkAPI) => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d&x_cg_demo_api_key=CG-ngyTBAk7Rz4RzH3a3JZW63Zo"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data: CoinData[] = await response.json();
    const updatedData = data.map((coin) => ({
      ...coin,
      market_cap: formatNumber(coin.market_cap),
      total_volume: formatNumber(coin.total_volume),
      circulating_supply: formatNumber(parseFloat(coin.circulating_supply)),
      total_supply: formatNumber(parseFloat(coin.total_supply)),
    }));

    return updatedData;
  } catch (error) {
    return thunkAPI.rejectWithValue(error instanceof Error ? error.message : "An error occurred");
  }
});

interface CoinDataState {
  cryptoData: CoinData[];
  loading: boolean;
  error: string | null;
}
const initialState: CoinDataState = {
  cryptoData: [],
  loading: false,
  error: null,
};

export const coinDataSlice = createSlice({
  name: "coinData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoinData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoinData.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptoData = action.payload;
      })
      .addCase(fetchCoinData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default coinDataSlice.reducer;
