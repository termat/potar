import { handleDialogOpen } from './DataTableDialog'
import { handleHelpDialogOpen } from "./HelpDialog";
import { getChartVisible,setChartVisible } from './ChartBar';
import { clearRoute } from './Mappanel';
import * as turf from '@turf/turf';

export class DialogControl {

  constructor(url,label){
    this.url=url;
    this.label=label;
  }

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      handleDialogOpen();
    });
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this.container.appendChild(homeButton);
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}

export class HelpControl {

  constructor(url,label){
    this.url=url;
    this.label=label;
  }

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      handleHelpDialogOpen();
    });
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this.container.appendChild(homeButton);
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}

export class HomeControl {

  constructor(url,label){
    this.url=url;
    this.label=label;
  }

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      window.location="https://termat.github.io/potar"
    });
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this.container.appendChild(homeButton);
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}

export class ChartControl {

  constructor(url,label){
    this.url=url;
    this.label=label;
  }

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      const flg=getChartVisible();
      if(flg==="hidden"){
        setChartVisible("visible");
      }else{
        setChartVisible("hidden");
      }
    });
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this.container.appendChild(homeButton);
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}


export class RouteControl {

  constructor(url,label){
    this.url=url;
    this.label=label;
  }

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="./potar/'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      clearRoute();
      map.addLayer({
        type: 'line',
        source: 'list',
        id: 'list',
        paint: {
            'line-color': 'orange',
            'line-width': 5
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
      });


      
      let bbox=turf.bbox(stores);
      map.fitBounds(bbox, {padding: 20});
    });
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this.container.appendChild(homeButton);
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}