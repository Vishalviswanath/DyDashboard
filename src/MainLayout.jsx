// import {
//   AppBar,
//   Button,
//   Grid,
//   Toolbar,
//   Typography,
//   Container,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { useRef, useState, useEffect } from "react";
// import GridLayout from "react-grid-layout";
// import Card from "./Components/CardComponent";
// import "./MainLayout.css";
// import MapComponent from "./Components/MapComponent";
// import Measure from "react-measure";
// import VectorLayer from "ol/layer/Vector";
// import VectorSource from "ol/source/Vector";
// import GeoJSON from "ol/format/GeoJSON";
// import KML from "ol/format/KML";
// import { Chart as GoogleChart } from "react-google-charts";
// import JSZip from "jszip";
// import shp from "shpjs";

// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip as ChartTooltip,
//   Legend as ChartLegend,
// } from "chart.js";
// import { Radar } from "react-chartjs-2";
// import { CardContent } from "@mui/material";
// ChartJS.register(
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   ChartTooltip,
//   ChartLegend
// );

// const RadarChartComponent = ({ dataKey, data }) => {
//   const counts = Object.entries(
//     data.reduce((acc, item) => {
//       const val = item[dataKey] ?? "Unknown";
//       acc[val] = (acc[val] || 0) + 1;
//       return acc;
//     }, {})
//   );

//   const labels = counts.map(([label]) => label);
//   const values = counts.map(([, count]) => count);

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: dataKey,
//         data: values,
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         borderColor: "rgba(54, 162, 235, 1)",
//         borderWidth: 2,
//         pointBackgroundColor: "rgba(54, 162, 235, 1)",
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: { legend: { position: "top" } },
//     scales: {
//       r: {
//         beginAtZero: true,
//         ticks: { stepSize: 1 },
//       },
//     },
//   };

//   return <Radar data={chartData} options={options} />;
// };

// const MainLayout = () => {
//   const [containerWidth, setContainerWidth] = useState(1200);
//   const [fileName, setFileName] = useState("");
//   const [uploadedLayer, setUploadedLayer] = useState(null);
//   const [attrData, setAttrData] = useState(null);
//   const [allKeys, setAllKeys] = useState([]);
//   const [customCharts, setCustomCharts] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [xAxisKey, setXAxisKey] = useState("");
//   const [yAxisKey, setYAxisKey] = useState("");
//   const [chartCards, setChartCards] = useState([]);
//   const [layout, setLayout] = useState([]);
//   const mapInstance = useRef(null);

//   const customChartRules = {
//     objectid: "none",
//     shape_leng: "BarChart",
//     object_id: "none",
//     NAME: "none",
//     LAYER: "none",
//     KML_STYLE: "BarChart",
//     PlotStatus: "PieChart",
//     CustomerNa: "none",
//     PlotFacing: "BarChart",
//     Plot_Area: "LineChart",
//     PlotMeasur: "none",
//     Plot_no: "none",
//     Class: "none",
//     Name: "none",
//     Occupancy: "none",
//     Density: "combo_density_height",
//     Height: "none",
//     District: "none",
//     State: "none",
//     Area: "LineChart",
//     Cluter_ID: "none",
//     City: "none",
//     WARD_NO: "none",
//     WARD: "LineChart",
//     SHAPE_Area: "LineChart",
//     ZONE_NO: "LineChart",
//     ZONE: "LineChart",
//     styleUrl: "none",
//     Id: "none",
//   };

//   // Stats container component
//   const StatsContainer = ({ stats }) => {
//     if (!stats || Object.keys(stats).length === 0) return null;

//     return (
//       <Card sx={{ padding: 2, backgroundColor: "#f5f5f5", marginBottom: 2 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Statistics
//           </Typography>
//           <Grid container spacing={2}>
//             {Object.entries(stats).map(([key, value]) => (
//               <Grid item xs={6} sm={4} md={3} key={key}>
//                 <Card
//                   sx={{
//                     backgroundColor: "white",
//                     boxShadow: 2,
//                     borderRadius: 2,
//                     textAlign: "center",
//                     padding: 1,
//                   }}
//                 >
//                   <CardContent sx={{ padding: "8px" }}>
//                     <Typography variant="subtitle2" color="text.secondary">
//                       {key}
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold">
//                       {value || "—"}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </CardContent>
//       </Card>
//     );
//   };
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setFileName(file.name);

//     try {
//       let features = [];

//       // --- GEOJSON / JSON ---
//       if (file.name.endsWith(".geojson") || file.name.endsWith(".json")) {
//         const text = await file.text();
//         features = new GeoJSON().readFeatures(text, {
//           dataProjection: "EPSG:4326",
//           featureProjection: "EPSG:3857",
//         });

//         // --- KML ---
//       } else if (file.name.endsWith(".kml")) {
//         const text = await file.text();
//         features = new KML().readFeatures(text, {
//           dataProjection: "EPSG:4326",
//           featureProjection: "EPSG:3857",
//         });

