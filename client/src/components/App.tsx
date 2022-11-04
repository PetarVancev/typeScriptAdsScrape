import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Ads from "./Ads";
import Pagination from "./Pagination";

const App = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage, setAdsPerPage] = useState(20);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      const res = await axios.get("http://localhost:3007/getData");
      setAds(res.data);
      setLoading(false);
    };
    fetchAds();
  }, []);

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-3">Apartments</h1>
      <Ads ads={currentAds} loading={loading} />
      <Pagination
        adsPerPage={adsPerPage}
        totalAds={ads.length}
        paginate={paginate}
      />
    </div>
  );
};

export default App;
