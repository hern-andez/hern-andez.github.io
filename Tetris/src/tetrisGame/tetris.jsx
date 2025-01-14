import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

// Toda la musical e imágenes
const soundGame = new Audio("/assets/sounds/soundGame.mp3");
const soundGameOver = new Audio("/assets/sounds/gameover.mp3");
const soundCount = new Audio("/assets/sounds/conteo.mp3");
const soundStart = new Audio("/assets/sounds/startGame.mp3");
const soundMove = new Audio("/assets/sounds/movefigure.mp3");
const soundFall = new Audio("/assets/sounds/fall.mp3");
const soundCompleteLine = new Audio("/assets/sounds/completeLine.mp3");
const soundCompleteLine2 = new Audio("/assets/sounds/completeLine2.mp3");
const soundBtnPaused = new Audio("/assets/sounds/buttonPaused.mp3");
const soundNoMoreFigure = new Audio("/assets/sounds/noMoreFigure.mp3");
const star = new Image(); // Imagen para celdas especiales
star.src = "/public/star.png";

// Segundos para empezar el juego
const seconds = [
  [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [null, null, null, null, 1, 1],
    [null, null, null, 1, 1, null],
    [null, null, 1, 1, 1, 1],
    [null, null, null, null, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [null, 1, 1, 1, 1, null],
  ], // 3
  [
    [null, 1, 1, 1, 1, null],
    [1, 1, 1, 1, 1, 1],
    [1, 1, null, null, 1, 1],
    [null, null, null, 1, 1, 1],
    [null, null, 1, 1, 1, null],
    [null, 1, 1, 1, null, null],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ], // 2
  [
    [1, 1, 1],
    [1, 1, 1],
    [null, 1, 1],
    [null, 1, 1],
    [null, 1, 1],
    [null, 1, 1],
    [null, 1, 1],
    [null, 1, 1],
  ], // 1
];

const blockCountX = 14; // Cantidad de columnas por fila
const blockCountY = 20; // Cantidad de filas
let medidasCanvas = Math.round(innerHeight / 2.2); // El canvas medirá un poco menos de la mitad del screen
let blockSize = Math.round(medidasCanvas / blockCountY + 3); // Medidas para cada celda

const figuras = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [1, 1, null],
    [null, 1, 1],
  ], // Z
  [
    [null, 1, 1],
    [1, 1, null],
  ], // S
  [
    [1, 1, 1],
    [null, 1, null],
  ], // T
  [
    [1, 1, 1],
    [1, null, null],
  ], // L
  [
    [1, 1, 1],
    [null, null, 1],
  ], // J
];

