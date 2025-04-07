'use client';
import axios from 'axios';
import { useEffect } from 'react';
export default function Page() {
  console.log('get in test page');
  function getData() {
    axios.get('/api/test').then((response) => { 
      console.log(response.data);
    }).catch((error) => {
      console.error(error);
    });
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <></>
  )
};