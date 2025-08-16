import React from "react";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Scatter
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartComponent = ({ type, data, xKey, yKey }) => {
  if (!data || data.length === 0 || !xKey) return <p>No data</p>;

  const isXString = typeof data[0][xKey] === "string";

  let labels = [];
  let datasetValues = [];
  let datasetLabel = "";

  if (isXString) {
    // Count mode
    const counts = data.reduce((acc, item) => {
      const key = item[xKey] ?? "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    labels = Object.keys(counts);
    datasetValues = Object.values(counts);
    datasetLabel = `Count of ${xKey}`;
  } else {
    // Value mode
    labels = data.map((item) => item[xKey]);
    datasetValues = data.map((item) => Number(item[yKey]) || 0);
    if (["line", "scatter", "bar", "stackedBar"].includes(type)) {
      datasetLabel = `${yKey} vs ${xKey}`;
    }
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data: datasetValues,
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(255,99,132,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(153,102,255,0.6)",
          "rgba(255,159,64,0.6)"
        ],
        borderColor: "rgba(255,255,255,0.8)",
        borderWidth: 1
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 5 },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 8 },
          boxWidth: 10
        }
      },
      tooltip: {
        bodyFont: { size: 9 },
        titleFont: { size: 10 }
      }
    },
    scales: type !== "pie" && type !== "doughnut" ? {
      x: {
        title: { display: true, text: xKey, font: { size: 9 } },
        ticks: { font: { size: 8 } }
      },
      y: {
        title: { display: true, text: isXString ? "Count" : yKey, font: { size: 9 } },
        ticks: { font: { size: 8 } }
      }
    } : {}
  };

  return (
        <div style={{ width: "100%", height: "100%", minHeight: "180px" }}>
          {type === "bar" && <Bar data={chartData} options={commonOptions} />}
          {type === "stackedBar" && (
            <Bar
              data={chartData}
              options={{
                ...commonOptions,
                scales: {
                  x: { ...commonOptions.scales.x, stacked: true },
                  y: { ...commonOptions.scales.y, stacked: true }
                }
              }}
            />
          )}
          {type === "line" && <Line data={chartData} options={commonOptions} />}
          {type === "pie" && <Pie data={chartData} options={commonOptions} />}
          {type === "doughnut" && <Doughnut data={chartData} options={commonOptions} />}
          {type === "scatter" && (
            <Scatter
              data={{
                datasets: [
                  {
                    label: datasetLabel,
                    data: data.map((item) => ({
                      x: Number(item[xKey]) || 0,
                      y: Number(item[yKey]) || 0
                    })),
                    backgroundColor: "rgba(75,192,192,0.6)"
                  }
                ]
              }}
              options={commonOptions}
            />
          )}
        </div>
      );
      
};

export default ChartComponent;





// ChartComponent.js
// import React from "react";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   RadialLinearScale,
// } from "chart.js";
// import { Pie, Line, Bar, Doughnut, Scatter } from "react-chartjs-2";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   RadialLinearScale
// );

// const ChartComponent = ({ type, data, xKey, yKey }) => {
//   if (!data || !xKey || !yKey) return <p>No data available</p>;

//   const labels = data.map((d) => d[xKey]);
//   const values = data.map((d) => Number(d[yKey]) || 0);

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: `${yKey} vs ${xKey}`,
//         data: values,
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.5)",
//           "rgba(54, 162, 235, 0.5)",
//           "rgba(255, 206, 86, 0.5)",
//           "rgba(75, 192, 192, 0.5)",
//           "rgba(153, 102, 255, 0.5)",
//           "rgba(255, 159, 64, 0.5)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   switch (type) {
//     case "pie":
//       return <Pie data={chartData} />;
//     case "line":
//       return <Line data={chartData} />;
//     case "bar":
//       return <Bar data={chartData} />;
//     case "stackedBar":
//       return <Bar data={chartData} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />;
//     case "scatter":
//       return <Scatter data={{ datasets: [{ label: "Scatter", data: data.map((d) => ({ x: d[xKey], y: d[yKey] })) }] }} />;
//     case "radial":
//       return <Doughnut data={chartData} />;
//     case "gauge":
//       return <Doughnut data={chartData} options={{ circumference: 180, rotation: -90 }} />;
//     default:
//       return null;
//   }
// };

// export default ChartComponent;
