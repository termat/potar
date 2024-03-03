'use client'
import Dashboard from './components/Dashboard'
import {useSearchParams } from 'next/navigation'

let page="";

export default function Home() {
  return (
    <Dashboard help={isItem()} page={page} />
  )
}

const isItem=()=>{
  const arg=getArg(window.location.search)
  if(arg["p"]){
    page=arg["p"];
    return false;
  }else{
    return true;
  }
}

const getArg=(search)=>{
  var arg = new Object;
  var pair=search.substring(1).split('&');
  for(var i=0;pair[i];i++) {
      var kv = pair[i].split('=');
      arg[kv[0]]=kv[1];
  }
  return arg;
}