//         // --- KMZ (KML inside ZIP) ---
//       } else if (file.name.endsWith(".kmz")) {
//         const zip = await JSZip.loadAsync(file);
//         const kmlFile = Object.keys(zip.files).find((name) =>
//           name.toLowerCase().endsWith(".kml")
//         );
//         if (!kmlFile) throw new Error("No KML found in KMZ.");
//         const kmlText = await zip.files[kmlFile].async("text");
//         features = new KML().readFeatures(kmlText, {
//           dataProjection: "EPSG:4326",
//           featureProjection: "EPSG:3857",
//         });

//         // --- ZIP (Shapefile) ---
//       } else if (file.name.endsWith(".zip")) {
//         const arrayBuffer = await file.arrayBuffer();
//         const geojson = await shp(arrayBuffer); // shpjs returns GeoJSON
//         features = new GeoJSON().readFeatures(geojson, {
//           dataProjection: "EPSG:4326",
//           featureProjection: "EPSG:3857",
//         });
//       } else {
//         alert(
//           "Unsupported file type. Please upload GeoJSON, JSON, KML, KMZ, or Shapefile ZIP."
//         );
//         return;
//       }

//       // --- Add layer to map ---
//       const vectorLayer = new VectorLayer({
//         source: new VectorSource({ features }),
//       });

//       if (uploadedLayer && mapInstance.current) {
//         mapInstance.current.removeLayer(uploadedLayer);
//       }

//       if (mapInstance.current) {
//         mapInstance.current.addLayer(vectorLayer);
//         mapInstance.current.getView().fit(vectorLayer.getSource().getExtent(), {
//           padding: [20, 20, 20, 20],
//         });
//       }

//       setUploadedLayer(vectorLayer);

//       // --- Extract attributes ---
//       const attrData = features.map((f) => f.getProperties());
//       const allKeys = Object.keys(attrData[0] || {}).filter(
//         (k) => k !== "geometry"
//       );

//       setAttrData(attrData);
//       setAllKeys(allKeys);
//     } catch (err) {
//       console.error("Error loading file:", err);
//       alert("Error loading file: " + err.message);
//     }
//   };

//   const isNumericalKey = (key) => {
//     if (!attrData) return false;
//     const values = attrData.map((item) => item[key]).filter((v) => v != null);
//     return values.length > 0 && values.every((v) => !isNaN(parseFloat(v)));
//   };

//   const getUniqueCount = (key) => {
//     if (!attrData) return 0;
//     const unique = new Set(
//       attrData.map((item) => item[key]).filter((v) => v != null)
//     );
//     return unique.size;
//   };

//   const chartTypes = [
//     "PieChart",
//     "BarChart",
//     "ColumnChart",
//     "LineChart",
//     "AreaChart",
//     "ScatterChart",
//     "Histogram",
//     "ComboChart",
//     "Table",
//     "TreeMap",
//     "CandlestickChart",
//     "SteppedAreaChart",
//     "BubbleChart",
//     "RadarChart",
//   ];

//   const getNextChartType = (key, isNumerical, uniqueCount) => {
//     let candidates = [...chartTypes];
//     if (isNumerical) {
//       candidates = [
//         "Histogram",
//         "LineChart",
//         "AreaChart",
//         "ScatterChart",
//         "CandlestickChart",
//         "SteppedAreaChart",
//         "BubbleChart",
//       ];
//     } else {
//       candidates = [
//         "PieChart",
//         "BarChart",
//         "ColumnChart",
//         "RadarChart",
//         "ComboChart",
//         "Table",
//         "TreeMap",
//       ];
//       if (uniqueCount > 10) {
//         candidates = candidates.filter((type) => type !== "PieChart");
//       }
//     }
//     return candidates[0];
//   };

//   const getChartConfig = (key) => {
//     if (!attrData || !key) return null;
//     const values = attrData.map((item) => item[key]).filter((v) => v != null);
//     if (values.length === 0) return null;

//     const ruleType = customChartRules[key];
//     if (ruleType && ruleType.toLowerCase() === "none") return null;

//     const isNumerical = isNumericalKey(key);
//     const uniqueCount = getUniqueCount(key);
//     if (!isNumerical && uniqueCount > 50) return null;

//     let chartType;
//     if (ruleType && chartTypes.includes(ruleType)) {
//       chartType = ruleType;
//     } else {
//       chartType = getNextChartType(key, isNumerical, uniqueCount);
//     }

//     if (chartType === "RadarChart") {
//       return {
//         chartType,
//         customRenderer: <RadarChartComponent dataKey={key} data={attrData} />,
//       };
//     }

//     let data = [];
//     let options = {
//       title: `Chart for ${key} (${chartType})`,
//       legend: { position: "top" },
//       backgroundColor: "transparent",
//     };

