import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

// Cantidad de bloques para la cuadricula de fondo
const blockCountX = Math.floor(innerWidth / 25);
const blockCountY = Math.floor(innerHeight / 25);

// Figuras de fondo
const figuras = [
  [[1, 1, 1, 1]],
  [[1], [1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, null],
    [null, 1, 1],
  ],
  [
    [null, 1],
    [1, 1],
    [1, null],
  ],
  [
    [null, 1, 1],
    [1, 1, null],
  ],
  [
    [1, null],
    [1, 1],
    [null, 1],
  ],
  [
    [1, 1, 1],
    [null, 1, null],
  ],
  [
    [null, 1, null],
    [1, 1, 1],
  ],
  [
    [1, null],
    [1, 1],
    [1, null],
  ],
  [
    [null, 1],
    [1, 1],
    [null, 1],
  ],
  [
    [1, 1, 1],
    [1, null, null],
  ],
  [
    [1, null],
    [1, null],
    [1, 1],
  ],
  [
    [null, null, 1],
    [1, 1, 1],
  ],
  [
    [1, 1],
    [null, 1],
    [null, 1],
  ],
  [
    [1, 1, 1],
    [null, null, 1],
  ],
  [
    [1, 1],
    [1, null],
    [1, null],
  ],
  [
    [1, null, null],
    [1, 1, 1],
  ],
  [
    [null, 1],
    [null, 1],
    [1, 1],
  ],
];

// Logo de TETRIS
const logo = [
  [
    [1, 1, 1],
    [null, 1, null],
    [null, 1, null],
    [null, 1, null],
    [null, 1, null],
  ], // T
  [
    [1, 1, 1],
    [1, null, null],
    [1, 1, 1],
    [1, null, null],
    [1, 1, 1],
  ], // E
  [
    [1, 1, 1],
    [null, 1, null],
    [null, 1, null],
    [null, 1, null],
    [null, 1, null],
  ], // T
  [
    [1, 1, 1],
    [1, null, 1],
    [1, 1, 1],
    [1, null, 1],
    [1, null, 1],
  ], // R
  [[1], [1], [1], [1], [1]], // I
  [
    [1, 1, 1],
    [1, null, null],
    [1, 1, 1],
    [null, null, 1],
    [1, 1, 1],
  ], // S
];

