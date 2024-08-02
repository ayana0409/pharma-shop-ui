import { Pagination, ProductCard } from "../../components/common/Side";
import { useState, useEffect } from "react";
import * as request from "../../utils/request";
import { useParams } from "react-router-dom";

const ProductList = () => {
  const { keyword, categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const size = 12;

  const fetchProducts = async () => {
    const formData = new FormData();

    const json = JSON.stringify({
      pageIndex: currentPage - 1,
      pageSize: size,
      keyword: keyword || '',
      categoryId: categoryId || 0,
    });

    formData.append("request", json);

    request
      .post("Shop/getproductpanigation", formData)
      .then((response) => {
        setProducts(response.datas);
        setTotalPages(Math.ceil(response.total / size));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, categoryId, keyword]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-semibold mb-4">Product Catalog</h1>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
