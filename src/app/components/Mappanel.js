'use client'
import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Mappanel.css';
import mapbox from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
mapbox.workerClass = MapboxWorker;
import * as d3 from 'd3';
import * as turf from '@turf/turf';
import {DrawerOpenControl,handleDrawerClose} from './Dashboard';
import { DialogControl,HelpControl} from './MapControls';
import {setSlider,endRunning} from './ControlBar';
import axios from 'axios';
import {imagePop,imageClose} from './Imagepopup';
import { jumpData } from './DataTableDialog';

const photo_URL="https://www.termat.net/photo/get/bounds/";
const image_URL="https://www.termat.net/photo/get/image/";
let targetRoute;
let cameraAltitude = 500;
let routeDistance;
let speed;
let start;
let running=false;
let phase;
let angle=0.0;
let camera_angle=[-0.005,-0.005];
let speedMul=1.0;
let pointer;
let angleVal=0;
let runAni;
let mapObj;
let showPage="";

export const setSpeed=(val)=>{
    speedMul=val;
}

export const ieRunning=()=>{
    return running;
};

export const jumpTo=(data)=>{
    mapObj.fitBounds([
        [data[0]-0.01, data[1]-0.01],
        [data[0]+0.01, data[1]+0.01]
    ]);
};

const propcLine=(c)=>{
    c.forEach(e =>{
        targetRoute.push(e);
    });
}

export const parseGeojson=(json)=>{
    if (mapObj.getLayer('point'))mapObj.removeLayer('point');
    if (mapObj.getSource('point'))mapObj.removeSource('point');
    if (mapObj.getLayer('trace'))mapObj.removeLayer('trace');
    if (mapObj.getSource('trace'))mapObj.removeSource('trace');
    if (mapObj.getLayer('photo'))mapObj.removeLayer('photo');
    if (mapObj.getSource('photo'))mapObj.removeSource('photo');
    stopMovie();
    targetRoute=[];
    let array=json.features;
    array.forEach(e => {
        let c=e.geometry.coordinates;
        if(e.geometry.type==="Point"){
            targetRoute.push(c);
        }else if(e.geometry.type==="LineString"){
            propcLine(c,targetRoute);
        }
    });
    setGeojsonLayer(mapObj);
    fitBounds();
    start=null;
    phase=0.0;
    setSlider(0);
};

export const setPhase=(val)=>{
    phase=val;
    if(phase===0.0)start=null;
    if(targetRoute)frame();
}

export const startMovie=()=>{
    running=true;
    if(targetRoute)requestAnimationFrame(frame);
};

export const stopMovie=()=>{
    running=false;
    cancelAnimationFrame(runAni);
    start=null;
};

export const fitBounds=()=>{
    if(!targetRoute)return;
    let xmin=100000;
    let xmax=-10000;
    let ymin=100000;
    let ymax=-10000;
    targetRoute.forEach(element => {
        xmin=Math.min(xmin,element[0]);
        xmax=Math.max(xmax,element[0]);
        ymin=Math.min(ymin,element[1]);
        ymax=Math.max(ymax,element[1]);
    });
    mapObj.fitBounds([
        [xmin, ymin],
        [xmax, ymax]
    ]);
    addPhoto(mapObj,xmin,xmax,ymin,ymax);
};

const PHT= {
    "version": 8,
    "glyphs": "https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
    "sources": {
        "t_pale": {
            "type": "raster",
            "tiles": [
                "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg"
            ],
            "tileSize": 256,
            "attribution": "<a href='https://maps.gsi.go.jp/development/ichiran.html'>地理院タイル（全国最新写真）</a>"
        }
    },
    "layers": [{
        "id": "t_pale",
        "type": "raster",
        "source": "t_pale",
        "minzoom": 8,
        "maxzoom": 18
    }]
};

const vector={
    "type": "vector",
    "glyphs": "https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
    "tiles": [
        "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf"
    ],
    "minzoom":9,
    "maxzoom": 16
  };

export const itemData = [];
const createData=()=>{
    let url="./potar/pota_data.csv";
    d3.csv(url, function(data) {
        itemData.push(data);
    }).then(function(){
        if(showPage){       
            selectData(showPage);
        }
    });
}

