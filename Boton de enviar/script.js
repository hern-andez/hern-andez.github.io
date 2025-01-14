const btn = document.querySelector(".submitBtn");
let index = 0; // Índice de las lineas

btn.addEventListener("click", (e) => {
  const btnText = document.querySelector(".btn__text");
  const waitProcess = document.querySelector(".btn__load");
  const btnIcon = document.querySelector(".btn_circle_animation");

  // Apareciendo y animando elementos
  btnText.style.display = "none";
  btn.classList.add("submitBtn--animado");
  waitProcess.classList.add("wait--process");
  btnIcon.classList.add("btn--icon");

  // Animación de flecha en svg
  setTimeout(() => {
    const line1 = document.querySelector(".submitBtn_line_1");
    const line2 = document.querySelector(".submitBtn_line_2");

    dibujarLineas([line1, line2], 30, 50, 45, 70);
  }, 2000);

  // Oculta y elimina las animaciones
  setTimeout(() => {
    btnText.style.display = "inline";
    btn.classList.remove("submitBtn--animado");
    waitProcess.classList.remove("wait--process");
    btnIcon.classList.remove("btn--icon");
  }, 4950);
});

// Animación de dibujo de líneas necesita las líneas, coordenadas X, Y iniciales y finales
function dibujarLineas(lines, coorX, coorY, coorXExpect, coorYExpect) {
  // Obtiene el 5% de la coordenada finales para que la animación sea directa y fluida
  let sumCoorX = (coorXExpect - coorX) * 0.05;
  let sumCoorY = (coorYExpect - coorY) * 0.05;
  lines[index].style.opacity = 1;

  const formadorFigura = setInterval(() => {
    if (index === lines.length - 1 && coorX >= coorXExpect + sumCoorX && coorY >= coorYExpect + sumCoorY) {
      // Termina el restablece a estado inicial las líneas
      setTimeout(() => {
        lines[0].style.opacity = 0;
        lines[1].style.opacity = 0;

        lines[0].setAttribute("x2", "30%");
        lines[0].setAttribute("y2", "50%");
        lines[1].setAttribute("x2", "45%");
        lines[1].setAttribute("y2", "70%");

        index = 0;
      }, 3000);

      clearInterval(formadorFigura);
    } else if (coorX >= coorXExpect + sumCoorX && coorY >= coorYExpect + sumCoorY) {
      // Actualizar el estado para empezar a dibujar la segunda linea
      index++;
      clearInterval(formadorFigura);
      dibujarLineas(lines, 45, 70, 75, 35);
    } else {
      // Dibuja la linea
      lines[index].setAttribute("x2", `${coorX}%`);
      lines[index].setAttribute("y2", `${coorY}%`);

      coorX += sumCoorX;
      coorY += sumCoorY;
    }
  }, 13);
}
