import Table from "../../components/common/Table";
import { useEffect, useState, useCallback, useRef } from "react";
import * as request from "../../utils/request";
import { Button } from "../../components/ui";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import clsx from "clsx";

const Order = () => {
  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "fullName",
    },
    {
      Header: "Phone",
      accessor: "phone",
    },
    {
      Header: "Pay-Method",
      accessor: "paymentMethod",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Total items",
      accessor: "totalItems",
    },
    {
      Header: "Total price",
      accessor: "totalPrice",
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
  const cancelOrderRef = useRef(null);
  const processOrderRef = useRef(null);
  const completeOrderRef = useRef(null);

  const [selectedOrder, setSelectedOrder] = useState();
  const [details, setDetails] = useState([]);

  const fetchData = useCallback(
    (pageSize, pageIndex, keyword) => {
      request
        .get("orders", {
          params: {
            pageIndex,
            pageSize,
            keyword,
          },
        })
        .then((response) => {
            const data = response.datas.map((item) => {
                let statusColor;
                let actions = null;
            
                switch (item.status) {
                    case 'New':
                        statusColor = 'bg-blue-500';
                        actions = (
                            <>
                                <label
                                    onClick={() => setSelectedOrder(item)}
                                    className="text-blue-500 hover:underline mx-1"
                                >
                                    Detail
                                </label>
                                <label
                                    className="text-yellow-500 font-bold hover:underline mx-1"
                                    onClick={() => processOrderRef.current(item.id)}
                                >
                                    Processing
                                </label>
                                <label
                                    className="text-red-500 font-bold hover:underline mx-1"
                                    onClick={() => cancelOrderRef.current(item.id)}
                                >
                                    Cancel
                                </label>
                            </>
                        );
                        break;
                    case 'Processing':
                        statusColor = 'bg-yellow-500';
                        actions = (
                            <>
                                <label
                                    onClick={() => setSelectedOrder(item)}
                                    className="text-blue-500 hover:underline mx-1"
                                >
                                    Detail
                                </label>
                                <label
                                    className="text-green-600 font-bold hover:underline mx-1"
                                    onClick={() => completeOrderRef.current(item.id)}
                                >
                                    Complete
                                </label>
                                <label
                                    className="text-red-500 font-bold hover:underline mx-1"
                                    onClick={() => cancelOrderRef.current(item.id)}
                                >
                                    Cancel
                                </label>
                            </>
                        );
                        break;
                    case 'Complete':
                        statusColor = 'bg-green-600';
                        actions = (
                            <>
                                <label
                                    onClick={() => setSelectedOrder(item)}
                                    className="text-blue-500 hover:underline mx-1"
                                >
                                    Detail
                                </label>
                            </>
                        );
                        break;
                    case 'Cancel':
                        statusColor = 'bg-gray-500'; // Màu cho trạng thái Cancel
                        actions = (
                            <>
                                <label
                                    onClick={() => setSelectedOrder(item)}
                                    className="text-blue-500 hover:underline mx-1"
                                >
                                    Detail
                                </label>
                            </>
                        );
                        break;
                    default:
                        statusColor = 'bg-gray-500';
                        actions = (
                            <label
                                onClick={() => setSelectedOrder(item)}
                                className="text-blue-500 hover:underline mx-1"
                            >
                                Detail
                            </label>
                        );
                        break;
                }
            
                return {
                    ...item,
                    status: <span className={clsx('font-bold text-white p-2 rounded-full', statusColor)}>{item.status}</span>,
                    action: actions
                };
            });
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

  const cancelOrder = useCallback(
    (orderId) => {
      request.default
        .delete(`orders/${orderId}`)
        .then(() => {
          toast.success("Cancel successfully.");
          fetchData(pageSize, pageIndex);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Can't cancel this order.");
        });
    },
    [fetchData, pageIndex, pageSize]
  );

  const processOrder = useCallback(
    (orderId) => {
      request.default
        .patch(`orders/${orderId}`, {
          status: 2,
        })
        .then(() => {
          toast.warn("Processing...");
          fetchData(pageSize, pageIndex);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Can't process this order.");
        });
    },
    [fetchData, pageIndex, pageSize]
  );

  const completeOrder = useCallback(
    (orderId) => {
      request.default
        .patch(`orders/${orderId}`, {
          status: 4,
        })
        .then(() => {
          toast.success("Successful.");
          fetchData(pageSize, pageIndex);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Can't complete this order.");
        });
    },
    [fetchData, pageIndex, pageSize]
  );

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleKeywordChange = (newKeyword) => {
    setKeyword(newKeyword);
  };

  useEffect(() => {
    if (selectedOrder) {
      request
        .get(`Orders/Details/${selectedOrder.id}`)
        .then((response) => {
          setDetails(response);
        })
        .catch((error) => {
          console.error(error);
          setDetails([]);
        });
    } else {
      setDetails([]);
    }
  }, [selectedOrder]);

  useEffect(() => {
    fetchData(pageSize, pageIndex, keyword);
  }, [pageIndex, pageSize, keyword, fetchData]);

  useEffect(() => {
    cancelOrderRef.current = cancelOrder;
    processOrderRef.current = processOrder;
    completeOrderRef.current = completeOrder;
  }, [cancelOrder, processOrder, completeOrder]);

  return (
    <>
      <h1 className="font-bold text-3xl text-green-800 mb-4">ORDER</h1>
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
      {!selectedOrder || (
        <div className="container mx-auto m-8">
          <div className="flex justify-between m-2">
            <h2 className="font-bold text-xl text-green-800 mb-4">
              ORDER ID: {selectedOrder.id}
            </h2>
            <Button primary onClick={() => setSelectedOrder(0)}>
              Close
            </Button>
          </div>
          <table className=" min-w-full bg-white border-2 border-green-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Price</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail) => (
                <tr key={detail.productId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">
                    {detail.productId}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <img
                      className="w-16 h-16 object-cover mx-auto"
                      src={detail.imageUrl}
                      alt={detail.productName}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {detail.productName}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {detail.quantity}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    ${detail.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <h3>
              Total:{" "}
              {details.reduce(
                (acc, detail) => acc + detail.price * detail.quantity,
                0
              )}
            </h3>
            <h3>
              Discount:{" "}
              {details.reduce(
                (acc, detail) => acc + detail.price * detail.quantity,
                0
              ) - selectedOrder.totalPrice}
            </h3>
            <h3>Payment total: {selectedOrder.totalPrice}</h3>
          </div>
        </div>
      )}
    </>
  );
};

export default Order;