//     if (isNumerical) {
//       if (chartType === "Histogram") {
//         data = [["Value"]];
//         values.forEach((v) => data.push([parseFloat(v)]));
//       } else {
//         data = [["Index", "Value"]];
//         values.forEach((v, i) => data.push([i, parseFloat(v)]));
//       }
//     } else {
//       const counts = values.reduce((acc, v) => {
//         const val = v || "Unknown";
//         acc[val] = (acc[val] || 0) + 1;
//         return acc;
//       }, {});
//       data = [["Category", "Count"]];
//       Object.entries(counts).forEach(([cat, count]) => data.push([cat, count]));
//     }

//     return { chartType, data, options };
//   };

//   const generateLayoutAndCards = () => {
//     const layoutArr = [];
//     const cardsArr = [];
//     const chartList = [];

//     // ✅ Stats object
//     let statsObj = {};
//     if (attrData && attrData.length > 0) {
//       statsObj = {
//         "Total Features": attrData.length,
//         ...allKeys.reduce((acc, key) => {
//           const values = attrData
//             .map((item) => item[key])
//             .filter((v) => v != null);
//           if (isNumericalKey(key)) {
//             const nums = values
//               .map((v) => parseFloat(v))
//               .filter((v) => !isNaN(v));
//             acc[`Avg ${key}`] = (
//               nums.reduce((a, b) => a + b, 0) / nums.length
//             ).toFixed(2);
//             acc[`Min ${key}`] = Math.min(...nums);
//             acc[`Max ${key}`] = Math.max(...nums);
//           } else {
//             acc[`Unique ${key}`] = new Set(values).size;
//           }
//           return acc;
//         }, {}),
//       };
//     }

//     // ✅ Stats Card
//     const statColors = [
//       "#FFCDD2",
//       "#C8E6C9",
//       "#BBDEFB",
//       "#FFE0B2",
//       "#D1C4E9",
//       "#FFF9C4",
//       "#B2EBF2",
//     ];
//     if (Object.keys(statsObj).length) {
//       layoutArr.push({ i: "stats", x: 0, y: 0, w: 4, h: 4 });
//       cardsArr.push(
//         <div key="stats">
//           <Card sx={{ padding: 2, boxShadow: 0 }}>
//             <Grid container spacing={2}>
//               {Object.entries(statsObj).map(([label, value], index) => (
//                 <Grid key={label}>
//                   <Card
//                     sx={{
//                       backgroundColor: statColors[index % statColors.length],
//                       boxShadow: 2,
//                       borderRadius: 2,
//                       textAlign: "center",
//                       padding: 1,
//                     }}
//                   >
//                     <CardContent sx={{ padding: "8px" }}>
//                       <Typography
//                         variant="subtitle2"
//                         color="text.secondary"
//                         fontWeight="bold"
//                       >
//                         {label}
//                       </Typography>
//                       <Typography variant="h6" fontWeight="bold">
//                         {value}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Card>
//         </div>
//       );
//     }

//     // ✅ Map in the middle
//     layoutArr.push({ i: "map", x: 4, y: 0, w: 4, h: 8, static: true });
//     cardsArr.push(
//       <div key="map">
//         <MapComponent uploadedLayer={uploadedLayer} mapInstance={mapInstance} />
//       </div>
//     );

//     // ✅ Auto-generated charts
//     if (allKeys && attrData) {
//       for (let key of allKeys) {
//         const config = getChartConfig(key);
//         if (config) {
//           const cardKey = `chart-${key}`;
//           const chartCard = (
//             <div key={cardKey}>
//               <Card style={{ position: "relative", zIndex: 9999 }}>
//                 <Button
//                   onClick={() => handleDeleteCard(cardKey)}
//                   size="small"
//                   style={{
//                     position: "absolute",
//                     top: 5,
//                     right: 5,
//                     zIndex: 9999,
//                   }}
//                 >
//                   ❌
//                 </Button>
//                 {config.customRenderer ? (
//                   config.customRenderer
//                 ) : (
//                   <GoogleChart
//                     chartType={config.chartType}
//                     data={config.data}
//                     options={config.options}
//                     width="100%"
//                     height="100%"
//                   />
//                 )}
//               </Card>
//             </div>
//           );
//           chartList.push({ key: cardKey, component: chartCard });
//         }
//       }
//     }

//     // ✅ Add custom charts
//     customCharts.forEach((chart, idx) => {
//       const cardKey = `custom-${idx}`;
//       const data = [["X", "Y"]];
//       attrData.forEach((item) => {
//         data.push([
//           chart.xIsNum ? parseFloat(item[chart.xAxis]) : item[chart.xAxis],
//           chart.yIsNum ? parseFloat(item[chart.yAxis]) : item[chart.yAxis],
//         ]);
//       });

