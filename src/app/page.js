'use client'
import Dashboard from './components/Dashboard'
import {useSearchParams } from 'next/navigation'

let page="";

export default function Home() {
  const searchParams = useSearchParams();

  return (
    <Dashboard help={isItem(searchParams)} page={page} />
  )
}

const isItem=(sp)=>{
  if(sp.get("p")){
    page=sp.get("p");
    return false;
  }else{
    return true;
  }
}