// Canvas, puntos, controles, modal de Juego pausado y Game Over
export function Game({ controls, gameState }) {
  const [over, setOver] = gameState; // Determina si el juego a acabado
  const canvas = useRef(null);
  const modalPaused = useRef(null); // Modal de Juego Pausado
  const btnSound = useRef(null); // Icono de sonido del modal de Juego Pausado
  const pointsGame = useRef(null); //Sección de puntos en tiempo real
  const newFigure = useRef(null); // Contenedor que indica la siguiente figura
  const fallEnabled = useRef(null); // Botón central del componente controles
  let ctx,
    gameOver, // Finaliza el juego
    gamePaused, // Indica que el juego esta pausado
    points = 0, // Puntos en tiempo real
    figura, // Primer figura
    cellNewFigure, // Figuras siguientes
    figurePaused, // Pausa la aparición de la nueva figura cuando colisiona
    timeStop, // Determina el tiempo que va a pasar para que vuelva a aparecer la nueva figura
    coorFigurebellow, // La coordenada 'Y' máxima de la figura actual
    itMayFall, // Indica si la figura puede caer en donde indique coorFigurebellow
    cuadricula = Array.from({ length: blockCountY }, () => Array(blockCountX).fill(null));
  let coorX, coorY, coorXPrevious; // Coordenadas y copia de 'X' para ejecutar el reflejo
  let updateTime, moreSpeed; // Hace caer en 'Y' la figura cuando updateTime >= moreSpeed
  let countMoreSpeed, // Tiempo que aumenta la velocidad de caída automática de la figura
    intervalTime, // Temporizador que actualiza countMoreSpeed
    countStopMove, // Tiempo que debe pasar para ejecutar la funcione mover
    moveTimeStop, // Temporizador que actualiza countStopMove
    sumTimeStop = 160; // Milisegundo para ejecutar moveTimeStop
  let soundsEnabled; // Habilita o deshabilita los sonidos

  useEffect(() => {
    if (canvas.current && !over && !ctx) {
      // Height del contenedor de la siguiente figura, medidas del canvas y estilos del liezo
      newFigure.current.style.height = `${2 * blockSize}px`;

      canvas.current.width = blockSize * blockCountX;
      canvas.current.height = blockSize * blockCountY;

      ctx = canvas.current.getContext("2d");
      ctx.scale(blockSize, blockSize);
      ctx.lineWidth = 0.15;
      ctx.strokeStyle = "black";

      startGame();
    }
  }, [over]);

  // Comienza el juego agregando en eventos, valores iniciales, comprueba si los sonidos están habilitados, comienza los temporizadores y dibuja la primer figura
  function startGame() {
    if (fallEnabled.current) {
      document.querySelectorAll(".controls button").forEach((btn) => (btn.disabled = true));
    }
    document.addEventListener("keydown", handleKeyDown);
    const btnPaused = document.querySelector(".status button");
    btnPaused.disabled = true;

    cuadricula = Array.from({ length: blockCountY }, () => Array(blockCountX).fill(null));
    gameOver = false;
    gamePaused = false;
    figurePaused = false;
    figura = obtenerFigura();
    coorX = Math.floor((blockCountX - figura[0].length) / 2);
    coorY = 0;
    coorXPrevious = coorX;
    coorFigurebellow = 0;
    itMayFall = true;
    updateTime = 0;
    moreSpeed = 70;
    countMoreSpeed = new Date();
    countMoreSpeed.setSeconds(0);
    countStopMove = new Date();
    countStopMove.setSeconds(0);

    if (localStorage.getItem("sounds-enabled") === null) {
      localStorage.setItem("sounds-enabled", true);
      soundsEnabled = true;
    } else {
      soundsEnabled = localStorage.getItem("sounds-enabled") === "true" ? true : false;
    }

    if (soundsEnabled) {
      soundGame.currentTime = 0;
      soundGame.volume = 0.2;
      soundGame.loop = true;
      soundGameOver.volume = 0.5;
      soundNoMoreFigure.volume = 0.4;
      soundCount.volume = 0.5;
      soundStart.volume = 0.5;
      soundMove.volume = 0.5;
      soundFall.volume = 0.5;
      soundCompleteLine.volume = 0.7;
      soundCompleteLine2.volume = 1;
      soundBtnPaused.volumne = 0.5;
    }

    // Muestra segundos para empezar el juego
    setTimeout(() => {
      let number = 0; // Índice del numero
      let secondsCoorY = Math.floor(blockCountY / 2 - 4); // Coordenada Y donde aparecerán

      const second = setInterval(() => {
        document.querySelectorAll(".cell--count").forEach((element) => element.classList.remove("cell--count")); // Borra los segundos

        if (number === seconds.length) {
          // Inicia el juego
          intervalTime = setInterval(() => countMoreSpeed.setSeconds(countMoreSpeed.getSeconds() + 1), 1000);
          moveTimeStop = setInterval(() => countStopMove.setSeconds(countStopMove.getSeconds() + 1), sumTimeStop);

          dibujarFigura();
          updateGame();
          showNewFigure();
          clearInterval(second);

          btnPaused.disabled = false;
          if (fallEnabled.current) {
            document.querySelectorAll(".controls button").forEach((btn) => (btn.disabled = false));
          }

          if (soundsEnabled === true) {
            soundStart.play();

            setTimeout(() => soundGame.play(), 1000);
          }
        } else {
          setTimeout(() => {
            let secondsCoorX = Math.floor(blockCountX / 2 - seconds[number][0].length / 2); // Coordenada X donde aparecen

            // Accede a las celdas del fondo de canvas para ir dibujando el numero mediante divs
            for (let fila = 0; fila < seconds[number].length; fila++) {
              for (let columna = 0; columna < seconds[number][fila].length; columna++) {
                if (seconds[number][fila][columna] === 1) {
                  const div = document.querySelector(
                    `.background__cell[data-x='${secondsCoorX + columna}'][data-y='${secondsCoorY + fila}']`
                  );

                  div.classList.add("cell--count");
                }
              }
            }

            if (soundsEnabled === true) {
              soundCount.currentTime = 0.6;
              soundCount.play();
            }

            number++;
          }, 100);
        }
      }, 1000);
    }, 250);
  }

  // Mantiene el juego actualizado y realiza acciones como mover figura en 'Y' y finalizar el juego
  function updateGame() {
    // Si no esta pausado el juego
    if (gamePaused === false) {
      if (gameOver) {
        // Desactiva temporizadores, eventos, elimina el reflejo de la figura, guarda los puntos en bases de datos al segundo de terminar para que se alcance a renderizar el componente GameOver
        clearInterval(moveTimeStop);
        removeClass("background-cell-down");
        document.removeEventListener("keydown", handleKeyDown);
        sessionStorage.setItem("score-game", points);
        newFigure.current.textContent = "";

        if (soundsEnabled === true) {
          soundGame.pause();
          soundNoMoreFigure.currentTime = 0.6;
          soundNoMoreFigure.play();
        }

        let fila = 0;
        const opacador = setInterval(() => {
          if (fila === cuadricula.length) {
            clearInterval(opacador);
            setOver(true);

            setTimeout(() => {
              if (localStorage.getItem("score-points")) {
                const previousRecord = parseInt(localStorage.getItem("score-points"));

                if (points > previousRecord) {
                  localStorage.setItem("score-points", points);
                }
              }
              if (!localStorage.getItem("score-points")) {
                localStorage.setItem("score-points", points);
              }

              points = 0;
              pointsGame.current.textContent = points;
            }, 1000);

            if (soundsEnabled === true) soundGameOver.play();
          } else {
            ctx.clearRect(0, fila, blockCountX, 1);

            for (let columna = 0; columna < cuadricula[fila].length; columna++) {
              if (cuadricula[fila][columna]) {
                ctx.globalAlpha = 0.5;

                ctx.fillStyle = cuadricula[fila][columna] === 1 ? "red" : "#0ff";
                ctx.fillRect(columna, fila, 1, 1);
                if (cuadricula[fila][columna] === 2) ctx.drawImage(star, columna, fila, 1, 1);
                ctx.strokeRect(columna + 0.08, fila + 0.08, 1 - 0.16, 1 - 0.16);
              }
            }
          }

          fila++;
        }, 40);

        return;
      }

      // Mueve en 'Y' automáticamente, desactiva intervalos innecesarios y acelera la caída rápida y tiempo para llamar la función mover
      if (!figurePaused && updateTime >= moreSpeed) mover("y", 1, true);
      if (moreSpeed < 30) clearInterval(intervalTime);
      if (countMoreSpeed.getSeconds() >= 40 && moreSpeed >= 30) {
        countMoreSpeed.setSeconds(0);
        moreSpeed -= 10;
        sumTimeStop -= 12;

        clearTimeout(moveTimeStop);
        moveTimeStop = setInterval(() => countStopMove.setSeconds(countStopMove.getSeconds() + 1), sumTimeStop);
      }
      if (fallEnabled.current) {
        if (!itMayFall && fallEnabled.current.disabled === false) fallEnabled.current.disabled = true;
        else if (itMayFall && fallEnabled.current.disabled === true) fallEnabled.current.disabled = false;
      }

      updateTime++;
    }

    requestAnimationFrame(updateGame);
  }

  // Devuelve una figura aleatoria
  function obtenerFigura() {
    return pointsFigure(figuras[Math.floor(Math.random() * figuras.length)]);
  }

  // Devuelve la figura con celdas especiales que dan mas puntos
  function pointsFigure(figure) {
    let pointsDoubleMax = 2; // Máximo 2 celdas especiales por figura

    // Cada celda tiene una probabilidad del 30% de ser celdas especiales
    figure.forEach((fila, y) => {
      fila.forEach((columna, x) => {
        const pointsDeclarate = parseFloat((Math.random() * 1).toFixed(2));

        if (columna) {
          if (pointsDeclarate > 0.7 && pointsDoubleMax > 0) {
            figure[y][x] = 2;
            pointsDoubleMax--;
          } else figure[y][x] = 1;
        } else figure[y][x] = null;
      });
    });

    return figure;
  }

  // Dibuja la figura y la guarda en la cuadricula
  function dibujarFigura(color = "#efd71ff7") {
    figura.forEach((fila, y) => {
      fila.forEach((columna, x) => {
        if (columna !== null) {
          // Dibuja la figura y agrega la imagen a celdas especiales
          cuadricula[y + coorY][x + coorX] = columna;

          // ctx.fillStyle = columna === 1 ? color : "#0ff";
          ctx.fillStyle = columna === 1 ? color : "#0ff";
          ctx.fillRect(x + coorX, y + coorY, 1, 1);
          if (columna === 2) ctx.drawImage(star, x + coorX, y + coorY, 1, 1);
          ctx.strokeRect(x + coorX + 0.08, y + coorY + 0.08, 1 - 0.16, 1 - 0.16);
        }
      });
    });

    // Remueve la clase y deshabilita el botón de caída rápida cuando la figura llega a su punto máximo o agrega el reflejo cuando cambia coorX o cuando la figura se dibuja por primera vez
    if (
      coorY + figura.length - 1 === cuadricula.length - figura.length ||
      coorY + figura.length - 1 === coorFigurebellow
    ) {
      removeClass("background-cell-down");
      itMayFall = false;
    }
    if (coorXPrevious !== coorX || coorY === 0) calcularPuntoMaximo();
  }

  // Elimina la figura del canvas y de la matriz
  function eliminarFigura() {
    figura.forEach((fila, y) => {
      fila.forEach((columna, x) => {
        if (columna !== null) {
          cuadricula[y + coorY][x + coorX] = null;
          ctx.clearRect(x + coorX, y + coorY, 1, 1);
        }
      });
    });
  }

  // Muestra un reflejo de la figura actual en su coordenada 'Y' máximo que puede llegar
  function calcularPuntoMaximo() {
    // Borra el reflejo anterior
    removeClass("background-cell-down");

    // Obtiene los índices de las celdas ocupadas de la figura
    if (coorY + figura.length - 1 < cuadricula.length - figura.length) {
      const cCF = []; // Son las coordenadas de las celdas ocupadas mas bajas de la figura
      let coorReflejoY = 0;

      figura.forEach((fila, y) => {
        fila.forEach((columna, x) => {
          if (columna && figura[y + 1]) {
            if (figura[y + 1][x] === null) {
              cCF.push([x, y]);
            }
          } else if (columna) {
            cCF.push([x, y]);
          }
        });
      });

      // obtiene la coordenada máxima en 'Y'
      for (let fila = coorY + figura.length; fila < cuadricula.length; fila++) {
        if (coorReflejoY) break;

        for (let coorFigure = 0; coorFigure < cCF.length; coorFigure++) {
          if (
            fila === cuadricula.length - figura.length &&
            coorFigure === cCF.length - 1 &&
            cuadricula[cCF[coorFigure][1] + fila][cCF[coorFigure][0] + coorX] === null
          ) {
            // Cuando llega a la ultima fila de la cuadricula
            coorReflejoY = cuadricula.length - figura.length;
            break;
          } else if (cuadricula[cCF[coorFigure][1] + fila]) {
            if (cuadricula[cCF[coorFigure][1] + fila][cCF[coorFigure][0] + coorX] !== null) {
              // Cuando encuentra la primera celda ocupada
              coorReflejoY = fila - 1;
              break;
            }
          }
        }
      }

      if (coorY + figura.length - 1 < coorReflejoY) {
        // Dibuja el reflejo de la figura y guarda la coordenada máxima para la función puntoMaximo
        coorFigurebellow = coorReflejoY;
        itMayFall = true;

        figura.forEach((fila, y) => {
          fila.forEach((columna, x) => {
            if (columna) {
              const dataX = x + coorX;
              const dataY = y + coorReflejoY;
              const div = document.querySelector(`.background__cell[data-x='${dataX}'][data-y='${dataY}']`);

              setTimeout(() => div.classList.add("background-cell-down"), 1);
            }
          });
        });
      } else itMayFall = false; // Deshabilita el botón de caída rápida
    }
  }

  // Remueve clases de una lista de elementos como las del reflejo o cuando se elimina un fila completa
  function removeClass(clases) {
    document.querySelectorAll(`.${clases}`).forEach((element) => element.classList.remove(clases));
  }

  // Finaliza el juego si una nueva figura no puede ser mostrada
  function canShow() {
    for (let y = coorY; y - coorY < figura.length; y++) {
      for (let x = coorX; x - coorX < figura[y - coorY].length; x++) {
        if (cuadricula[y][x] && figura[y - coorY][x - coorX]) return false;
      }
    }

    return true;
  }

  // Determina si una figura es capaz de moverse en eje 'X, Y'
  function canMove(eje, val) {
    if (
      (eje === "x" && coorX + val >= 0 && coorX + figura[0].length - 1 + val < blockCountX) ||
      (eje === "y" && coorY + figura.length < blockCountY)
    ) {
      // No se ejecuta si la figura esta en los limites del canvas
      const move = [];

      for (let y = coorY; y < coorY + figura.length; y++) {
        for (let x = coorX; x < coorX + figura[0].length; x++) {
          if (eje === "x" && figura[y - coorY][x - coorX] && cuadricula[y][x + val] === null) {
            move.push([y, x + val]);
            break; // Guarda las nuevas coordenadas en 'X' si las celdas + o - 1 están vacías
          }

          if (eje === "y" && figura[y - coorY][x - coorX]) {
            if (cuadricula[y + val]) {
              if (figura[y - coorY + val]) {
                if (figura[y - coorY + val][x - coorX]) continue; // Cuando la figura tiene la celda 'X' en diferentes 'Y' ocupada, Ejemplo: figura[0][0] = 1, figura[1][0] = 1;
              }
              if (cuadricula[y + val][x] === null) move.push([y + val, x]); // Guarda las nuevas coordenadas en 'Y' si las celdas + 1 están vacías
            } else if (y + val === cuadricula.length || cuadricula[y + val][x]) return false; // Indica que no se puede mover si llega al limite del canvas o si la celda de la cuadricula esta ocupada
          }
        }
      }

      // Si los longitudes coinciden indica que se puede mover
      if (eje === "x" && move.length === figura.length) return true;
      else if (eje === "y" && move.length === figura[0].length) return true;
      else return false;
    }
  }

  // Mueve o establece la figura, indica si el juego debe terminar y llama otras funciones
  async function mover(eje, val, isMoveAutomatic = false) {
    if (countStopMove.getSeconds() > 0) {
      const mover = canMove(eje, val);

      if (mover) {
        // Si la figura se puede mover se borra la posición, se actualizan las coordenadas, se dibuja en su nueva posición, y se reinicia el tiempo para volver a llamar la función
        eliminarFigura();

        coorXPrevious = coorX;
        eje === "x" ? (coorX += val) : (coorY += val);
        eje === "y" ? (updateTime = 0) : null;

        dibujarFigura("#efd71ff7");

        if (soundsEnabled === true) soundMove.play();
        if (isMoveAutomatic === false) countStopMove.setSeconds(0); // Reseta el conteo si el movimiento no fue automático (Función updateGame)
      } else if (eje === "y" && !mover) {
        // Si no se puede mover se pintara de color rojo y se establece la nueva figura y nuevas coordenadas
        eliminarFigura();
        dibujarFigura("red");

        figura = cellNewFigure;
        coorX = Math.floor((blockCountX - figura[0].length) / 2);
        coorY = 0;
        updateTime = 0;

        if (canShow()) {
          // Si la nueva figura se puede mostrar, se verifica si hay filas llenas y luego se establecen algunos valores, se muestra la siguiente figura y regresan los eventos
          await new Promise(() => {
            deleteRow();

            setTimeout(() => {
              newFigure.current.textContent = "";
              figurePaused = false;
              updateTime = 0;

              showNewFigure();
              dibujarFigura();
              document.addEventListener("keydown", handleKeyDown);

              if (fallEnabled.current) {
                document.querySelectorAll(".controls .controls__btn").forEach((btn) => (btn.disabled = false));
              }
              if (isMoveAutomatic === false) countStopMove.setSeconds(0);
            }, timeStop);
          });
        } else {
          gameOver = true;
          return; // Finaliza el juego
        }
      }
    }
  }

  // Verifica si hay filas enteras ocupadas, si es que hay las elimina y suma los puntos
  function deleteRow() {
    document.removeEventListener("keydown", handleKeyDown);
    timeStop = 100; // 100 milisegundos si no hay ninguna fila llena
    let sumPoints = points; // Puntos actuales
    let filasBorradas = 0; // Hace un conteo de las filas borradas para ver que audio va a sonar

    for (let row = 0; row < cuadricula.length; row++) {
      if (cuadricula[row].every((val) => !!val)) {
        figurePaused = true; // Detiene la caída automática de las figuras
        timeStop = 1000; // 1 segundo si hay una fila llena
        filasBorradas++;

        cuadricula[row].forEach((point) => (points += point === 1 ? 13 : 19)); // Suma los puntos de las celdas comunes y especiales

        cuadricula.splice(row, 1); // Borra la fila
        cuadricula.unshift(Array.from({ length: blockCountX }).fill(null)); // Agrega una nueva al principio
        ctx.clearRect(0, row, blockCountX, 1); // Borra la fila en el canvas

        // Activa el sunido
        if (soundsEnabled === true) {
          if (filasBorradas === 1) soundCompleteLine.play();
          if (filasBorradas === 3) {
            soundCompleteLine2.currentTime = 0.2;
            soundCompleteLine2.play();
          }
        }

        // Anima todas las columnas de la fila
        document.querySelectorAll(`.background__cell[data-y='${row}']`).forEach((cell) => {
          setTimeout(() => cell.classList.add("background-cell-delete"), 0.0001);
        });

        // Dibuja las celdas ocupadas en su nueva posición
        setTimeout(() => {
          ctx.clearRect(0, 0, blockCountX, row + 1);

          for (let y = 0; y <= row; y++) {
            for (let x = 0; x < blockCountX; x++) {
              if (cuadricula[y][x]) {
                ctx.fillStyle = "red";
                ctx.fillRect(x, y, 1, 1);
                if (cuadricula[y][x] === 2) ctx.drawImage(star, x, y, 1, 1);
                ctx.strokeRect(x + 0.08, y + 0.08, 1 - 0.16, 1 - 0.16);
              }
            }
          }
        }, 500);
      }
    }

    setTimeout(() => {
      removeClass("background-cell-delete"); // Desactiva la animación de filas borradas

      if (sumPoints !== points) {
        // Anima el incremento de puntos
        let sumador = setInterval(() => {
          if (sumPoints === points) clearInterval(sumador);
          else {
            pointsGame.current.textContent = sumPoints;
            sumPoints++;
          }
        }, 5);
      }
    }, 500);
  }

  // Rota la figura si es que puede hacerlo
  function rotarFigura() {
    let comodinX = 0; // Índices de la figuraRotada
    const figuraRotada = [];

    // Rota la figura empezando en la ultima columna hasta la primera
    for (let y = 0; y < figura.length; y++) {
      for (let x = figura[y].length - 1; x >= 0; x--) {
        !figuraRotada[comodinX] ? (figuraRotada[comodinX] = [figura[y][x]]) : figuraRotada[comodinX].push(figura[y][x]);

        x - 1 !== -1 ? (comodinX += 1) : (comodinX = 0);
      }
    }

    const yLess = figura.length - figuraRotada.length;
    if (cuadricula[coorY + yLess] && coorX + figuraRotada[0].length - 1 < cuadricula[0].length) {
      // Verifica si la fila existe y si la columna de la figura rotada no sobrepasa los limites del canvas
      eliminarFigura();

      if (cuadricula[coorY + yLess][coorX + figuraRotada.length - 1] === null) {
        // Verifica si las celdas de la figura rotada están vacías en la cuadricula, si no están la figura no rota
        for (let y = 0; y < figuraRotada.length; y++) {
          for (let x = 0; x < figuraRotada[y].length; x++) {
            if (cuadricula[coorY + y + yLess][coorX + x] !== null && figuraRotada[y][x]) {
              dibujarFigura();
              return;
            }
          }
        }

        // Si todas están vacías se establece la coordenada 'Y' fija actual y se dibuja la la figura
        figura = figuraRotada;
        coorY += yLess;
        dibujarFigura();
        calcularPuntoMaximo();
      }
    }
  }

  // Mueve la figura hasta su punto máximo en 'Y' fila por fila si es que puede bajar
  function puntoMaximo() {
    if (itMayFall && !figurePaused && countStopMove.getSeconds() > 0) {
      // Deshabilita los botones, remueve eventos, caída automática y borra la figura
      removeClass("background-cell-down");
      if (fallEnabled.current) {
        document.querySelectorAll(".controls .controls__btn").forEach((btn) => (btn.disabled = true));
      }
      if (soundsEnabled) {
        soundFall.currentTime = 0.95;
        soundFall.playbackRate = 0.6;
        soundFall.play();
      }

      document.removeEventListener("keydown", handleKeyDown);
      figurePaused = true;
      eliminarFigura();

      const milisecond = 200 / (coorFigurebellow - coorY); // No importa la cantidad de filas de distancia entre la figura y el punto máximo, siempre va a tardar 200ms en llegar a el

      // Baja la figura fila por fila
      const intervalo = setInterval(() => {
        if (coorY === coorFigurebellow) {
          // Regresa todo como estaba en la función mover
          mover("y", 1);
          clearInterval(intervalo);
        } else {
          eliminarFigura(); // Borra la posición anterior
          coorY++;
          dibujarFigura(); // Dibuja la nueva posición
        }
      }, milisecond);
    }
  }

  // Dibuja la siguiente figura al lado de los puntos
  function showNewFigure() {
    cellNewFigure = obtenerFigura(); // Obtiene la siguiente figura

    // Da las dimensiones y celdas en css al contenedor
    newFigure.current.style.width = `${cellNewFigure[0].length * blockSize}px`;
    newFigure.current.style.height = `${cellNewFigure.length * blockSize}px`;
    newFigure.current.style.marginBottom = `${cellNewFigure.length === 1 ? blockSize : 0}px`;
    newFigure.current.style.gridTemplateColumns = `repeat(${cellNewFigure[0].length}, 1fr)`;
    newFigure.current.style.gridTemplateRows = `repeat(${cellNewFigure.length}, 1fr)`;

    // Agrega los estilos parecidos del canvas a los hijos y animación de flasheo a celdas especiales
    for (let y = 0; y < cellNewFigure.length; y++) {
      for (let x = 0; x < cellNewFigure[y].length; x++) {
        const div = document.createElement("div");

        div.classList.add(cellNewFigure[y][x] ? "occupied_cell" : "empty_cell");
        if (cellNewFigure[y][x] === 2) div.style.animation = "cell_flash .7s infinite";

        newFigure.current.appendChild(div);
      }
    }
  }

  // Indica la accion basada en los eventos de teclado
  function handleKeyDown(e) {
    const keyDown = e.code;

    // Mover en eje 'X, Y', rotar y establecer la figura a su punto Y máximo
    if (keyDown === "ArrowUp") rotarFigura();
    else if (countStopMove.getSeconds() > 0) {
      if (keyDown === "ArrowLeft") mover("x", -1);
      else if (keyDown === "ArrowRight") mover("x", 1);
      else if (keyDown === "ArrowDown") mover("y", 1);
      else if (keyDown === "Space" && coorY + figura.length - 1 < coorFigurebellow) puntoMaximo();
    }
  }

  // Muestra el modal remueve eventos y detiene temporizadores
  function handleModalPause() {
    if (gamePaused === false) {
      // Pausado
      if (soundsEnabled === true) soundBtnPaused.play();

      document.removeEventListener("keydown", handleKeyDown);
      gamePaused = true;

      modalPaused.current.style.display = "grid";
      btnSound.current.classList.add(soundsEnabled === true ? "green" : "red"); // Si el icono esta habilitado o no

      clearInterval(intervalTime);
      clearInterval(moveTimeStop);
    } else if (gamePaused === true) {
      // No pausado
      document.addEventListener("keydown", handleKeyDown);
      gamePaused = false;

      modalPaused.current.style.display = "none";

      intervalTime = setInterval(() => countMoreSpeed.setSeconds(countMoreSpeed.getSeconds() + 1), 1000);
      moveTimeStop = setInterval(() => countStopMove.setSeconds(countStopMove.getSeconds() + 1), sumTimeStop);
    }
  }

  // Habilita o deshabilita los sonidos en el juego
  function setSoundsGame() {
    soundsEnabled = soundsEnabled === true ? false : true;

    btnSound.current.classList.remove(soundsEnabled === true ? "red" : "green");
    btnSound.current.classList.add(soundsEnabled === true ? "green" : "red");
    localStorage.setItem("sounds-enabled", soundsEnabled);

    if (soundsEnabled === true) {
      soundGame.currentTime = 0;
      soundGame.play();
    } else if (soundsEnabled === false) soundGame.pause();
  }

  return (
    <div className="game__tetris">
      <div className="pausedBackground" ref={modalPaused}>
        <div className="paused__panel">
          <h1>Game Paused</h1>
          <button
            onClick={() => {
              handleModalPause();
            }}
            role="button"
            aria-label="Continuar Juego"
          >
            Continue
          </button>
          <button
            onClick={() => {
              gameOver = true;
              handleModalPause();
            }}
            role="button"
            aria-label="Resetear Juego"
          >
            Reset
          </button>
          <button
            className="material-symbols-outlined panel_btn_sound"
            onClick={() => {
              setSoundsGame();
            }}
            ref={btnSound}
            role="button"
            aria-label="Volumen"
          >
            volume_up
          </button>
        </div>
      </div>
      <StatusGame points={points} pointsGame={pointsGame} newFigure={newFigure} modal={handleModalPause} />
      <div
        className="background"
        style={{ width: `${blockSize * blockCountX + 2}px`, height: `${blockSize * blockCountY + 2}px` }}
      >
        {cuadricula.map((fila, filaIndex) => {
          return fila.map((_, columnaIndex) => {
            return (
              <div
                key={`${filaIndex}-${columnaIndex}`}
                className="background__cell"
                data-x={columnaIndex}
                data-y={filaIndex}
              ></div>
            );
          });
        })}
        <canvas className="tetris" ref={canvas}></canvas>
      </div>
      {controls ? <GameControls functions={[mover, rotarFigura, puntoMaximo]} button={fallEnabled} /> : []}
      {over ? <GameOver setOver={setOver} /> : null}
    </div>
  );
}

