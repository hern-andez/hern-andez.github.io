// Posiciones de la celda A, B donde debe de estar los divs animados
const estado = [
  [
    [1, 1],
    [1, 4],
  ],
  [
    [1, 1],
    [2, 2],
  ],
  [
    [1, 1],
    [4, 1],
  ],
  [
    [3, 1],
    [4, 2],
  ],
  [
    [4, 1],
    [4, 4],
  ],
  [
    [3, 3],
    [4, 4],
  ],
  [
    [1, 4],
    [4, 4],
  ],
  [
    [1, 3],
    [2, 4],
  ],
];

const container = document.querySelector(".container");
let ismiddlestate = false; // Indica si el segundo div debe aparecer

setTimeout(() => {
  dimensionadorDiv("div--first"); // Muestra el primer div

  const twoDiv = setInterval(() => {
    if (ismiddlestate === true) {
      dimensionadorDiv("div--second");
      clearInterval(twoDiv);
    }
  }, 100);
}, 1000);

function dimensionadorDiv(className) {
  let indexState = 0;
  const divAnimado = document.createElement("div");
  divAnimado.classList.add("div__animation", className);
  container.appendChild(divAnimado);

  setInterval(() => {
    if (indexState === estado.length) indexState = 0; // Ejecuta la animación infinitamente
    if (indexState === estado.length / 2 - 1 && !ismiddlestate) ismiddlestate = true; // Indica que debe aparecer el segundo div cuando el primero esta en la mitad del proceso

    const cells = estado[indexState]; // Celdas para la nueva posición
    const cellA = document.querySelector(`.cell[fila='${cells[0][0]}'][columna='${cells[0][1]}']`);
    const cellB = document.querySelector(`.cell[fila='${cells[1][0]}'][columna='${cells[1][1]}']`);
    // Información sobre celdas y contenedor
    const infoCellA = cellA.getBoundingClientRect();
    const infoCellB = cellB.getBoundingClientRect();
    const infoContainer = container.getBoundingClientRect();

    // Calcula la nueva posición y dimensión del div animado según las celdas y el contenedor
    const coorX = infoCellA.x - infoContainer.x;
    const coorY = infoCellA.y - infoContainer.y;
    const width = infoCellB.x + infoCellB.width - infoCellA.x;
    const height = infoCellB.y + infoCellB.height - infoCellA.y;

    divAnimado.style.left = `${coorX}px`;
    divAnimado.style.top = `${coorY}px`;
    divAnimado.style.width = `${width}px`;
    divAnimado.style.height = `${height}px`;

    indexState++;
  }, 550);
}
