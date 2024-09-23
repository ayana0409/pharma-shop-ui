import { useEffect, useState } from "react";
import {
  Input,
  Button,
  LoadingScreen,
  ExportExcelButton,
} from "../../../components/ui";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/format";
import * as request from "../../../utils/request";

const ProductStatistic = () => {
  const [view, setView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(() => formatDate(new Date()));
  const [toDate, setToDate] = useState(() => formatDate(new Date()));

  const [statisticData, setStatisticData] = useState([]);

  const handleSetFromDate = (e) => {
    const today = new Date();
    const date = e.target.value;

    if (new Date(date) > today) {
      toast.warn("The start date cannot be greater than the current date");
      setFromDate(formatDate(today));
      return;
    }

    setFromDate(date);
  };

  const handleSetToDate = (e) => {
    const today = new Date();
    const date = e.target.value;

    if (date < fromDate) {
      toast.warn("The end date cannot be smaller than the start date");
      setToDate(formatDate(today));
      return;
    }

    setToDate(date);
  };

  const handleView = () => {
    setLoading(true);
    const to = new Date(toDate);

    const tomorrow = new Date(to);
    tomorrow.setDate(to.getDate() + 1);

    request
      .get(`report/product/${fromDate}`, {
        params: {
          endDate: tomorrow,
        },
      })
      .then((response) => {
        setStatisticData(response.datas);
        setView(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setView(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!fromDate) {
      setFromDate(formatDate(new Date()));
    }
    if (!toDate) {
      setToDate(formatDate(new Date()));
    }
  }, [fromDate, toDate]);

  return (
    <div>
      <div className="m-4">
        {!loading || <LoadingScreen />}
        <h1 className="font-bold text-3xl text-green-800 mb-4">
          PRODUCT STATISTIC
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="text-green-900 text-xl float-start">From</label>
            <Input value={fromDate} onChange={handleSetFromDate} type="date" />
          </div>
          <div>
            <label className="text-green-900 text-xl float-start">To</label>
            <Input value={toDate} onChange={handleSetToDate} type="date" />
          </div>
        </div>
        <Button primary onClick={handleView}>
          View
        </Button>
      </div>
      {!view || (
        <table className="min-w-full bg-white border-2 border-green-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-r-2 border-b-2">ID</th>
              <th className="py-2 px-4 border-r-2 border-b-2">Product name</th>
              <th className="py-2 px-4 border-r-2 border-b-2">Store</th>
              <th className="py-2 px-4 border-r-2 border-b-2">Sale</th>
              <th className="py-2 px-4 border-b-2">Total price</th>
            </tr>
          </thead>
          <tbody>
            {statisticData.map((data) => (
              <tr key={data.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-r border-t-2 text-center">
                  {data.id}
                </td>
                <td className="py-2 px-4 border-r border-t-2 text-left">
                  {data.name}
                </td>
                <td className="py-2 px-4 border-r border-t-2 text-center">
                  {data.storeQuantity}
                </td>
                <td className="py-2 px-4 border-r border-t-2 text-center">
                  {data.saleQuantity}
                </td>
                <td className="py-2 px-4 border-t-2 text-right">
                  {data.totalPrice}
                </td>
              </tr>
            ))}
          </tbody>
          <ExportExcelButton data={statisticData} />
        </table>
      )}
    </div>
  );
};

export default ProductStatistic;