//       const chartCard = (
//         <div key={cardKey}>
//           <Card style={{ position: "relative", zIndex: 9999 }}>
//             <Button
//               onClick={() => handleDeleteCard(cardKey)}
//               size="small"
//               style={{
//                 position: "absolute",
//                 top: 5,
//                 right: 5,
//                 zIndex: 9999,
//               }}
//             >
//               ❌
//             </Button>
//             <GoogleChart
//               chartType="ScatterChart"
//               data={data}
//               options={{
//                 title: `${chart.xAxis} vs ${chart.yAxis}`,
//                 hAxis: { title: chart.xAxis },
//                 vAxis: { title: chart.yAxis },
//                 backgroundColor: "transparent",
//               }}
//               width="100%"
//               height="100%"
//             />
//           </Card>
//         </div>
//       );

//       chartList.push({ key: cardKey, component: chartCard });
//     });

//     // ✅ Position charts alternately
//     let leftY = 4,
//       rightY = 0;
//     chartList.forEach((chart, idx) => {
//       if (idx % 2 === 0) {
//         layoutArr.push({ i: chart.key, x: 0, y: leftY, w: 4, h: 4 });
//         leftY += 4;
//       } else {
//         layoutArr.push({ i: chart.key, x: 8, y: rightY, w: 4, h: 4 });
//         rightY += 4;
//       }
//       cardsArr.push(chart.component);
//     });

//     setLayout(layoutArr);
//     setChartCards(cardsArr);
//   };

//   useEffect(() => {
//     generateLayoutAndCards();
//   }, [attrData, customCharts]);

//   const handleDeleteCard = (cardKey) => {
//     setLayout((prev) => prev.filter((item) => item.i !== cardKey));

//     setCustomCharts((prev) =>
//       prev.filter((_, idx) => `custom-${idx}` !== cardKey)
//     );

//     // Remove from auto-generated charts
//     setAllKeys((prev) => prev.filter((key) => `chart-${key}` !== cardKey));
//   };

//   const handleAddCustomChart = () => {
//     if (!xAxisKey || !yAxisKey) {
//       alert("Please select both X and Y axis.");
//       return;
//     }
//     if (xAxisKey === yAxisKey) {
//       alert("X and Y axis cannot be the same.");
//       return;
//     }

//     const xIsNum = isNumericalKey(xAxisKey);
//     const yIsNum = isNumericalKey(yAxisKey);

//     setCustomCharts((prev) => [
//       ...prev,
//       { xAxis: xAxisKey, yAxis: yAxisKey, xIsNum, yIsNum },
//     ]);

//     setOpenDialog(false);
//     setXAxisKey("");
//     setYAxisKey("");
//   };

//   return (
//     <>
//       <AppBar
//         variant="outlined"
//         position="static"
//         sx={{ backgroundColor: "black", color: "white" }}
//       >
//         <Toolbar>
//           <Grid
//             container
//             columns={12}
//             alignItems={"center"}
//             sx={{ width: "100%", maxWidth: "1440px", margin: "0 auto" }}
//           >
//             {" "}
//             <Grid size={6}>
//               {" "}
//               <Typography>DyDashboard</Typography>{" "}
//             </Grid>{" "}
//             <Grid size={6} textAlign="right" flexDirection={"row"}>
//               <Button
//                 variant="contained"
//                 component="label"
//                 onChange={handleFileUpload}
//                 size="small"
//               >
//                 {fileName === "" ? "Upload File" : fileName}
//                 <input type="file" hidden />
//               </Button>
//               <Button
//                 sx={{ ml: 1 }}
//                 variant="outlined"
//                 size="small"
//                 disabled={!allKeys.length}
//                 onClick={() => setOpenDialog(true)}
//               >
//                 Add Custom Axis Chart
//               </Button>
//             </Grid>
//           </Grid>
//         </Toolbar>
//       </AppBar>
//       <Container
//         maxWidth="xl"
//         disableGutters
//         style={{ maxWidth: "1440px", margin: "0 auto" }}
//       >
//         <Measure
//           bounds
//           onResize={(contentRect) => {
//             if (contentRect.bounds?.width)
//               setContainerWidth(contentRect.bounds.width);
//           }}
//         >
//           {({ measureRef }) => (
//             <div ref={measureRef}>
//               <GridLayout
//                 className="layout"
//                 layout={layout}
//                 cols={12}
//                 rowHeight={50}
//                 width={containerWidth}
//                 isResizable
//                 resizeHandles={["se"]}
//               >
//                 {chartCards}
//               </GridLayout>
//             </div>
//           )}
//         </Measure>
//       </Container>

