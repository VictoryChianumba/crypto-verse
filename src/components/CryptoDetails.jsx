import React, { useState } from 'react'
import HTMLReactParser from 'html-react-parser'
import {useParams} from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';

import {useGetCryptoDetailsQuery, useGetCryptoHistoryQuery} from '../services/cryptoApi';
import LineChart from './LineChart';
import  Loader from './Loader';

const { Title, Text } = Typography;
const { Option } = Select;


const CryptoDetails = () => {
  // grab coinUuid and use that to identify specific cryptocurrency
  const { coinUuid } = useParams();
  console.log(coinUuid);
  const [timePeriod, setTimePeriod] = useState('7d');
  const { data, isFetching } = useGetCryptoDetailsQuery(coinUuid);
  console.log(data);
  const { data: coinHistory } = useGetCryptoHistoryQuery(coinUuid, timePeriod);
  console.log(coinHistory);
  const cryptoDetails = data?.data?.coin;
  // In the data, under data, under the coin section is all the data we want to display

  if (isFetching) return <Loader/>;

  //  to check if the data is fetched or not

  const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

  const stats = [
    { title: 'Price to USD', value: `$ ${cryptoDetails?.price && millify(cryptoDetails?.price)}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: cryptoDetails?.rank, icon: <NumberOutlined /> },
    { title: '24h Volume', value: `$ ${cryptoDetails?.volume && millify(cryptoDetails?.volume)}`, icon: <ThunderboltOutlined /> },
    { title: 'Market Cap', value: `$ ${cryptoDetails?.marketCap && millify(cryptoDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time-high(daily avg.)', value: `$ ${cryptoDetails?.allTimeHigh?.price && millify(cryptoDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets, icon: <FundOutlined /> },
    { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
    { title: 'Aprroved Supply', value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: 'Total Supply', value: `$ ${cryptoDetails?.supply?.total && millify(cryptoDetails?.supply?.total)}`, icon: <ExclamationCircleOutlined /> },
    { title: 'Circulating Supply', value: `$ ${cryptoDetails?.supply?.circulating && millify(cryptoDetails?.supply?.circulating)}`, icon: <ExclamationCircleOutlined /> },
  ];
  
  return (
    <Col className='coin-detail-container'>
      {/* page title */}
      <Col className='coin-heading-container'>
        <Title level={2} className='coin-name'>{cryptoDetails.name} ({cryptoDetails.symbol}) Price</Title>
        <p>{cryptoDetails.name} live price in US dollars. View value statistics, market and supply</p>
      </Col>
      {/* days selector */}
      <Select 
        defaultValue="7d" 
        className="select-time-period" 
        placeholder="Select Time Period"
        onChange={(value) => setTimePeriod(value)}
      >
        {time.map((date) => <Option key={date}>{date}</Option>)}
      </Select>
      {/* line chart with params */}
      <LineChart coinHistory={coinHistory} currentPrice={millify(cryptoDetails?.price)} coinName={cryptoDetails?.name} />
      {/* statistics */}
      <Col className='stats-container'>
        {/* specific statistics to the cryptocurrency */}
        <Col className="coin-value-statistics">
          <Col className="coin-value-statistic-heading">
            <Title level={3} className=" coin-details-heading"> {cryptoDetails.name} Value Statistics</Title>
            <p>An overview showing the stats of {cryptoDetails.name}</p>
          </Col>
          {stats.map(({icon, title, value})=> (
            <Col className="coin-stats">
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className='stats'> {value}</Text>
            </Col>
          ))}
        </Col>
        {/* Generic stats for all cryptocurrency */}
        <Col className="other-statistical-info">
          <Col className="coin-value-statistic-heading">
            <Title level={3} className=" coin-details-heading"> Generic Crypto Statistics</Title>
            <p>An overview of general crypto data</p>
          </Col>
          {genericStats.map(({icon, title, value})=> (
            <Col className="coin-stats">
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className='stats'> {value}</Text>
            </Col>
          ))}
        </Col>
      </Col>
      {/* all other data */}
      <Col className='coin-desc-link'>
        <Row className='row-desc'>
          {/* parse all information on the Cryptocurrency */}
          <Title level={3} className="coin-details-heading">What is {cryptoDetails.name}?</Title>
          {HTMLReactParser(cryptoDetails.description)}
        </Row>
        {/* Related links to the Currency */}
        <Col className="coin-links">
          <Title level={3} className='coin-details-heading'>{cryptoDetails.name} Links</Title>
          {cryptoDetails.links?.map((link) => (
            <Row className='coin-link' key={link.name}>
              <Title level={5} className="link-name">{link.type}</Title>
              <a href={link.url} target="_blank" rel='noreferrer'>{link.name}</a>
            </Row>
          ))}
        </Col>
      </Col>
    </Col>
    
  )
}

export default CryptoDetails