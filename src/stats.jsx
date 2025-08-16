export const calculateStats = (data, xKey) => {
    if (!data.length) return [];
    console.log("data",data);
    // Fixed Stats
    const totalFeatures = data.length;
    const geometryTypes = [...new Set(data.map(f => f.geometry.geometry|| "Unknown"))].join(", ");
  
    // Dynamic Stats (depends on X-axis)
    let uniqueValuesCount = 0;
    let mostFrequentValue = "N/A";
  
    if (xKey) {
      const counts = data.reduce((acc, item) => {
        const val = item[xKey];
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
  
      uniqueValuesCount = Object.keys(counts).length;
  
      const maxEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (maxEntry) {
        mostFrequentValue = `${maxEntry[0]} (${maxEntry[1]})`;
      }
    }
  
    return [
      { title: "Total Features", value: totalFeatures },
      { title: "Geometry Types", value: geometryTypes },
      { title: `Unique ${xKey} Values`, value: uniqueValuesCount },
      { title: `Most Frequent ${xKey}`, value: mostFrequentValue }
    ];
  };
  
  
  