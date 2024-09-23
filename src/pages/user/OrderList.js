import Table from "../../components/common/Table";
import { useEffect, useState, useCallback, useRef } from "react";
import * as request from "../../utils/request";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/ui";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { formatDate } from "../../utils/format";

const OrderList = () => {
  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Date",
      accessor: "orderDate",
    },
    {
      Header: "Method",
      accessor: "paymentMethod",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Price",
      accessor: "totalPrice",
    },
    {
      Header: "Quantity",
      accessor: "totalItems",
    },
    {
      Header: "#",
      accessor: "action",
    },
  ];
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState();
  const [details, setDetails] = useState([]);

  const navigate = useNavigate();
  const cancelOrderRef = useRef(null);

  const handleDownloadInvoice = (orderId) => {
    request
      .get(`orders/${orderId}`)
      .then((response) => {
        const order = response;

        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        const docDefinition = {
          pageSize: "A4",
          content: [
            { text: "Invoice", style: "header" },
            `Order ID: ${order.id}`,
            `Date: ${formatDate(order.orderDate)}`,
            `Customer Name: ${order.fullName}`,
            `Phone: ${order.phone}`,
            `Total price: ${order.totalPrice}`,
            {
              table: {
                body: [
                  [
                    { text: "Product Name", style: "tableHeader" },
                    { text: "Quantity", style: "tableHeader" },
                    { text: "Unit Price", style: "tableHeader" },
                    { text: "Total", style: "tableHeader" },
                  ],
                  ...order.details.map((item) => [
                    item.productName,
                    item.quantity,
                    item.price,
                    item.quantity * item.price,
                  ]),
                ],
              },
            },
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [0, 0, 0, 20],
            },
            tableHeader: {
              bold: true,
              fontSize: 13,
              color: "black",
            },
          },
        };

        pdfMake.createPdf(docDefinition).download();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = useCallback(
    (pageSize, pageIndex) => {
      request
        .post("user/orders", {
          pageIndex: pageIndex,
          pageSize: pageSize,
          keyword: "",
        })
        .then((response) => {
          const data = response.datas.map((item) => ({
            ...item,
            orderDate: formatDate(item.orderDate),
            action: (
              <>
                {item.status === "Complete" && (
                  <label
                    className="text-green-500 hover:underline mx-1"
                    onClick={() => handleDownloadInvoice(item.id)}
                  >
                    Invoice
                  </label>
                )}
                <label
                  onClick={() => setSelectedOrder(item)}
                  className="text-blue-500 hover:underline  mx-1"
                >
                  Detail
                </label>
                {item.status === "New" && (
                  <label
                    className="text-red-500 hover:underline mx-1"
                    onClick={() => cancelOrderRef.current(item.id)}
                  >
                    Cancel
                  </label>
                )}
              </>
            ),
          }));
          setData(data);
          setTotalItems(response.total);
        })
        .catch((error) => {
          if (error.response.status === 403) {
            navigate("/");
          }
          console.error(error);
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

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  useEffect(() => {
    fetchData(pageSize, pageIndex);
  }, [pageIndex, pageSize, fetchData]);

  useEffect(() => {
    cancelOrderRef.current = cancelOrder;
  }, [cancelOrder]);

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

  return (
    <>
      <h1 className="font-bold text-3xl text-green-800 mb-4">ORDER LIST</h1>
      <Table
        columns={columns}
        data={data}
        total={totalItems}
        pageIndex={pageIndex}
        pageSize={pageSize}
        keyword=""
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
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
          <table className="min-w-full bg-white border-2 border-green-300 rounded-lg">
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

export default OrderList;
