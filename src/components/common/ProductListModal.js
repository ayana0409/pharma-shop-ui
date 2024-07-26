import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import Table from "../../components/common/Table";
import { useEffect, useState, useCallback } from "react";
import request from "../../utils/request";
import { Button } from "../../components/ui";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProductListModal = ({ className, children, onClickAdd, disabled }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleKeywordChange = (newKeyword) => {
    setKeyword(newKeyword);
  };

  const handlerAdd = useCallback((productId) => {
    onClickAdd(productId);
  }, [onClickAdd]);
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

  const fetchData = useCallback(
    (pageSize, pageIndex, keyword) => {
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
              <Button
                onClick={() => {
                  handlerAdd(item.id);
                }}
                className="text-blue-500 rounded-lg hover:underline py-0"
              >
                Add
              </Button>
            ),
          }));
          setData(data);
          setTotalItems(response.data.total);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [handlerAdd]
  );

  useEffect(() => {
    fetchData(pageSize, pageIndex, keyword);
  }, [pageIndex, pageSize, keyword, fetchData]);
  return (
    <div>
      <Button onClick={handleOpen} primary className={className} disabled = {disabled}>
        {children}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className="text-xl font-bold">Product list</h2>
          <div>
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
        </Box>
      </Modal>
    </div>
  );
};

export default ProductListModal;
