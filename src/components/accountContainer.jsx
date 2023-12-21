import React from 'react';

import InfoBox from './infoBox';
import DivergingBar from './divergingBar';

function AccountContainer(props) {
  const { totalFinance } = props;

  const divStyle = {
    margin: '0 auto',
  };

  const poscoLogo = {
    width: '150px',
    height: '40px',
    margin: '20px auto',
    backgroundImage:
      'url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/POSCO_logo.svg/799px-POSCO_logo.svg.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  };

  return (
    <div style={divStyle}>
      <div style={poscoLogo}></div>
      <h3>총 재무상황</h3>
      {totalFinance?.map((value, index) => {
        const accountProps = {
          width: '350px',
          bgColor: 'white',
          color: '#4B5151',
          content: Object.keys(value)[0],
          contentV: Object.values(value)[0],
        };
        return <InfoBox key={index} infoProps={accountProps} unit={'원'} />;
      })}
      <DivergingBar />
    </div>
  );
}

export default AccountContainer;