//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Select X and Y Axis</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth sx={{ mt: 2 }}>
//             <InputLabel>X Axis</InputLabel>
//             <Select
//               value={xAxisKey}
//               onChange={(e) => setXAxisKey(e.target.value)}
//             >
//               {allKeys.map((key) => (
//                 <MenuItem key={key} value={key}>
//                   {key}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth sx={{ mt: 2 }}>
//             <InputLabel>Y Axis</InputLabel>
//             <Select
//               value={yAxisKey}
//               onChange={(e) => setYAxisKey(e.target.value)}
//             >
//               {allKeys.map((key) => (
//                 <MenuItem key={key} value={key}>
//                   {key}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth sx={{ mt: 2 }}>
//             <InputLabel>Chart Type</InputLabel>
//             <Select
//               value={customChartType}
//               onChange={(e) => setCustomChartType(e.target.value)}
//             >
//               {chartTypes.map((type) => (
//                 <MenuItem key={type} value={type}>
//                   {type}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleAddCustomChart}
//             disabled={!xAxisKey || !yAxisKey || xAxisKey === yAxisKey}
//           >
//             Add Chart
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default MainLayout;
import {
  AppBar,
  Button,
  Grid,
  Toolbar,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useRef, useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import Card from "./Components/CardComponent";
import "./MainLayout.css";
import MapComponent from "./Components/MapComponent";
import Measure from "react-measure";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import KML from "ol/format/KML";
import { Chart as GoogleChart } from "react-google-charts";
import JSZip from "jszip";
import shp from "shpjs";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { CardContent } from "@mui/material";
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  ChartLegend
);

