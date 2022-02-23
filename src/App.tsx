import React, { useEffect, useState } from 'react';
// @ts-ignore
import createPersistedState from 'use-persisted-state';
import Batch from './components/Batch';
import { useSearchParams } from "react-router-dom";


const useBatchesState = createPersistedState('batches');

const API_URL = 'https://api.brewfather.app/v1/';
let headers = new Headers();

const fetchBatches = async () => {
  const data = await fetch(
    `${API_URL}batches?status=Fermenting`,
    {method:'GET', headers: headers}
  );
  
  return await data.json();
}

const fetchReadings = async (batches: any[]) => {
  const asyncRes = await Promise.all(batches.map(async (batch) => {
    const readingsData = await fetch(
      `${API_URL}batches/${batch._id}/readings`,
      {method:'GET', headers: headers}
    );

    const readings = await readingsData.json();
    const mappedReadings = readings.map((reading: any) => ({
      ...reading,
      sg: reading.sg.toFixed(3)
    }))

    return {
      ...batch,
      readings: mappedReadings.sort((a: any, b:any) => b.time - a.time),
    }
  }));
  
  return asyncRes;
}

const App = () => {
  const [searchParams] = useSearchParams();
  const [batches, setBatches] = useBatchesState([]);
  const [hasToken, setHasToken] = useBatchesState(true);


  useEffect(() => {
    const token = searchParams.get('token');
    if(!token) {
      setHasToken(false);
    };

    headers.append('Authorization', 'Basic ' + token);

    fetchBatches().then((batches: any) => {
      fetchReadings(batches).then((readings: any) => {
        setBatches(readings);
      });
    });
  })

  const Batches = batches && batches.map((batch: any) => (<Batch key={batch._id} data={batch} />))

  if(!hasToken) {
    return <div>Please set ?token=</div>;
  }
  return (
    <div>
      {Batches}
    </div>
  );
}

export default App;
