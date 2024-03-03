import { handleDialogOpen } from './DataTableDialog'
import { handleHelpDialogOpen } from "./HelpDialog";

export class PlayControl {

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
      requestAnimationFrame(frame)
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
      window.location="https://termat.github.io/potavi"
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