const RadarChartComponent = ({ dataKey, data }) => {
  const counts = Object.entries(
    data.reduce((acc, item) => {
      const val = item[dataKey] ?? "Unknown";
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {})
  );

  const labels = counts.map(([label]) => label);
  const values = counts.map(([, count]) => count);

  const chartData = {
    labels,
    datasets: [
      {
        label: dataKey,
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: {
      r: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return <Radar data={chartData} options={options} />;
};

const MainLayout = () => {
  const [containerWidth, setContainerWidth] = useState(1200);
  const [fileName, setFileName] = useState("");
  const [uploadedLayer, setUploadedLayer] = useState(null);
  const [attrData, setAttrData] = useState(null);
  const [allKeys, setAllKeys] = useState([]);
  const [customCharts, setCustomCharts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [xAxisKey, setXAxisKey] = useState("");
  const [yAxisKey, setYAxisKey] = useState("");
  const [customChartType, setCustomChartType] = useState("");
  const [chartCards, setChartCards] = useState([]);
  const [layout, setLayout] = useState([]);
  const mapInstance = useRef(null);
  const [stats, setStats] = useState({});
  const [hiddenCards, setHiddenCards] = useState([]);

  const [extraCards, setExtraCards] = useState([]);



  const customChartRules = {
    objectid: "none",
    shape_leng: "BarChart",
    object_id: "none",
    NAME: "none",
    LAYER: "none",
    KML_STYLE: "BarChart",
    PlotStatus: "PieChart",
    CustomerNa: "none",
    PlotFacing: "BarChart",
    Plot_Area: "LineChart",
    PlotMeasur: "none",
    Plot_no: "none",
    Class: "none",
    Name: "none",
    Occupancy: "none",
    Density: "combo_density_height",
    Height: "none",
    District: "none",
    State: "none",
    Area: "LineChart",
    Cluter_ID: "none",
    City: "none",
    WARD_NO: "none",
    WARD: "LineChart",
    SHAPE_Area: "LineChart",
    ZONE_NO: "LineChart",
    ZONE: "LineChart",
    styleUrl: "none",
    Id: "none",
  };

  // Stats container component
  const StatsContainer = ({ stats }) => {
    if (!stats || Object.keys(stats).length === 0) return null;

    return (
      <Card sx={{ padding: 2, backgroundColor: "#f5f5f5", marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Statistics
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(stats).map(([key, value]) => (
              <Grid item xs={6} sm={4} md={3} key={key}>
                <Card
                  sx={{
                    backgroundColor: "white",
                    boxShadow: 2,
                    borderRadius: 2,
                    textAlign: "center",
                    padding: 1,
                  }}
                >
                  <CardContent sx={{ padding: "8px" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {key}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {value || "—"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };
const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    try {
      let features = [];

      // --- GEOJSON / JSON ---
      if (file.name.endsWith(".geojson") || file.name.endsWith(".json")) {
        const text = await file.text();
        features = new GeoJSON().readFeatures(text, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });

        // --- KML ---
      } else if (file.name.endsWith(".kml")) {
        const text = await file.text();
        features = new KML().readFeatures(text, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });

        // --- KMZ (KML inside ZIP) ---
      } else if (file.name.endsWith(".kmz")) {
        const zip = await JSZip.loadAsync(file);
        const kmlFile = Object.keys(zip.files).find((name) =>
          name.toLowerCase().endsWith(".kml")
        );
        if (!kmlFile) throw new Error("No KML found in KMZ.");
        const kmlText = await zip.files[kmlFile].async("text");
        features = new KML().readFeatures(kmlText, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });

        // --- ZIP (Shapefile) ---
      } else if (file.name.endsWith(".zip")) {
        const arrayBuffer = await file.arrayBuffer();
        const geojson = await shp(arrayBuffer); // shpjs returns GeoJSON
        features = new GeoJSON().readFeatures(geojson, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
      } else {
        alert(
          "Unsupported file type. Please upload GeoJSON, JSON, KML, KMZ, or Shapefile ZIP."
        );
        return;
      }

      // --- Add layer to map ---
      const vectorLayer = new VectorLayer({
        source: new VectorSource({ features }),
      });

      if (uploadedLayer && mapInstance.current) {
        mapInstance.current.removeLayer(uploadedLayer);
      }

      if (mapInstance.current) {
        mapInstance.current.addLayer(vectorLayer);
        mapInstance.current.getView().fit(vectorLayer.getSource().getExtent(), {
          padding: [20, 20, 20, 20],
        });
      }

      setUploadedLayer(vectorLayer);

      // --- Extract attributes ---
      const attrData = features.map((f) => f.getProperties());
      const allKeys = Object.keys(attrData[0] || {}).filter(
        (k) => k !== "geometry"
      );

      setAttrData(attrData);
      setAllKeys(allKeys);
    } catch (err) {
      console.error("Error loading file:", err);
      alert("Error loading file: " + err.message);
    }
  };




  const isNumericalKey = (key) => {
    if (!attrData) return false;
    const values = attrData.map((item) => item[key]).filter((v) => v != null);
    return values.length > 0 && values.every((v) => !isNaN(parseFloat(v)));
  };

  const getUniqueCount = (key) => {
    if (!attrData) return 0;
    const unique = new Set(
      attrData.map((item) => item[key]).filter((v) => v != null)
    );
    return unique.size;
  };

  const chartTypes = [
    "PieChart",
    "BarChart",
    "ColumnChart",
    "LineChart",
    "AreaChart",
    "ScatterChart",
    "Histogram",
    "ComboChart",
    "Table",
    "TreeMap",
    "CandlestickChart",
    "SteppedAreaChart",
    "BubbleChart",
    "RadarChart",
  ];

  const getNextChartType = (key, isNumerical, uniqueCount) => {
    let candidates = [...chartTypes];
    if (isNumerical) {
      candidates = [
        "Histogram",
        "LineChart",
        "AreaChart",
        "ScatterChart",
        "CandlestickChart",
        "SteppedAreaChart",
        "BubbleChart",
      ];
    } else {
      candidates = [
        "PieChart",
        "BarChart",
        "ColumnChart",
        "RadarChart",
        "ComboChart",
        "Table",
        "TreeMap",
      ];
      if (uniqueCount > 10) {
        candidates = candidates.filter((type) => type !== "PieChart");
      }
    }
    return candidates[0];
  };

  const getChartConfig = (key) => {
    if (!attrData || !key) return null;
    const values = attrData.map((item) => item[key]).filter((v) => v != null);
    if (values.length === 0) return null;

    const ruleType = customChartRules[key];
    if (ruleType && ruleType.toLowerCase() === "none") return null;

    const isNumerical = isNumericalKey(key);
    const uniqueCount = getUniqueCount(key);

    if (uniqueCount <= 1) return null;

    if (isNumerical) {
      const nums = values.map((v) => parseFloat(v));
      if (Math.min(...nums) === Math.max(...nums)) return null;
    }

    if (!isNumerical && uniqueCount > 50) return null;

    let chartType;
    if (ruleType && chartTypes.includes(ruleType)) {
      chartType = ruleType;
    } else {
      chartType = getNextChartType(key, isNumerical, uniqueCount);
    }

    if (chartType === "RadarChart") {
      return {
        chartType,
        customRenderer: <RadarChartComponent dataKey={key} data={attrData} />,
      };
    }

    let data = [];
    let options = {
      title: `Chart for ${key} (${chartType})`,
      legend: { position: "top" },
      backgroundColor: "transparent",
    };

    if (isNumerical) {
      if (chartType === "Histogram") {
        data = [["Value"]];
        values.forEach((v) => data.push([parseFloat(v)]));
      } else {
        data = [["Index", "Value"]];
        values.forEach((v, i) => data.push([i, parseFloat(v)]));
      }
    } else {
      const counts = values.reduce((acc, v) => {
        const val = v || "Unknown";
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      data = [["Category", "Count"]];
      Object.entries(counts).forEach(([cat, count]) => data.push([cat, count]));
    }

    return { chartType, data, options };
  };

const generateLayoutAndCards = () => {
  const layoutArr = [];
  const cardsArr = [];
  const chartList = [];

  // ✅ Stats object
  let statsObj = {};
  if (attrData && attrData.length > 0) {
    statsObj = {
      "Total Features": attrData.length,
      ...allKeys.reduce((acc, key) => {
        const values = attrData
          .map((item) => item[key])
          .filter((v) => v != null);
        if (isNumericalKey(key)) {
          const nums = values
            .map((v) => parseFloat(v))
            .filter((v) => !isNaN(v));
          acc[`Avg ${key}`] = (
            nums.reduce((a, b) => a + b, 0) / nums.length
          ).toFixed(2);
          acc[`Min ${key}`] = Math.min(...nums);
          acc[`Max ${key}`] = Math.max(...nums);
        } else {
          acc[`Unique ${key}`] = new Set(values).size;
        }
        return acc;
      }, {}),
    };
  }

  // ✅ Stats Card
  const statColors = [
    "#FFCDD2", "#C8E6C9", "#BBDEFB", "#FFE0B2",
    "#D1C4E9", "#FFF9C4", "#B2EBF2",
  ];
  if (Object.keys(statsObj).length) {
    layoutArr.push({ i: "stats", x: 0, y: 0, w: 4, h: 4 });
    cardsArr.push(
      <div key="stats">
        <Card sx={{ padding: 2, boxShadow: 0 }}>
          <Grid container spacing={2}>
            {Object.entries(statsObj).map(([label, value], index) => (
              <Grid key={label}>
                <Card
                  sx={{
                    backgroundColor: statColors[index % statColors.length],
                    boxShadow: 2,
                    borderRadius: 2,
                    textAlign: "center",
                    padding: 1,
                  }}
                >
                  <CardContent sx={{ padding: "8px" }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      {label}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      </div>
    );
  }

  // ✅ Map in the middle
  layoutArr.push({ i: "map", x: 4, y: 0, w: 4, h: 8, static: true });
  cardsArr.push(
    <div key="map">
      <MapComponent uploadedLayer={uploadedLayer} mapInstance={mapInstance} />
    </div>
  );

  // ✅ Auto-generated charts
  if (allKeys && attrData) {
    for (let key of allKeys) {
      const config = getChartConfig(key);
      if (config) {
        const cardKey = `chart-${key}`;
        const chartCard = (
          <div key={cardKey}>
            <Card style={{ position: "relative", zIndex: 9999 }}>
              <Button
                onClick={() => handleDeleteCard(cardKey)}
                size="small"
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  zIndex: 9999,
                }}
              >
                ❌
              </Button>
              {config.customRenderer ? (
                config.customRenderer
              ) : (
                <GoogleChart
                  chartType={config.chartType}
                  data={config.data}
                  options={config.options}
                  width="100%"
                  height="100%"
                />
              )}
            </Card>
          </div>
        );
        chartList.push({ key: cardKey, component: chartCard });
      }
    }
  }

  // ✅ Add custom charts
  customCharts.forEach((chart, idx) => {
    const cardKey = `custom-${idx}`;
    const { xAxis, yAxis, chartType, xIsNum, yIsNum } = chart;

    let chartData = [];
    let options = {
      title: `${xAxis} vs ${yAxis} (${chartType})`,
      backgroundColor: "transparent",
      legend: { position: "top" },
    };

    if (xIsNum && yIsNum) {
      chartData = [[xAxis, yAxis]];
      attrData.forEach((item) => {
        const x = parseFloat(item[xAxis]);
        const y = parseFloat(item[yAxis]);
        if (!isNaN(x) && !isNaN(y)) {
          chartData.push([x, y]);
        }
      });
      if (chartType === "LineChart" || chartType === "AreaChart") {
        chartData = [chartData[0], ...chartData.slice(1).sort((a, b) => a[0] - b[0])];
      }
      options.hAxis = { title: xAxis };
      options.vAxis = { title: yAxis };
    } else if (!xIsNum && yIsNum) {
      const agg = attrData.reduce((acc, item) => {
        const key = item[xAxis] ?? "Unknown";
        const val = parseFloat(item[yAxis]);
        if (!isNaN(val)) {
          acc[key] = acc[key] || { sum: 0, count: 0 };
          acc[key].sum += val;
          acc[key].count++;
        }
        return acc;
      }, {});
      chartData = [[xAxis, `Average ${yAxis}`]];
      for (let [key, val] of Object.entries(agg)) {
        chartData.push([key, val.sum / val.count]);
      }
      options.hAxis = { title: xAxis };
      options.vAxis = { title: `Avg ${yAxis}` };
    } else if (xIsNum && !yIsNum) {
      const agg = attrData.reduce((acc, item) => {
        const key = item[yAxis] ?? "Unknown";
        const val = parseFloat(item[xAxis]);
        if (!isNaN(val)) {
          acc[key] = acc[key] || { sum: 0, count: 0 };
          acc[key].sum += val;
          acc[key].count++;
        }
        return acc;
      }, {});
      chartData = [[yAxis, `Average ${xAxis}`]];
      for (let [key, val] of Object.entries(agg)) {
        chartData.push([key, val.sum / val.count]);
      }
      options.hAxis = { title: yAxis };
      options.vAxis = { title: `Avg ${xAxis}` };
    } else {
      // both categorical
      const yCats = [...new Set(attrData.map((item) => item[yAxis] ?? "Unknown"))].sort();
      const agg = attrData.reduce((acc, item) => {
        const xkey = item[xAxis] ?? "Unknown";
        const ykey = item[yAxis] ?? "Unknown";
        if (!acc[xkey]) acc[xkey] = {};
        acc[xkey][ykey] = (acc[xkey][ykey] || 0) + 1;
        return acc;
      }, {});
      chartData = [[xAxis, ...yCats]];
      for (let [xkey, ycounts] of Object.entries(agg)) {
        const row = [xkey, ...yCats.map((ycat) => ycounts[ycat] || 0)];
        chartData.push(row);
      }
      options.hAxis = { title: xAxis };
      options.vAxis = { title: "Count" };
      options.isStacked = true;
    }

    const chartCard = (
      <div key={cardKey}>
        <Card style={{ position: "relative", zIndex: 9999 }}>
          <Button
            onClick={() => handleDeleteCard(cardKey)}
            size="small"
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              zIndex: 9999,
            }}
          >
            ❌
          </Button>
          <GoogleChart
            chartType={chartType}
            data={chartData}
            options={options}
            width="100%"
            height="100%"
          />
        </Card>
      </div>
    );

    chartList.push({ key: cardKey, component: chartCard });
  });

  // ✅ Position charts alternately
  let leftY = 4, rightY = 0;
  chartList.forEach((chart, idx) => {
    if (idx % 2 === 0) {
      layoutArr.push({ i: chart.key, x: 0, y: leftY, w: 4, h: 4 });
      leftY += 4;
    } else {
      layoutArr.push({ i: chart.key, x: 8, y: rightY, w: 4, h: 4 });
      rightY += 4;
    }
    cardsArr.push(chart.component);
  });

  setLayout(layoutArr);
  setChartCards(cardsArr);
};


  useEffect(() => {
    generateLayoutAndCards();
  }, [attrData, customCharts]);

  const handleDeleteCard = (cardKey) => {
    setLayout((prev) => prev.filter((item) => item.i !== cardKey));

    setCustomCharts((prev) =>
      prev.filter((_, idx) => `custom-${idx}` !== cardKey)
    );

    // Remove from auto-generated charts
    setAllKeys((prev) => prev.filter((key) => `chart-${key}` !== cardKey));
  };

  const handleAddCustomChart = () => {
    if (!xAxisKey || !yAxisKey || !customChartType) {
      alert("Please select X axis, Y axis, and chart type.");
      return;
    }
    if (xAxisKey === yAxisKey) {
      alert("X and Y axis cannot be the same.");
      return;
    }

    const xIsNum = isNumericalKey(xAxisKey);
    const yIsNum = isNumericalKey(yAxisKey);

    setCustomCharts((prev) => [
      ...prev,
      { xAxis: xAxisKey, yAxis: yAxisKey, chartType: customChartType, xIsNum, yIsNum },
    ]);

    setOpenDialog(false);
    setXAxisKey("");
    setYAxisKey("");
    setCustomChartType("");
  };

  return (
    <>
      <AppBar
        variant="outlined"
        position="static"
        sx={{ backgroundColor: "black", color: "white" }}
      >
        <Toolbar>
          <Grid
            container
            columns={12}
            alignItems={"center"}
            sx={{ width: "100%", maxWidth: "1440px", margin: "0 auto" }}
          >
            {" "}
            <Grid size={6}>
              {" "}
              <Typography>DyDashboard</Typography>{" "}
            </Grid>{" "}
            <Grid size={6} textAlign="right" flexDirection={"row"}>
              <Button
                variant="contained"
                component="label"
                onChange={handleFileUpload}
                size="small"
              >
                {fileName === "" ? "Upload File" : fileName}
                <input type="file" hidden />
              </Button>
              <Button
                sx={{ ml: 1 }}
                variant="outlined"
                size="small"
                disabled={!allKeys.length}
                onClick={() => setOpenDialog(true)}
              >
                Add Custom Axis Chart
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="xl"
        disableGutters
        style={{ maxWidth: "1440px", margin: "0 auto" }}
      >
        <Measure
          bounds
          onResize={(contentRect) => {
            if (contentRect.bounds?.width)
              setContainerWidth(contentRect.bounds.width);
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef}>
              <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={50}
                width={containerWidth}
                isResizable
                resizeHandles={["se"]}
              >
                {chartCards}
              </GridLayout>
            </div>
          )}
        </Measure>
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Select X and Y Axis</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>X Axis</InputLabel>
            <Select
              value={xAxisKey}
              onChange={(e) => setXAxisKey(e.target.value)}
            >
              {allKeys.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Y Axis</InputLabel>
            <Select
              value={yAxisKey}
              onChange={(e) => setYAxisKey(e.target.value)}
            >
              {allKeys.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={customChartType}
              onChange={(e) => setCustomChartType(e.target.value)}
            >
              {chartTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddCustomChart}
            disabled={!xAxisKey || !yAxisKey || xAxisKey === yAxisKey || !customChartType}
          >
            Add Chart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MainLayout;