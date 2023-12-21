import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
function BasicLine(props) {
  const { factoryData } = props;
  const [defectRate, setDefectRate] = useState([]);
  useEffect(() => {
    makeLineData();
  }, [factoryData]);

  const data = [
    {
      id: '불량률',
      data: defectRate,
    },
  ];

  const makeLineData = () => {
    const tmpArr = factoryData.map((fd) => {
      const factoryRate = {};
      factoryRate['x'] = fd.name;
      if (fd.failureCount !== 0 && fd.successCount !== 0) {
        factoryRate['y'] = Math.round(
          (fd.failureCount / (fd.successCount + fd.failureCount)) * 100
        );
      } else factoryRate['y'] = 0;
      return factoryRate;
    });
    setDefectRate(tmpArr);
  };

  const divStyle = {
    width: '100%',
    height: '28vh',
    marginBottom: '50px',
  };

  const color = ['#00A5E5', '#BDBDBA'];
  return (
    <div style={divStyle}>
      <h3>공장별 불량률</h3>
      <ResponsiveLine
        data={data}
        margin={{ top: 30, right: 110, bottom: 50, left: 60 }}
        colors={color}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: '0',
          max: 'auto',
          stacked: true,
          reverse: false,
        }}
        yFormat=' >-.2f'
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '공장별 불량률',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '퍼센트(%)',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export default BasicLine;