export let setBearingVal;
export let setPitchVal;
export let setZoomVal;

export default function Mappanel(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(139.7588499);   // eslint-disable-line
    const [lat, setLat] = useState(35.6769883);    // eslint-disable-line
    const [zoom, setZoom] = useState(12); 
    const [pitch, setPitch] = useState(0.0); 
    const [bearing, setBearing] = useState(0.0);

    setBearingVal=(v)=>{
        setBearing(v);
        mapObj.setBearing(v);
    };

    setPitchVal=(v)=>{
        setPitch(v);
        mapObj.setPitch(v);
    };

    setZoomVal=(v)=>{
        setZoom(v);
        mapObj.setZoom(v);
    };

    useEffect(() => {
        if (map.current) return; 
        map.current = new mapbox.Map({
            accessToken:'pk.eyJ1IjoidGVybWF0IiwiYSI6ImNsYmt2Y3U0cDAxaDczb3F4eHNhbHZpOWUifQ.9QCC9j1r-O6wQpPBU8JAFQ',
            container: mapContainer.current,
            hash: true,
            style: PHT,
            center: [139.692704, 35.689526], 
            zoom: 14,
            maxZoom: 18,
            minZoom: 8,
            pitch: 65,
            bearing: 0,
            interactive: true,
            localIdeographFontFamily: false,
            antialias: true 
        });
        mapObj=map.current;
        map.current.on('click', (e)=>{
            handleDrawerClose();
        });
        var scale = new mapbox.ScaleControl({
            maxWidth: 80,
            unit: 'metric'
        });
        map.current.addControl(scale); 
        map.current.addControl(new mapbox.FullscreenControl());
        map.current.addControl(new mapbox.NavigationControl());
        map.current.addControl(new DrawerOpenControl("./icons/toggle.png","サイドパネル"), 'top-left');
        map.current.addControl(new DialogControl("./icons/cycle.png","データ一覧"), 'top-left');
        map.current.addControl(new HelpControl("./icons/help.png",'ヘルプ'), 'top-left');

        map.current.on('load', () => {
            showPage=props.page;
            setTerrain(map.current);
            setSky(map.current);
            setGeojsonLayer(map.current);
            setVector(map.current);
            createData();
            map.current.loadImage(
                './icons/camera.png',(error, image) => {
                    if (error) throw error;
                    map.current.addImage('custom-marker', image);
                }
            );
        });

        map.current.on('touchstart', (e)=> {
            pointer=e.point;
        });
        map.current.on('touchend', (e)=> {
            pointer=null;
        });

        map.current.on('mousedown', (e)=> {
            pointer=e.point;
        });
        map.current.on('mouseup', (e)=> {
            pointer=null;
        });
        map.current.on('mouseout', (e)=> {
            pointer=null;
        });
        map.current.on('mousemove', (e)=> {
            move(e);
        });
        map.current.on('touchmove', (e)=> {
            move(e);
        });
        map.current.on('wheel',(e)=>{
            if(running){
                e.preventDefault();
                if(e.originalEvent.deltaY>0){
                    cameraAltitude=Math.min(2000,cameraAltitude+50);
                }else{
                    cameraAltitude=Math.max(200,cameraAltitude-50);
                }
            }
        });
    });
 
    useEffect(() => { });

    return (
        <div ref={mapContainer} className="map" >
        </div>
    );
};

const selectData=(p)=>{
    itemData.forEach((e) =>{
        if(e.no==p){
            jumpData(e.json);
            return;
        }
    });
}