function StatusGame({ points, pointsGame, newFigure, modal }) {
  // Indica los puntos, la próxima figura y el botón de pausa

  return (
    <div className="status">
      <h4 style={{ fontSize: `${blockSize * 1.3}px` }}>
        Score:{" "}
        <span className="status_points_game" ref={pointsGame}>
          {points}
        </span>
      </h4>
      <div className="status__figure" ref={newFigure}></div>
      <button
        className="material-symbols-outlined paused"
        style={{
          fontSize: `${blockSize * 1.2}px`,
          padding: `${blockSize / 2.5}px`,
        }}
        onClick={() => {
          modal();
        }}
      >
        {" "}
        pause
      </button>
    </div>
  );
}

export function GameControls({ functions, button }) {
  // Los controles adaptados para mobiles
  const [mover, rotarFigura, puntoMaximo] = functions;

  return (
    <div className="controls">
      <button
        className="controls__btn rotate material-symbols-outlined"
        onClick={() => {
          rotarFigura();
        }}
        role="button"
      >
        Autorenew
      </button>
      <button
        className="controls__btn left material-symbols-outlined"
        onClick={() => {
          mover("x", -1);
        }}
        onTouchStart={() => {
          mover("x", -1);
        }}
        role="button"
      >
        Keyboard_Arrow_Left
      </button>
      <button
        className="controls__btn fall material-symbols-outlined"
        ref={button}
        onClick={() => {
          puntoMaximo();
        }}
        role="button"
      >
        Keyboard_Double_Arrow_Down
      </button>
      <button
        className="controls__btn right material-symbols-outlined"
        onClick={() => {
          mover("x", 1);
        }}
        onTouchStart={() => {
          mover("x", 1);
        }}
        role="button"
      >
        Keyboard_Arrow_Right
      </button>
      <button
        className="controls__btn bottom material-symbols-outlined"
        onClick={() => {
          mover("y", 1);
        }}
        onTouchStart={() => {
          mover("y", 1);
        }}
        role="button"
      >
        Keyboard_Arrow_Down
      </button>
    </div>
  );
}

