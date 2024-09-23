import { useEffect, useState } from "react";
import { ProductCard } from "../components/common/Side";
import * as request from "../utils/request";

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    request
      .get("shop/homeProduct")
      .then((response) => {
        console.log(response);
        setData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-700 my-2">HOME</h1>
      <div className="m-4">
        {data.map((item, index) => (
          <div key={index} className="mt-2">
            <h1 className="text-3xl font-bold text-green-700 my-2 text-left">
              {item.categoryName}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {item.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
