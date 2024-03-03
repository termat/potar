'use client'
import Dashboard from './components/Dashboard'
import {useSearchParams } from 'next/navigation'

const searchParams = useSearchParams();
let page="";

export default function Home() {
  return (
    <Dashboard help={isItem()} page={page} />
  )
}

const isItem=()=>{
  if(searchParams.get("p")){
    page=searchParams.get("p");
    return false;
  }else{
    return true;
  }
}
