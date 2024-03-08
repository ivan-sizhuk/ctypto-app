import { useEffect } from "react";
import { useAppDispatch } from "../lib/hooks";
import { fetchCoinData } from "../lib/slices/coinListSlice";
import PropTypes from "prop-types";

interface CoinDataProviderProps {
  children: React.ReactNode;
}

const CoinDataProvider: React.FC<CoinDataProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCoinData() as any);
  }, [dispatch]);

  return <>{children}</>;
};

CoinDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CoinDataProvider;
