'use client'
import Dashboard from './components/Dashboard'
import {useSearchParams } from 'next/navigation'

let page="";

document.addEventListener("gesturestart", function (e) {
	e.preventDefault();
    document.body.style.zoom = 0.99;
});

document.addEventListener("gesturechange", function (e) {
	e.preventDefault();

  document.body.style.zoom = 0.99;
});
document.addEventListener("gestureend", function (e) {
	  e.preventDefault();
    document.body.style.zoom = 1;
});

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
