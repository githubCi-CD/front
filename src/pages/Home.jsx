import React, { useState, useEffect } from 'react';
import axios from 'axios';

import BasicLine from '../components/basicLine';
import AccountContainer from '../components/accountContainer';
import FactoryInfoContainer from '../components/factoryInfoContainer';

function Home() {
  const [factoryData, setFactoryData] = useState([]);
  const [totalFinance, setTotalFinance] = useState([
    {
      수입: 0,
    },
    {
      지출: 0,
    },
    { 자본: 0 },
  ]);
  const [fId, setFId] = useState(0);

  useEffect(() => {
    getFactory();
  }, []);

  const selectFactoryId = (id) => {
    window.localStorage.setItem('factory_id', id);
    setFId(id);
  };

  const getFactory = async () => {
    const url = process.env.REACT_APP_FACTORY_API_URL + '/factory';
    try {
      const response = await axios.get(url);
      getTotalFinance(response.data);
      setFactoryData(response.data);
      let tmpIdx = response.data.findIndex((v) => v.status === true);
      window.localStorage.setItem('factory_id', response.data[tmpIdx]?.id);
      setFId(() => response.data[tmpIdx]?.id);
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalFinance = (fatories) => {
    let 수입 = 0;
    let 지출 = 0;
    let 자본 = 0;

    fatories.forEach((factory) => {
      수입 += factory.income;
      지출 += factory.outcome;
      자본 += factory.asset;
    });
    let sumFinance = [{ 수입 }, { 지출 }, { 자본 }];
    setTotalFinance(sumFinance);
  };

  // ========================== style ==========================

  const homeDivStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    width: 'calc(100vw - 140px)',
    justifyContent: 'space-between',
    margin: '20px auto',
    backgroundColor: '#EAF9FF',
    borderRadius: '15px',
  };

  const leftDivStyle = {
    backgroundColor: 'white',
    borderTopLeftRadius: '15px',
    borderBottomLeftRadius: '15px',
    padding: '20px',
  };

  const tabBoxStyle = {
    whiteSpace: 'nowrap',
    overflow: 'auto',
    width: '100%',
    height: '40px',
  };

  const activeTabStyle = {
    margin: '0 10px',
    fontWeight: 'bold',
    color: '#00A5E5',
    cursor: 'pointer',
  };

  const unactiveTabStyle = {
    margin: '0 10px',
    cursor: 'pointer',
  };

  // ========================== style ==========================

  return (
    <div style={homeDivStyle}>
      <div style={leftDivStyle}>
        <BasicLine factoryData={factoryData} />
        <div style={tabBoxStyle}>
          {factoryData?.map((fact) => {
            if (fact.status) {
              if (fact.id === fId) {
                return (
                  <span
                    key={fact.id}
                    style={activeTabStyle}
                    onClick={() => selectFactoryId(fact.id)}
                  >
                    {fact.name}
                  </span>
                );
              } else {
                return (
                  <span
                    key={fact.id}
                    style={unactiveTabStyle}
                    onClick={() => selectFactoryId(fact.id)}
                  >
                    {fact.name}
                  </span>
                );
              }
            } else {
              return (
                <span
                  key={fact.id}
                  style={{ color: '#aaa', margin: '0 10px' }}
                  title='비활성화 공장입니다.'
                >
                  {fact.name}
                </span>
              );
            }
          })}
        </div>
        <hr />
        <FactoryInfoContainer fId={fId} getFactory={getFactory} />
      </div>
      <AccountContainer totalFinance={totalFinance} />
    </div>
  );
}

export default Home;
