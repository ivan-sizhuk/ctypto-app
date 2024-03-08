import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { fetchCoinData } from "../../lib/slices/coinListSlice";
import Link from "next/link";

const CoinList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cryptoData, loading, error } = useAppSelector((state) => state.coinData);

  useEffect(() => {
    dispatch(fetchCoinData() as any);
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || cryptoData.length === 0) {
    return <div>Error: {error}</div>;
  }

  return (
    <ul className="mt-4">
      <li className="min-w-full my-1 h-16 flex items-center justify-start text-gray-500">
        <span className="ml-6 w-10">#</span>
        <span className="w-48">Name</span>
        <span className="w-36">Price</span>
        <span className="w-28">1h%</span>
        <span className="w-28">24h%</span>
        <span className="w-32">7d%</span>
        <span className="w-32">Market Cap</span>
        <span className="w-40">Volume(24h)</span>
        <span className="w-52">Circulation/Total Supply</span>
        <span className="flex justify-end w-36 mr-6">Last 7d</span>
      </li>
      {cryptoData.map((crypto) => (
        <Link href="/[coinId]" as={`/${crypto.id}`} key={crypto.id}>
          <li key={crypto.id} className="container min-w-full my-1 h-16 flex items-center justify-start cursor-pointer">
            <span className="ml-6 w-10">{crypto.market_cap_rank}</span>
            <span className="w-48">
              <span className="w-36 flex items-center">
                <img className="w-7 mr-3" src={crypto.image} alt={"img"} />
                <span className="">{crypto.name}</span>
              </span>
            </span>
            <span className="w-36">${crypto.current_price.toLocaleString()}</span>
            <span className="w-28">{crypto.price_change_percentage_1h_in_currency.toFixed(1)}%</span>
            <span className="w-28">{crypto.price_change_percentage_24h_in_currency.toFixed(1)}%</span>
            <span className="w-32">{crypto.price_change_percentage_7d_in_currency.toFixed(1)}%</span>
            <span className="w-32">${crypto.market_cap}</span>
            <span className="w-40">${crypto.total_volume}</span>
            <div className="w-52">
              <div className="w-44">
                <div>
                  <span className="flex justify-between">
                    <span className="mr-2">{crypto.circulating_supply}</span>
                    <span className="ml-2">{crypto.total_supply}</span>
                  </span>
                </div>
              </div>
              <div className="h-4 w-44 bg-gray-50 bg-opacity-10 backdrop-blur-md rounded-lg overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{
                    width: `${(parseFloat(crypto.circulating_supply) / parseFloat(crypto.total_supply)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <span className="flex justify-end w-36 mr-6">Coming Soon...</span>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default CoinList;