// Modal Inicial
export function GameModal({ setPlayer, setControls }) {
  const modal = useRef(null);
  const cuadricula = Array.from({ length: blockCountY }, () => Array(blockCountX).fill(null));
  let isGameOver = false; // Detiene la aparición de figuras en el fondo
  let iniciador = null; // Temporizador que muestra la interface
  let showFigure = null; // Temporizador que va mostrando las figuras en el fondo
  let isRender = true; // Renderiza solo una vez la aparición de las figuras
  // Empieza a dibujar el logo en una coordenada x, y central
  let paintBlocksX = Math.round(blockCountX / 2) - 11;
  let paintBlocksY = Math.round(blockCountY / 2) - 5;

  // Muestra la interface inicial
  useEffect(() => {
    mostrarInterface();
  }, []);

  function mostrarInterface() {
    if (!iniciador) {
      // Dibuja el logo 'TETRIS' si cumple con un width y height, si no renderiza un modal
      if (blockCountX > 22 && blockCountY > 13) {
        iniciador = setTimeout(() => {
          let letra = 0; // Índice de letra del logo
          let fila = 0; // Índice  de fila de la letra
          let columna = 0; // Índice de columna de la fila

          const dibujador = setInterval(() => {
            // Cuando encuentra una columna de la fila de la letra la muestra
            if (logo[letra][fila][columna]) {
              const divBlock = document.querySelector(
                `.modal__cell[data-y='${paintBlocksY + fila}'][data-x='${paintBlocksX + columna}']`
              );
              const divAnimation = document.createElement("div");

              divAnimation.classList.add("cell__animation");
              divBlock.appendChild(divAnimation);
            }

            // Luego de mostrarse se actualiza la siguiente columna, fila o letra  si es que hay y si no, se empieza a mostrar las figuras de fondo
            if (logo[letra][fila][columna + 1] !== undefined) {
              columna++;
            } else if (logo[letra][fila + 1] !== undefined) {
              fila++;
              columna = 0;
            } else if (logo[letra + 1] !== undefined) {
              paintBlocksX = paintBlocksX + logo[letra][0].length + 1;
              letra++;
              fila = 0;
              columna = 0;
            } else if (logo[letra + 1] === undefined) {
              clearInterval(dibujador);
              infoFiguras();
            }
          }, 70);
        }, 1000);
      } else {
        // Muestra las figuras de todos modos
        if (isRender) {
          isRender = false;
          infoFiguras();
        }
      }
    }
  }

  // Obtiene la figura y sus coordenadas y luego la figura pueda aparecer en el fondo
  function infoFiguras() {
    showFigure = setInterval(() => {
      const figura = figuras[Math.floor(Math.random() * figuras.length)];
      let coorX = Math.floor(Math.random() * (blockCountX - 1 - figura[0].length));
      const coorY = 0;

      canShowFigure(figura, coorX, coorY);
    }, 5000);
  }

  // Muestra la figura si todas sus celdas están vacías en el tablero si no finaliza la aparición de nuevas figuras y anima las existentes
  function canShowFigure(figura, coorX, coorY) {
    // Si una celda ('div') de la figura ya esta ocupada en el tablero finaliza la aparición de las figuras, si no la muestra
    for (let y = 0; y < figura.length; y++) {
      if (isGameOver) break;

      for (let x = 0; x < figura[y].length; x++) {
        if (figura[y][x]) {
          const div = document.querySelector(`.modal__cell[data-x='${coorX + x}'][data-y='${coorY + y}']`);
          const atributo = div.getAttribute("data-cell-ocupied");

          if (atributo === "true") {
            isGameOver = true;
            break;
          }
        }
      }
    }

    // Muestra la figura si se puede y si no se opacan todas las celdas existentes
    if (!isGameOver) mostrarFigura(figura, coorX, coorY);
    else {
      let index = 0;
      const cellsOcupied = document.querySelectorAll(".cell__ocupied");

      const over = setInterval(() => {
        if (index === cellsOcupied.length) clearInterval(over);
        else {
          cellsOcupied[index].style.backgroundColor = "#777d";
          index++;
        }
      }, 20);

      clearInterval(showFigure);
      return;
    }
  }

  function mostrarFigura(figura, coorX, coorY) {
    // Dibuja la primera posición de la figura
    addOrDeleteClass(figura, "cell__ocupied", "add", coorX, coorY);

    // Obtiene los puntos bajos de una figura para comprobar si puede seguir bajando
    const figureDown = [];

    for (let y = 0; y < figura.length; y++) {
      for (let x = 0; x < figura[y].length; x++) {
        if (figura[y][x] && figura[y + 1]) {
          if (figura[y + 1][x]) {
            continue;
          } else {
            figureDown.push([x, y + 1]);
          }
        } else if (figura[y][x]) {
          figureDown.push([x, y + 1]);
        }
      }
    }

    // Mueve la figura hacia abajo si es que el juego no ha terminado y comprueba si puede seguir bajando
    const movedorY = setInterval(() => {
      if (!isGameOver) {
        let isStatic = false;

        // Obtiene las celdas de abajo para comprobar si puede bajar, si ya no hay mas celdas o si la celda de abajo ya esta ocupada la figura se queda estática
        for (let i = 0; i < figureDown.length; i++) {
          const coorDown = figureDown[i];
          const div = document.querySelector(
            `.modal__cell[data-x='${coorDown[0] + coorX}'][data-y='${coorDown[1] + coorY}']`
          );

          if (div) {
            const atributo = div.getAttribute("data-cell-ocupied");

            if (atributo === "true") isStatic = true;
          } else isStatic = true;
        }

        if (!isStatic) {
          // Si puede bajar se borra la posición actual y luego se dibuja la nueva
          addOrDeleteClass(figura, "cell__ocupied", "remove", coorX, coorY);
          coorY++;
          addOrDeleteClass(figura, "cell__ocupied", "add", coorX, coorY);
        } else {
          // Si no puede bajar se deja en la posición actual y se detiene el movedor
          for (let y = 0; y < figura.length; y++) {
            for (let x = 0; x < figura[y].length; x++) {
              if (figura[y][x]) {
                const divEstatico = document.querySelector(
                  `.modal__cell[data-x='${x + coorX}'][data-y='${y + coorY}']`
                );

                divEstatico.setAttribute("data-cell-ocupied", true);
              }
            }
          }

          clearInterval(movedorY);
          return;
        }
      }
    }, 1000);
  }

  // Función que agrega o elimina clases a las celdas de la figura
  function addOrDeleteClass(figura, clases, metodo, coorX, coorY) {
    for (let y = 0; y < figura.length; y++) {
      for (let x = 0; x < figura[y].length; x++) {
        if (figura[y][x]) {
          const div = document.querySelector(`.modal__cell[data-x='${x + coorX}'][data-y='${y + coorY}']`);

          div.classList[metodo](clases);
        }
      }
    }
  }

  // Agrega o no los controles para el juego y detiene el intervalo de las figuras de fondo
  function handleClick(controls) {
    isGameOver = true;
    clearInterval(showFigure);
    setPlayer(1);
    setControls(controls);
  }

  return (
    <div className="modal" ref={modal} style={{ gridTemplateColumns: `repeat(${blockCountX}, 1fr)` }}>
      {blockCountX < 23 || blockCountY < 14 ? (
        <div className="panel">
          <h1>Play Tetris</h1>
          <button onClick={() => handleClick(true)}>Controls</button>
          <button onClick={() => handleClick(false)}>No Controls</button>
        </div> // Modal si es que el screen no cumple con medidas adecuadas
      ) : (
        <div
          className="modal_btn_container"
          style={{ width: `${25 * 15}px`, top: `${(paintBlocksY + logo.length) * 25}px` }}
        >
          <button
            className="modal__btn"
            onClick={() => {
              handleClick(true);
            }}
          >
            Controls
          </button>
          <button
            className="modal__btn"
            onClick={() => {
              handleClick(false);
            }}
          >
            No Controls
          </button>
        </div> // Los puros botones luego de que se dibuja el logo de TETRIS
      )}
      {cuadricula.map((fila, y) => {
        return fila.map((columna, x) => (
          <div key={`${x}-${y}`} className="modal__cell" data-cell-ocupied={false} data-x={x} data-y={y}></div>
        )); // Cuadricula de fondo
      })}
    </div>
  );
}

GameModal.propTypes = {
  setPlayer: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
};
