import Table from "../../components/common/Table";
import { useEffect, useState, useCallback } from "react";
import request from "../../utils/request";
import { Button } from "../../components/ui";
import { Link } from "react-router-dom";

const Product = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = useCallback((pageSize, pageIndex, keyword) => {
    const json = JSON.stringify({
      pageIndex: pageIndex,
      pageSize: pageSize,
      keyword: keyword,
    });
    const formData = new FormData();
    formData.append("request", json);
    request
      .post("product/getpanigation", formData)
      .then((response) => {
        const data = response.data.datas.map((item) => ({
          ...item,
          action: (
            <Link
              to={`/admin/product/addandupdate/${item.id}`}
              className="text-blue-500 hover:underline"
            >
              Edit
            </Link>
          ),
        }));
        setData(data);
        setTotalItems(response.data.total);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchData(pageSize, pageIndex, keyword);
  }, [pageIndex, pageSize, keyword, fetchData]);

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleKeywordChange = (newKeyword) => {
    setKeyword(newKeyword);
  };

  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Packaging",
      accessor: "packaging",
    },
    {
      Header: "Brand",
      accessor: "brand",
    },
    {
      Header: "Price",
      accessor: "price",
    },
    {
      Header: "Category",
      accessor: "categoryName",
    },
    {
      Header: "#",
      accessor: "action",
    },
  ];
  return (
    <>
      <h1 className="font-bold text-3xl text-green-800 mb-4">PRODUCT LIST</h1>
      <div className="text-right">
        <Button primary className="rounded-lg ml-4 mb-4">
          <Link to="/admin/product/addandupdate">Add</Link>
        </Button>
      </div>
      <Table
        columns={columns}
        data={data}
        total={totalItems}
        pageIndex={pageIndex}
        pageSize={pageSize}
        keyword={keyword}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onKeywordChange={handleKeywordChange}
      />
    </>
  );
};

export default Product;
