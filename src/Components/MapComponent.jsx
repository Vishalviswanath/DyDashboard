import { useEffect, useRef } from "react";
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

const MapComponent = ({ mapInstance }) => {
  const mapRef = useRef(null);
  const localMapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new OLMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM({ attributions: [] }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    localMapInstance.current = map;
    if (mapInstance) mapInstance.current = map;

    return () => {
      map.setTarget(null);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      localMapInstance.current?.updateSize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default MapComponent;