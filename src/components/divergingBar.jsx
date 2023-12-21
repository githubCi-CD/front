import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { ResponsiveBar } from '@nivo/bar';
function DivergingBar(props) {
  const [data, setData] = useState([]);
  let prevTime = new Date().toISOString();

  useEffect(() => {
    let dateCur = new Date();
    let cur = dateCur.toISOString();
    let datePrev = new Date(dateCur);
    datePrev.setMinutes(dateCur.getMinutes() - 3);
    // prev를 ISO 문자열로 변환
    let prev = datePrev.toISOString();
    for (let i = 0; i < 4; i++) {
      getBaseESData(prev, cur, dateCur);
      dateCur = datePrev;
      cur = prev;

      datePrev = new Date(dateCur);
      datePrev.setMinutes(dateCur.getMinutes() - 3);
      prev = datePrev.toISOString();
    }
  }, []);

  useEffect(() => {
    const totalData = setInterval(() => {
      const curTime = new Date().toISOString();
      getElasticSearchData(curTime);
    }, 180000);
    return () => clearInterval(totalData);
  }, []);

  const getBaseESData = async (prev, cur, dateCur) => {
    const url = process.env.REACT_APP_ELASTICSEARCH_API_URL;
    const successQuery = {
      track_total_hits: true,
      size: 10000,
      from: 0,
      query: {
        bool: {
          must: [
            {
              match: {
                logType: 'PRODUCT_TEST_SUCCESS',
              },
            },
            {
              range: {
                '@timestamp': {
                  gte: prev, // 시작 시간
                  lte: cur, // 종료 시간
                },
              },
            },
          ],
        },
      },
    };

    const failQuery = {
      track_total_hits: true,
      size: 10000,
      from: 0,
      query: {
        bool: {
          must: [
            {
              match: {
                logType: 'PRODUCT_TEST_FAIL',
              },
            },
            {
              range: {
                '@timestamp': {
                  gte: prev, // 시작 시간
                  lte: cur, // 종료 시간
                },
              },
            },
          ],
        },
      },
    };

    try {
      const [successRes, failRes] = await Promise.all([
        axios.post(url, successQuery),
        axios.post(url, failQuery),
      ]);

      const successHitsLength = successRes.data.hits.hits.length;
      const failHitsLength = failRes.data.hits.hits.length;

      const tmp = {
        success: successHitsLength,
        fail: failHitsLength,
      };

      makeDataArr(tmp, dateCur);
    } catch (error) {
      console.error(error);
    }
  };

  const getElasticSearchData = async (curTime) => {
    const url = process.env.REACT_APP_ELASTICSEARCH_API_URL;

    const successQuery = {
      track_total_hits: true,
      size: 10000,
      from: 0,
      query: {
        bool: {
          must: [
            {
              match: {
                logType: 'PRODUCT_TEST_SUCCESS',
              },
            },
            {
              range: {
                '@timestamp': {
                  gte: prevTime, // 시작 시간
                  lte: curTime, // 종료 시간
                },
              },
            },
          ],
        },
      },
    };

    const failQuery = {
      track_total_hits: true,
      size: 10000,
      from: 0,
      query: {
        bool: {
          must: [
            {
              match: {
                logType: 'PRODUCT_TEST_FAIL',
              },
            },
            {
              range: {
                '@timestamp': {
                  gte: prevTime, // 시작 시간
                  lte: curTime, // 종료 시간
                },
              },
            },
          ],
        },
      },
    };

    try {
      const [successRes, failRes] = await Promise.all([
        axios.post(url, successQuery),
        axios.post(url, failQuery),
      ]);

      const successHitsLength = successRes.data.hits.hits.length;
      const failHitsLength = failRes.data.hits.hits.length;
      const tmp = {
        success: successHitsLength,
        fail: failHitsLength,
      };
      const currentDate = new Date();
      makeDataArr(tmp, currentDate);
      prevTime = curTime;
    } catch (error) {
      console.error(error);
    }
  };

  const makeDataArr = (rawData, currentDate) => {
    setData((prevData) => {
      let tmpData = [...prevData];
      const currentClock =
        currentDate.getHours().toString() +
        ':' +
        currentDate.getMinutes().toString();
      if (tmpData.length === 4) {
        tmpData.shift();
      }

      let tmpObject = {
        time: currentClock,
        success: rawData.success,
        fail: rawData.fail,
      };
      tmpData.push(tmpObject);
      tmpData.sort((a, b) => {
        if (a.time < b.time) {
          return -1;
        } else if (a.time > b.time) {
          return 1;
        }
        return 0;
      });
      return tmpData;
    });
  };

  const divStyle = {
    width: '350px',
    height: '300px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.25)',
    boxSizing: 'border-box',
  };

  const color = ['#00A5E5', '#BDBDBA'];

  return (
    <div style={divStyle}>
      <ResponsiveBar
        data={data}
        keys={['success', 'fail']}
        indexBy='time'
        margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
        padding={0.3}
        colors={color}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '시간당 전체 생산정보',
          legendPosition: 'middle',
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: ['총 생산량'],
          legendPosition: 'middle',
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 2.2]],
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role='application'
        ariaLabel='Nivo bar chart demo'
        barAriaLabel={(e) =>
          e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue
        }
      />
    </div>
  );
}

export default DivergingBar;
