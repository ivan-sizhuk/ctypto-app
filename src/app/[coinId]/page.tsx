"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { fetchSelectedCoinData } from "../../lib/slices/coinSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faCircle } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { CoinData } from "@/utilities/CoinDataInterface";

const Coin: React.FC = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const coinId = pathname as string;
  const selectedCoinData: CoinData | null = useAppSelector((state) => state.selectedCoinData.selectedCoinData);
  const loading = useAppSelector((state) => state.selectedCoinData.loading);
  const error = useAppSelector((state) => state.selectedCoinData.error);

  useEffect(() => {
    if (typeof coinId === "string") {
      dispatch(fetchSelectedCoinData(coinId) as any);
    }
  }, [dispatch, coinId]);

  if (loading || !selectedCoinData) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="px-8">
      <div className="flex h-72 gap-5">
        <div className="container flex flex-col justify-around w-3/5 py-4 px-8">
          <div className="flex justify-center items-center w-24 h-24">
            {/*  @ts-ignore */}
            <img src={selectedCoinData.image.large} alt="" />
          </div>
          <p className="text-3xl">{selectedCoinData.name}</p>
          <a href={selectedCoinData.links.homepage}>{selectedCoinData.links.homepage}</a>
        </div>
        <div className="container w-3/5 flex flex-col justify-around py-4 px-8">
          <p className="text-3xl">${selectedCoinData.market_data.current_price.usd}</p>
          <p>{selectedCoinData.market_data.price_change_percentage_24h}</p>
          <FontAwesomeIcon className="h-8 w-8" icon={faLayerGroup} />
          <div className="flex gap-14 px-8">
            <div>
              <p>ATH:</p>
              <p>${selectedCoinData.market_data.ath.usd}</p>
              <p>...</p>
              <p>{selectedCoinData.market_data.ath_date.usd}</p>
            </div>
            <div>
              <p>ATL:</p>
              <p>${selectedCoinData.market_data.atl.usd}</p>
              <p>...</p>
              <p>{selectedCoinData.market_data.atl_date.usd}</p>
            </div>
          </div>
        </div>
        <div className="container flex flex-col items-start gap-2 justify-around py-4 px-8">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon className="text-purple-500" icon={faCircle} />
            <div className="font-bold">Market Cap:</div>
            <div>${selectedCoinData.market_data.market_cap.usd}</div>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon className="text-purple-500" icon={faCircle} />
            <div className="font-bold">Fully Diluted Valuation:</div>
            <div>${selectedCoinData.market_data.fully_diluted_valuation.usd}</div>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon className="text-purple-500" icon={faCircle} />
            <div className="font-bold">Volume 24H:</div>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon className="text-purple-500" icon={faCircle} />
            <div className="font-bold">Total Volume:</div>
            <div>{selectedCoinData.market_data.total_volume.usd}</div>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon className="text-purple-500" icon={faCircle} />
            <div className="font-bold">Circulating Supply:</div>
            <div>{selectedCoinData.market_data.circulating_supply}</div>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon className="text-purple-500" icon={faCircle} />
            <div className="font-bold">Max Supply:</div>
            <div>{selectedCoinData.market_data.max_supply}</div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <p>Description:</p>
        <div className="container flex min-w-full p-8">{selectedCoinData.description.en}</div>
      </div>
      {/* <div>
        <div className="flex gap-5 mt-8">
          <div className="container h-16">hola</div>
          <div className="container h-16">hola</div>
        </div>
        <div className="container min-w-full h-16 mt-5">hola</div>
      </div> */}
    </div>
  );
};

export default Coin;
