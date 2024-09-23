import Table from "../../../components/common/Table";
import { useEffect, useState, useCallback } from "react";
import * as request from "../../../utils/request";
import { Button } from "../../../components/ui";
import { Link, useNavigate } from "react-router-dom";

const Managers = () => {
  const columns = [
    {
      Header: "Username",
      accessor: "username",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Phone",
      accessor: "phone",
    },
    {
      Header: "Roles",
      accessor: "roles",
    },
    {
      Header: "#",
      accessor: "action",
    },
  ];
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  const fetchData = useCallback(
    (pageSize, pageIndex, keyword) => {
      request
        .get("accounts/panigation", {
          params: {
            pageIndex,
            pageSize,
            requireRole: true,
            keyword,
          },
        })
        .then((response) => {
          const data = response.datas.map((item) => ({
            ...item,
            action: (
              <Link
                to={`/admin/managerdetails/${item.id}`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
            ),
          }));
          setData(data);
          setTotalItems(response.total);
        })
        .catch((error) => {
          if (error.response.status === 403) {
            navigate("/");
          }
          console.log(error);
          console.log(error.response.status);
        });
    },
    [navigate]
  );

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

  return (
    <div className="mx-4">
      <h1 className="font-bold text-3xl text-green-800 mb-4">MANAGER LIST</h1>
      <div className="text-right">
        <Button primary className="rounded-lg ml-4 mb-4">
          <Link to="/admin/managerdetails">Add</Link>
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
    </div>
  );
};

export default Managers;
