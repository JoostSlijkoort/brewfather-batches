import React, { useEffect, useState } from 'react';
// @ts-ignore
import createPersistedState from 'use-persisted-state';
import Batch from './components/Batch';
import { useSearchParams } from "react-router-dom";

const useBatchesState = createPersistedState('batches');

const API_URL = 'https://api.brewfather.app/v1/';
let headers = new Headers();


// General todo:
// - Throttling


const fetchBatches = async () => {
  const data = await fetch(
    `${API_URL}batches?status=Fermenting`,
    {method:'GET', headers: headers}
  );

  if(!data.ok) {
    return {
      error: await data.text(),
    }
  }
  return {
    data: await data.json(),
    error: false
  }
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
      readings: mappedReadings.sort((a: any, b:any) => a.time - b.time),
    }
  }));
  
  return asyncRes;
}

const App = () => {
  const [searchParams] = useSearchParams();
  const [batches, setBatches] = useBatchesState([]);
  const [hasToken, setHasToken] = useState(false);
  const [error, setError] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token');

    if(!token) {
      setHasToken(false);
      return;
    } else {
      setHasToken(true);
    };

    headers.append('Authorization', 'Basic ' + token);

    fetchBatches().then((batches: any) => {
      if(batches.error) {
        setError(batches.error);
        return;
      }

      fetchReadings(batches.data).then((readings: any) => {
        setBatches(readings);
      });
    });
  }, [])

  const Batches = batches && batches.length && batches.filter((v: any) => v.readings.length > 0).map((batch: any) => (<Batch key={batch._id} data={batch} />))

  if(error) {
    return <div className="warn">Error: {error}</div>
  }
  if(!hasToken) {
    return <div className="warn">Please set ?token=</div>;
  }
  return (
    <div>
      {Batches}
    </div>
  );
}

export default App;
