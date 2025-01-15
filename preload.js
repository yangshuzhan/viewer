const {  ipcRenderer } = require('electron')
window.addEventListener('DOMContentLoaded', () => {
  // Inject the import map into the page
  const importMap = {
    imports: {
      "three": "https://cdn.jsdelivr.net/npm/three@v0.172.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/",
      "three/examples/": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/"
    }
  };

  // Create a <script type="importmap"> element
  const script = document.createElement('script');
  script.type = 'importmap';
  script.textContent = JSON.stringify(importMap);
  
  // Append the import map to the head of the document
  document.head.appendChild(script);
});