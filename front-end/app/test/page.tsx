'use client';
import axios from 'axios';
import { useEffect } from 'react';
export default function Page() {
  console.log('get in test page');
  function getData() {
    axios.get('/api/재홍씨가보내고싶은이름').then((response) => { 
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