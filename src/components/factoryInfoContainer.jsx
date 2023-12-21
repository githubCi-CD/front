import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Button, Modal } from 'react-bootstrap';

import InfoBox from './infoBox';

function FactoryInfoContainer(props) {
  const { fId } = props;
  const [stockData, setStockData] = useState([]);
  const [factoryInfo, setFactoryInfo] = useState({});

  const [show, setShow] = useState(false);
  const [addShow, setAddShow] = useState(false);

  const [costModify, setCostModify] = useState([]);
  const [costModifyValue, setCostModifyValue] = useState(0);

  const [orderCnt, setOrderCnt] = useState(0);
  const [orderInfo, setOrderInfo] = useState({});

  const [addOrigin, setAddOrigin] = useState({
    name: '',
    price: 0,
  });

  useEffect(() => {
    getStockData(fId);
    setOrderCnt(0);
    setOrderInfo({});
  }, [fId]);

  useEffect(() => {
    const intervalGetStock = setInterval(() => {
      const id123 = window.localStorage.getItem('factory_id');
      getStockData(id123);
    }, 10000);
    return () => clearInterval(intervalGetStock);
  }, []);

  // 공장id로 재고현황 가져오기
  const getStockData = async (id) => {
    if (id !== undefined && id !== null) {
      const url =
        process.env.REACT_APP_MATERIALS_API_URL + '/storage?factoryId=' + id;
      try {
        const response = await axios.get(url);
        setStockData(response.data);
        makeCostModify(response.data);
        await getFactoryInfo(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 가져온 재고현황으로 수정버튼 활성화배열 만들기
  const makeCostModify = (data) => {
    const tmpCostMod = data.map((s) => false);
    setCostModify(tmpCostMod);
  };
  // 공장id로 공장의 자본현황 가져오기
  const getFactoryInfo = async (id) => {
    if (id !== undefined && id !== null) {
      const url = process.env.REACT_APP_FACTORY_API_URL + '/factory/' + id;
      try {
        const response = await axios.get(url);
        setFactoryInfo(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ====================== 수입하기 관련 함수 ======================
  // 재료 수입하는 모달창 열고 닫기
  const handleClose = () => {
    setOrderCnt(0);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  // 재료 구입하는 모달창에 넘겨줄 데이터 set
  const handleOrder = (value) => {
    const tmpOrder = {
      id: value.origin.id,
      재료명: value.origin.name,
      가격: value.origin.price,
    };
    setOrderInfo(tmpOrder);
    handleShow();
  };

  // 재료 구입하는 api 보내기 전 자본금이랑 비교하기
  const beforeSendOrder = () => {
    if (orderInfo['가격'] * orderCnt > factoryInfo.asset) {
      alert('주문금액이 자본금액보다 큽니다. 개수를 조절해주세요.');
      handleClose();
    } else sendOrder();
  };

  // 재료 구입하는 api
  const sendOrder = async () => {
    const url =
      process.env.REACT_APP_FACTORY_API_URL + '/factory/' + fId + '/buyOrigin';
    try {
      const response = await axios.post(url, {
        id: orderInfo.id,
        count: Number(orderCnt),
      });
      setFactoryInfo(response.data);
      setTimeout(() => {
        getStockData();
      }, 100);
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  // ====================== 수입하기 관련 함수 ======================

  // ====================== 가격 수정하기 관련 함수 ======================

  // 수정창 열기위해 'costModify' 수정
  const handleOpenCostModify = (idx) => {
    const tmpCostMod = costModify.map((v, i) => {
      if (i === idx) return true;
      else return false;
    });
    setCostModify(tmpCostMod);
  };

  // 수정창 닫기위해 'costModify' 수정
  const handleCloseCostModify = (idx) => {
    const tmpCostMod = costModify.map((v, i) => {
      if (i === idx) return false;
      else return false;
    });
    setCostModify(tmpCostMod);
  };

  // 가격 수정하기 api보내고 모달창 닫기
  const handleSendCostModify = (originId, idx) => {
    sendCostModify(originId);
    handleCloseCostModify(idx);
  };

  // 가격 수정하기 api
  const sendCostModify = async (originId) => {
    const url = process.env.REACT_APP_MATERIALS_API_URL + '/origin';
    try {
      await axios.patch(url, {
        id: originId,
        price: Number(costModifyValue),
      });
      getStockData();
    } catch (error) {
      console.error(error);
    }
  };

  // ====================== 가격 수정하기 관련 함수 ======================

  // ====================== 재료 추가하기 관련 함수 ======================
  // 재료 수입하는 모달창 열고 닫기
  const handleAddClose = () => {
    setAddOrigin({
      name: '',
      price: 0,
    });
    setAddShow(false);
  };
  const handleAddShow = () => setAddShow(true);

  const handleAddOriginName = (name) => {
    let tmpOrigin = { name, price: addOrigin.price };
    setAddOrigin(tmpOrigin);
  };

  const handleAddOriginPrice = (price) => {
    let tmpOrigin = { name: addOrigin.name, price };
    setAddOrigin(tmpOrigin);
  };

  const handleSendAddOrigin = () => {
    if (addOrigin.name !== '' && addOrigin.price !== 0) {
      sendAddOrigin();
    } else {
      alert('재료와 가격을 모두 적어주세요.');
    }
  };

  const sendAddOrigin = async () => {
    const url = process.env.REACT_APP_MATERIALS_API_URL + '/origin';
    try {
      await axios.post(url, {
        name: addOrigin.name,
        price: Number(addOrigin.price),
      });
      setTimeout(() => {
        getStockData();
      }, 100);
    } catch (error) {
      console.error(error);
    }
    handleAddClose();
  };
  // ========================== style ==========================
  const divStyle = {
    height: '350px',
    overflow: 'auto',
  };

  const subDivStyle = {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  };

  const moneyBoxDivStyle = {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
  };

  const moneyBoxStyle = {
    borderRadius: '10px',
    border: '1px solid rgba(0,0,0,0.25)',
    margin: '10px',
    padding: '10px',
  };

  // ========================== style ==========================

  return (
    <div style={divStyle}>
      <div>
        {/* 수입하기 모달 */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>재료 구입</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type='range'
              min={0}
              max={10000}
              step={100}
              value={orderCnt}
              onChange={(e) => setOrderCnt(e.target.value)}
            ></input>

            <p>재료명: {orderInfo?.['재료명']}</p>
            <p>가격: {orderInfo?.['가격']}(원)</p>
            <p>개수: {orderCnt}(개)</p>
            <b>총액: {orderCnt * orderInfo?.['가격']}(원)</b>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              취소
            </Button>
            <Button variant='primary' onClick={beforeSendOrder}>
              구입하기
            </Button>
          </Modal.Footer>
        </Modal>
        {/* 재료 추가하는 모달 */}
        <Modal show={addShow} onHide={handleAddClose}>
          <Modal.Header closeButton>
            <Modal.Title>재료 추가</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type='text'
              style={{ marginRight: '15px' }}
              placeholder='재료 이름'
              onChange={(e) => handleAddOriginName(e.target.value)}
            ></input>
            <input
              type='number'
              placeholder='재료 가격(원)'
              onChange={(e) => handleAddOriginPrice(e.target.value)}
            ></input>
            <br />
            <span style={{ marginRight: '15px' }}>
              재료 이름: {addOrigin.name}
            </span>
            <span>가격: {addOrigin.price}(원)</span>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleAddClose}>
              취소
            </Button>
            <Button variant='primary' onClick={handleSendAddOrigin}>
              추가하기
            </Button>
          </Modal.Footer>
        </Modal>

        <h3>재고현황</h3>
        <div style={moneyBoxDivStyle}>
          <div style={moneyBoxStyle}>수입 {factoryInfo.income}원</div>
          <div style={moneyBoxStyle}>지출 {factoryInfo.outcome}원</div>
          <div style={moneyBoxStyle}>자본 {factoryInfo.asset}원</div>
        </div>
        {stockData?.map((value, index) => {
          const stockProps = {
            width: '280px',
            bgColor: '#EAF9FF',
            color: '#00A5E5',
            content: value.origin.name,
            contentV: value.count,
          };

          return (
            <div key={index} style={subDivStyle}>
              <InfoBox infoProps={stockProps} unit={'개'} />
              {costModify[index] ? (
                <div style={{ width: '300px' }}>
                  <input
                    style={{ width: '120px', marginRight: '10px' }}
                    placeholder={value.origin.price}
                    type='text'
                    onChange={(e) => setCostModifyValue(e.target.value)}
                  />
                  <Button
                    style={{ marginRight: '10px' }}
                    variant='outline-secondary'
                    onClick={() => {
                      handleCloseCostModify(index);
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    variant='outline-success'
                    onClick={() => handleSendCostModify(value.origin.id, index)}
                  >
                    완료
                  </Button>
                </div>
              ) : (
                <div style={{ width: '300px' }}>
                  <span style={{ marginRight: '30px' }}>
                    {value.origin.price}원
                  </span>
                  <Button
                    variant='outline-primary'
                    onClick={() => {
                      handleOpenCostModify(index);
                    }}
                  >
                    가격 수정하기
                  </Button>
                </div>
              )}

              <Button variant='primary' onClick={() => handleOrder(value)}>
                구입하기
              </Button>
            </div>
          );
        })}
        <Button variant='secondary' onClick={handleAddShow}>
          재료 추가하기
        </Button>
      </div>
    </div>
  );
}

export default FactoryInfoContainer;
