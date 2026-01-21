export const formatChartData = (data) => {
  return data.map((dataPoint) => {
    const date = new Date(dataPoint.date);
    return {
      x: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
      y: dataPoint.priceUsd
    };
  });
};
