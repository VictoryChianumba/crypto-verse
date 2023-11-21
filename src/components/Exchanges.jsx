import React, {useState} from 'react';
import millify from 'millify';
import {Select, Collapse, Row, Col, Typography, Avatar} from 'antd';
import HTMLReactParser from 'html-react-parser';
import {useParams} from 'react-router-dom';

import { useGetExchangeQuery, useGetCryptosQuery, useGetOhlcQuery, useGetSupplyQuery } from '../services/cryptoApi';
import Loader  from './Loader';

const { Text } = Typography;
const { Panel } = Collapse;
const {Option} = Select;

const Exchanges = () => {

  const style = { background: '#0092ff', padding: '8px 0' };

  
  
  const[coinUuid, selectCrypto] = useState('Qwsogvtv82FCd');
  console.log(coinUuid);
  const {data, isFetching} = useGetExchangeQuery(coinUuid);
  // console.log(data);
  const exchangeList = data?.data?.exchanges;
  const { data: exchangeData} = useGetCryptosQuery(100);
  // console.log(exchangeData);
  const ohlcData = useGetOhlcQuery(coinUuid);
  // console.log(ohlcData);
  const supplyData = useGetSupplyQuery(coinUuid);
  const cryptoDataSupply = supplyData?.currentData?.data?.supply;
  console.log(supplyData);
  console.log(cryptoDataSupply);
  

  

  if (isFetching) return <Loader/>;

  return (
    <>
      <Row>
        <Col span={6}>Exchanges</Col>
        <Col span={6}>Coin Price</Col>
        <Col span={6}>Number of Markets</Col>
        <Col span={6}>Circulating Amount</Col>
      </Row>
      <Row>
        {/* Option bar to choose crypto */}
      <Col span ={24}>
          <Select 
          showSearch
          className='select-crypto'
          placeholder='select crypto'
          optionFilterProp='children'
          onChange={(value) => selectCrypto(value)}
          
          // filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >=0 }
          >
            <Option value='Bitcoin'>Bitcoin </Option>
            {exchangeData?.data?.coins.map((coin) => <Option value={coin.uuid}>{coin.name}</Option>)}
            
          </Select>
        </Col>
        {exchangeList.map((exchange) => (
          <Col span={24}>
            <Collapse>
              <Panel
                key={exchange.uuid}
                showArrow={false}
                header={(
                  <Row key={exchange.uuid}>
                    <Col span={6}>
                      <Text ><strong>{exchange.rank}.</strong></Text>
                      <Avatar style={{ margin: '0 10px' }} className="exchange-region" src={exchange.iconUrl} />
                      <Text ><strong>{exchange.name}</strong></Text>
                    </Col>
                    <Col span={6}>${millify(exchange.price)}</Col>
                    <Col span={6}>{millify(exchange.numberOfMarkets)}</Col>
                    <Col span={6}>{millify(cryptoDataSupply.circulatingAmount)}%</Col>
                  </Row>
                )}
              >
                  {/* finish dropdown later */}
              </Panel>
            </Collapse>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Exchanges

