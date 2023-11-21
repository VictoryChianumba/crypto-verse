import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoApiHeaders = {
    'X-RapidAPI-Key': 'a60fb3fcd7msh421f1894e94a609p116f9bjsn07a2d87955a2',
    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
//    
}

const baseUrl = 'https://coinranking1.p.rapidapi.com';

const createRequest = (url) => ({url, headers: cryptoApiHeaders});

export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: fetchBaseQuery({baseUrl}),
    endpoints: (builder) => ({
        getCryptos: builder.query({
            query: (count) => createRequest(`/coins?limit=${count}`),
        }),
        
        // getting the details of a cryptocurrency for the exchange
        getCryptoDetails: builder.query({
            query: (coinUuid) => createRequest(`/coin/${coinUuid}`),
        }),
        
        // getting the HISTORY of a cryptocurrency for the exchange
        getCryptoHistory: builder.query({
            query: (coinUuid, timePeriod) => createRequest(`/coin/${coinUuid}/history?timeperiod=${timePeriod}`),
        }),

        // getting the Exchange data
        getExchange: builder.query({
            query:  (coinUuid) => createRequest(`/coin/${coinUuid}/exchanges`),
        }),

        getOhlc: builder.query({
            query:  (coinUuid) => createRequest(`/coin/${coinUuid}/ohlc`),
        }),
        
        getSupply: builder.query({
            query:  (coinUuid) => createRequest(`/coin/${coinUuid}/supply`),
        }),
    })
});

export const {
     useGetCryptosQuery, 
     useGetCryptoDetailsQuery, 
     useGetCryptoHistoryQuery, 
     useGetExchangeQuery ,
     useGetOhlcQuery,
     useGetSupplyQuery
    } = cryptoApi;