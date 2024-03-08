"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { fetchCoinData } from "../../lib/slices/coinListSlice";
import { CoinData } from "../../utilities/CoinDataInterface";

const CoinDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<CoinData[]>([]);
  const { cryptoData, error } = useAppSelector((state) => state.coinData);
  const [selectedCoin, setSelectedCoin] = useState<{ symbol: string; image: string } | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(fetchCoinData());
  }, [dispatch]);

  useEffect(() => {
    if (cryptoData.length > 0) {
      setSelectedCoin({
        symbol: cryptoData[0].symbol,
        image: cryptoData[0].image,
      });
      setSearchResults(cryptoData.slice(0, 5));
    }
  }, [cryptoData]);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      searchTimeout.current = setTimeout(() => {
        fetchSearchResults(searchTerm.trim());
      }, 2000);
    } else {
      setSearchResults(cryptoData.slice(0, 5));
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, cryptoData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const fetchSearchResults = async (term: string) => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${term}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setSearchResults(data.coins.slice(0, 5));
    } catch (error) {
      console.error("Error searching coins:", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (symbol: string, image: string) => {
    setSelectedCoin({ symbol, image });
    setIsOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center w-32">
        {selectedCoin ? (
          <>
            <img className="w-8 h-8" src={selectedCoin.image} alt={selectedCoin.symbol} />
            <span className="ml-2">{selectedCoin.symbol.toUpperCase()}</span>
          </>
        ) : (
          "Loading..."
        )}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-44 text-black">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md px-3 py-1 w-full"
          />
          <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-sm">
            {searchResults.map((coin) => (
              <li
                key={coin.id}
                onClick={() => handleOptionClick(coin.symbol, coin.image || coin.thumb)}
                className="flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100"
              >
                <img className="w-8 h-8" src={coin.image || coin.thumb} alt={coin.name} />
                <span className="ml-2">{coin.symbol.toUpperCase()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CoinDropdown;
