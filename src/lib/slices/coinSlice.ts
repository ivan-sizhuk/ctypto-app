import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CoinData } from "@/utilities/CoinDataInterface";
import { formatNumber } from "./coinListSlice";

export const fetchSelectedCoinData = createAsyncThunk<CoinData, string>(
  "selectedCoin/fetchSelectedCoinData",
  async (coinId: string, thunkAPI) => {
    try {
      console.log("successfully fetched coin:", coinId);
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: CoinData = await response.json();

      const homepageUrl = Array.isArray(data.links.homepage) ? data.links.homepage[0] : data.links.homepage;
      const formatTimestampToDate = (timestamp: string): string => {
        const dateObject = new Date(timestamp);
        return dateObject.toISOString().split("T")[0];
      };

      return {
        ...data,
        links: {
          ...data.links,
          homepage: homepageUrl,
        },
        market_data: {
          ...data.market_data,
          ath_date: {
            ...data.market_data.ath_date,
            usd: formatTimestampToDate(data.market_data.ath_date.usd),
          },
          atl_date: {
            ...data.market_data.atl_date,
            usd: formatTimestampToDate(data.market_data.atl_date.usd),
          },
        },
        market_cap: formatNumber(data.market_cap),
        total_volume: formatNumber(data.total_volume),
        circulating_supply: formatNumber(parseFloat(data.circulating_supply)),
        total_supply: formatNumber(parseFloat(data.total_supply)),
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error instanceof Error ? error.message : "An error occurred");
    }
  }
);

interface SelectedCoinState {
  selectedCoinId: string | null;
  selectedCoinData: CoinData | null;
  loading: boolean;
  error: string | null;
  loadingInitialized: boolean;
}

const initialState: SelectedCoinState = {
  selectedCoinId: null,
  selectedCoinData: null,
  loading: false,
  error: null,
  loadingInitialized: false,
};

export const selectedCoinSlice = createSlice({
  name: "selectedCoin",
  initialState,
  reducers: {
    setSelectedCoinId: (state, action) => {
      state.selectedCoinId = action.payload;
      localStorage.setItem("selectedCoinId", action.payload);
    },
    setLoadingInitialized: (state, action) => {
      state.loadingInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelectedCoinData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSelectedCoinData.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCoinData = action.payload;
      })
      .addCase(fetchSelectedCoinData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const selectedCoinReducer = selectedCoinSlice.reducer;
export const selectedCoinDataReducer = selectedCoinSlice.reducer;
