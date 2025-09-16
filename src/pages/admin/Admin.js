import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import * as request from "../../utils/request";
import { formatDate } from "../../utils/format";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [state, dispatch] = useStore();
  const navigation = useNavigate();

  useEffect(() => {
    console.log(state.userRole);
    
    if (!state.userRole)
      navigation("/");

    request
      .get("report/weekly-revenue")
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [state.userRole, navigation]);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const options = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: data.map((d) => formatDate(d.date)),
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Revenue",
          type: "bar",
          barWidth: "60%",
          data: data.map((d) => d.revenue),
        },
      ],
    };

    chartInstance.setOption(options);

    return () => {
      chartInstance.dispose();
    };
  }, [data]);

  return (
    <div>
      <div>
        <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
      </div>
    </div>
  );
};

export default Admin;