const move=(e)=>{
    if(running&&pointer){
        e.preventDefault();
        let x0=pointer.x;
        let y0=pointer.y;
        let x1=e.point.x;
        let y1=e.point.y;
        const e2 = e.originalEvent;
        let flg=false;
        if(e.originalEvent.altKey)flg=true;
        if (e2 && 'touches' in e2) {
            if (e2.touches.length > 1) {
                flg=true;
            }
        }
        if (flg) {
            if(y1>y0){
                cameraAltitude=Math.min(2000,cameraAltitude+50);
            }else{
                cameraAltitude=Math.max(200,cameraAltitude-50);
            }
        }else{
            if(x1>x0){
                angleVal=(angleVal+5)%360;
                angle=(angleVal/180.0)*Math.PI;
                camera_angle=[
                    -0.005*Math.cos(angle)-(-0.005)*Math.sin(angle),
                    -0.005*Math.sin(angle)+(-0.005)*Math.cos(angle)
                ];
            }else{
                angleVal=(angleVal-5)%360;
                angle=(angleVal/180.0)*Math.PI;
                camera_angle=[
                    -0.005*Math.cos(angle)-(-0.005)*Math.sin(angle),
                    -0.005*Math.sin(angle)+(-0.005)*Math.cos(angle)
                ];
            }
        }
        if(pointer)pointer=e.point;
    }
};

const setGeojsonLayer=(map)=>{
    if(targetRoute){
        map.addSource('trace', {
            type: 'geojson',
            data: {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': targetRoute
                }
            }
        });
        map.addLayer({
            type: 'line',
            source: 'trace',
            id: 'trace',
            paint: {
                'line-color': 'orange',
                'line-width': 5
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            }
        });
        let point = {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': targetRoute[0]
                }
            }]
        };
        map.addSource('point', {
            'type': 'geojson',
            'data': point 
        });
        map.addLayer({
            'id': 'point',
            'source': 'point',
            'type': 'circle',
            'paint': {
                'circle-color': "#ff0000",
                'circle-radius':8,
                'circle-stroke-width': 4,
                'circle-stroke-opacity': 0.05
            },
        });
        routeDistance = turf.length(turf.lineString(targetRoute));
        speed=1/((routeDistance/10)*60000);
    }
};

const setTerrain=(map)=>{
    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 15
    });
    map.setTerrain({'source': 'mapbox-dem', 'exaggeration': 1.2});
};

const setVector=(map)=>{
    if (!map.getSource('vector')){
        map.addSource('vector', vector);
        map.addLayer({
            "id": "vector",
            "type": "line",
            "source": "vector",
            "source-layer": "road",
            "minzoom": 9,
            "maxzoom": 18,
            "paint": {
                    'line-opacity': 1.0,
                    'line-color': 'rgb(80, 80, 80)',
                    'line-width': 2
                }
        });
        map.addLayer({
                "id": "vector-bldg",
                "type": "fill-extrusion",
                "source": "vector",
                "source-layer": "building",
                "paint": {
                    "fill-extrusion-height":[
                            'interpolate',
                            ['linear'],
                            ["get", "ftCode"],
                                3101,8.0,
                                3102,16.0,
                                3103,32.0,
                                3111,4.0,
                                3112,8.0
                    ],
                    "fill-extrusion-color": [
                        'interpolate',
                        ['linear'],
                        [
                            'interpolate',
                            ['linear'],
                            ["get", "ftCode"],
                                3101,8.0,
                                3102,16.0,
                                3103,32.0,
                                3111,4.0,
                                3112,8.0
                        ],
                        0,'#333344',
                        4,'#444455',
                        8,'#555566',
                        16,'#666688',
                        32,'#777799',
                        64,'#8888aa',
                        128,'#9999bb',
                        256,'#aaaacc'],
                    'fill-extrusion-opacity': 0.9
                }
            }
        );
        map.addLayer({
            "id": "label",
            "type": "symbol",
            "source": "vector",
            "source-layer": "label",
            "minzoom": 9,
            "maxzoom": 18,
            "layout": {
                'text-size': 16,
                "text-rotate":["case",["==",["get","arrng"],2],["*",["+",["to-number",["get","arrngAgl"]],90],-1],["*",["to-number",["get","arrngAgl"]],-1]],
                "text-field":["get","knj"],
                "text-font":["NotoSansCJKjp-Regular"],
                "text-allow-overlap": true,
                "text-keep-upright":true,
                "text-allow-overlap":false,
                "symbol-z-order":"auto",
                "text-max-width":60,
                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-justify': 'auto',
                "symbol-placement": "point"
            },
            "paint": {
                "text-color": "black",
                "text-opacity": 1.0,
                "text-halo-color": "rgba(255,255,255,0.95)",
                "text-halo-width": 1.5,
                "text-halo-blur": 1
            }
        });
    }
};