function GameOver({ setOver }) {
  // Modal de game over con interface dinámica dependiendo de los puntos
  const modal = useRef(null);
  const h2 = useRef(null);
  const gameScore = parseInt(sessionStorage.getItem("score-game"));
  const scorePoints = parseInt(localStorage.getItem("score-points"));
  let title = !scorePoints ? "Record Set" : gameScore <= scorePoints ? "Game Over" : "New Récord!!";
  let writeTitle = null;

  useEffect(() => {
    if (!writeTitle) {
      writeTitle = 1;

      setTimeout(() => {
        write();
      }, 300);
    }
  }, []);

  function write() {
    let indexLetter = 0;

    writeTitle = setInterval(() => {
      if (indexLetter === title.length) {
        clearInterval(writeTitle);

        modal.current.style.boxShadow = "0px 0px 15px 0px white";
      } else {
        h2.current.textContent += title[indexLetter];
        indexLetter++;
      }
    }, 100);
  }

  return createPortal(
    <div className="modal__score" aria-label="Juego Terminado">
      <div className="score" ref={modal}>
        <h2 ref={h2}></h2>
        <div className="score_points_container">
          <p>Points: {gameScore}</p>
          {!scorePoints ? null : gameScore > scorePoints ? <p>Previous Record: {scorePoints}</p> : null}
        </div>
        <button className="controls__btn" onClick={() => setOver(false)} role="button" aria-label="Jugar de nuevo">
          Play
        </button>
        <button
          className="controls__btn"
          onClick={() => {
            history.go(-1);
          }}
          role="button"
          aria-label="Salir"
        >
          Back
        </button>
      </div>
    </div>,
    document.querySelector(".root")
  );
}

StatusGame.propTypes = {
  points: PropTypes.number.isRequired,
  pointsGame: PropTypes.any.isRequired,
  newFigure: PropTypes.any.isRequired,
  modal: PropTypes.func.isRequired,
};

Game.propTypes = {
  controls: PropTypes.bool.isRequired,
  gameState: PropTypes.array.isRequired,
};

GameControls.propTypes = {
  functions: PropTypes.array.isRequired,
  button: PropTypes.object.isRequired,
};

GameOver.propTypes = {
  setOver: PropTypes.func.isRequired,
};
