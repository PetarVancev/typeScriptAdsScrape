import * as React from "react";

const Ads = ({ ads, loading }: { ads: any[]; loading: boolean }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <ul className="list-group md-4">
      {ads.map((ad: any) => (
        <li key={ad.id} className="list-group-item text-center">
          <img src={ad.url} alt="" />
          <p>{ad.title}</p>
        </li>
      ))}
    </ul>
  );
};

export default Ads;