const setSky=(map)=>{
    if (!map.getLayer('sky')){
        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
            }
        });
    }
};

const getArg=(search)=>{
    var arg = new Object;
    var pair=search.substring(1).split('&');
    for(var i=0;pair[i];i++) {
        var kv = pair[i].split('=');
        arg[kv[0]]=kv[1];
    }
    return arg;
}

export const addPhoto=(map,xmin,xmax,ymin,ymax)=>{
    const url=photo_URL+xmin+"/"+ymin+"/"+(xmax-xmin)+"/"+(ymax-ymin);
    axios.get(url)
    .then(function (res) {
        map.addSource('photo', {
            'type': 'geojson',
            'data': res.data
        });
        map.addLayer({
            'id': 'photo',
            'source': 'photo',
            'type': 'symbol',
            'layout': {
                'icon-image': 'custom-marker',
                'text-size': 12,
                "text-field":["get","title"],
                "text-font":["NotoSansCJKjp-Regular"],
                "text-allow-overlap": true,
                "text-keep-upright":true,
                "text-allow-overlap":false,
                "symbol-z-order":"auto",
                "text-max-width":60,
                'text-variable-anchor':  ['top', 'bottom', 'left', 'right'],
                'text-justify': 'auto',
                "symbol-placement": "point",
                "icon-offset":[0,32]
            },
            "paint": {
                "text-color": "red",
                "text-opacity": 1.0,
                "text-halo-color": "rgba(255,255,255,0.95)",
                "text-halo-width": 1.5,
                "text-halo-blur": 1
            }
        });

        map.on('touchstart', 'photo', function(e){showPop(e);});
        map.on('mouseenter', 'photo', function(e){showPop(e);});
    });
};

const showPop=(e)=>{
    const ll=new mapbox.LngLat(e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]);
    const prop=e.features[0].properties;
    const divElement = document.createElement('div');
    const pElement = document.createElement('p');
    pElement.innerHTML=prop["title"]+"("+prop["date"]+")";
    const imgElement = document.createElement('img');
    imgElement.setAttribute("src","data:image/png;base64,"+prop["thumbnail"]);
    imgElement.setAttribute("style","width:100%;z-index:100;");
    imgElement.addEventListener('click', (e) => {
        imagePop(image_URL+prop["image"]);
    });
    divElement.appendChild(pElement);
    divElement.appendChild(imgElement);
    imageClose();
    let pop=new mapbox.Popup()
    .setLngLat(ll)
    .setDOMContent(divElement)
    .addTo(mapObj);
    const close=()=>{
        pop.remove();
     };
     setTimeout(close,2000);
};

const frame=(time)=>{
    if (!start){
        start = time;
//        phase=0.0;
    }else{
        if (typeof time !== "undefined") {
            let dd=time-start;
            start=time;
            phase=phase+speed*dd*speedMul*0.5;
        }else{
            start=Date.now();
        }
    }
    setSlider(phase);
    if (phase >= 1) {
        setTimeout(function () {
            running=false;
            endRunning();
        }, 1500);
    }
    let alongRoute = turf.along(
        turf.lineString(targetRoute),
        routeDistance * phase
    ).geometry.coordinates;
    let camera = mapObj.getFreeCameraOptions();
    camera.position = mapbox.MercatorCoordinate.fromLngLat({
            lng: alongRoute[0]-camera_angle[0],
            lat: alongRoute[1]-camera_angle[1]
        },
        cameraAltitude
    ); 
    camera.lookAtPoint({
        lng: alongRoute[0],
        lat: alongRoute[1]
    });
    mapObj.setFreeCameraOptions(camera);
    let point = {
        'type': 'FeatureCollection',
        'features': [{
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Point',
                'coordinates': alongRoute
            }
        }]
    };
    let src=mapObj.getSource('point');
    if(src)src.setData(point);
    if(running){
        runAni=requestAnimationFrame(frame);
    }else{
        cancelAnimationFrame(runAni);
    }
};

export const loadData=(p)=>{
    (async() => {
        parseGeojson(p);
    })();
};


