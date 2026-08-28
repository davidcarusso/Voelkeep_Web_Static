// js/modules/includeFooter.js
export function loadHTML(containerId, filePath) {
    fetch(filePath)
      .then(response => {
          if (!response.ok) throw new Error('No se pudo cargar el archivo');
          return response.text();
      })
      .then(data => {
          document.getElementById(containerId).innerHTML = data;
      })
      .catch(error => console.error(error));
}