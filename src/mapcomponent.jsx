// MapComponent.jsx
// import { useEffect, useRef } from "react";
// import { Map as OLMap, View } from "ol";
// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import VectorLayer from "ol/layer/Vector";
// import VectorSource from "ol/source/Vector";
// import GeoJSON from "ol/format/GeoJSON";
// import KML from "ol/format/KML";
// import { defaults as defaultControls } from "ol/control";

// const MapComponent = () => {
//   const mapRef = useRef(null);
//   const mapInstance = useRef(null);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     // Initialize map
//     mapInstance.current = new OLMap({
//       target: mapRef.current,
//       layers: [
//         new TileLayer({
//           source: new OSM({
//             attributions:[],
//           }),
//         }),
//       ],
//       view: new View({
//         projection: "EPSG:4326",
//         center: [0,0],
//         zoom: 2,
//       }),
//       controls: defaultControls({ attribution: false }),
//     });

//     setTimeout(() => {
//         mapInstance.current?.updateSize();
//       }, 0);
   
//       return () => {
//         mapInstance.current?.setTarget(null);
//       };
//   }, []);

//   useEffect(() => {
//     const handleResize = () => {
//       mapInstance.current?.updateSize();
//     };
 
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       let vectorLayer;
//       try {
//         if (file.name.endsWith(".geojson") || file.name.endsWith(".json")) {
//           vectorLayer = new VectorLayer({
//             source: new VectorSource({
//               features: new GeoJSON().readFeatures(reader.result, {
//                 dataProjection: "EPSG:4326", // file's projection
//                 featureProjection: "EPSG:4326", // map's projection
//               }),
//             }),
//           });
//         } else if (file.name.endsWith(".kml")) {
//           vectorLayer = new VectorLayer({
//             source: new VectorSource({
//               features: new KML().readFeatures(reader.result, {
//                 dataProjection: "EPSG:4326",
//                 featureProjection: "EPSG:4326",
//               }),
//             }),
//           });
//         } else {
//           alert("File uploaded but unsupported for map display.");
//           return;
//         }

//         mapInstance.current.addLayer(vectorLayer);
//         mapInstance.current.getView().fit(vectorLayer.getSource().getExtent(), { padding: [20, 20, 20, 20] });
//       } catch (err) {
//         console.error("Error loading file:", err);
//       }
//     };
//     reader.readAsText(file);
//   };
//   return (
//     <div style={{ height: "100%", width: "100%" }}>
//     <input type="file" onChange={handleFileUpload} />
//       <div
//         ref={mapRef}
//         style={{ height: "100%", width: "100%", border: "1px solid #ccc" }}
//       />
//     </div>
//   );
// };

// export default MapComponent;
import { useEffect, useRef } from "react";
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import KML from "ol/format/KML";
import { defaults as defaultControls } from "ol/control";

const MapComponent = ({ onDataLoaded }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new OLMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM({ attributions: [] }),
        }),
      ],
      view: new View({
        projection: "EPSG:4326",
        center: [0, 0],
        zoom: 2,
      }),
      controls: defaultControls({ attribution: false }),
    });

    setTimeout(() => mapInstance.current?.updateSize(), 0);

    return () => {
      mapInstance.current?.setTarget(null);
    };
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        let features;
        if (file.name.endsWith(".geojson") || file.name.endsWith(".json")) {
          features = new GeoJSON().readFeatures(reader.result, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:4326",
          });
        } else if (file.name.endsWith(".kml")) {
          features = new KML().readFeatures(reader.result, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:4326",
          });
        } else {
          alert("Unsupported file");
          return;
        }

        const vectorLayer = new VectorLayer({
          source: new VectorSource({ features }),
        });
        mapInstance.current.addLayer(vectorLayer);
        mapInstance.current.getView().fit(vectorLayer.getSource().getExtent(), { padding: [20, 20, 20, 20] });

        const attrData = features.map((f) => f.getProperties());
        const allKeys = Object.keys(attrData[0] || {}).filter((k) => k !== "geometry");

        if (attrData.length > 0) {
            const firstFeatureStats = { ...attrData[0] };
            delete firstFeatureStats.geometry; // remove geometry from stats
            setStats(firstFeatureStats);
          }
          

        onDataLoaded(attrData, allKeys);
      } catch (err) {
        console.error("Error loading file:", err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <div ref={mapRef} style={{ height: "500px", width: "100%", border: "1px solid #ccc" }} />
    </div>
  );
};

export default MapComponent;
