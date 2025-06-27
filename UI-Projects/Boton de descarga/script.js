const btn = document.querySelector(".contenedor");
let index = 0;

btn.addEventListener("click", (e) => {
  const btnDownloader = document.querySelector(".btn_icon_downloader");
  const btnArrow = document.querySelector(".icon_downloader_arrow");
  const btnCanasta = document.querySelector(".icon_downloader_canasta");
  const btnProgress = document.querySelector(".btn__progress");
  const btnCheck = document.querySelector(".progress__icon");
  const btnProgressBar = document.querySelector(".progress__bar");
  const btnStatus = document.querySelector(".btn__status");
  const btnPercentage = document.querySelector(".status__percentage");

  // Elementos visibles y animados
  btnCanasta.style.display = "inline";
  btnProgress.style.display = "grid";
  btnStatus.style.display = "grid";
  btn.classList.add("contenedor-btn-escala");
  btnArrow.classList.add("icon-arrow-animation");
  btnDownloader.classList.add("icon-downloader-animation");
  btnProgress.classList.add("btn-progress-background");
  btnStatus.classList.add("btn-status-animation");

  // Animación de caja apareciendo
  setTimeout(() => {
    const lineUp = document.querySelector(".canasta__up");
    const lineLeft = document.querySelector(".canasta__left");
    const lineRight = document.querySelector(".canasta__right");
    const lineDownLeft = document.querySelector(".down--left");
    const lineDownRight = document.querySelector(".down--right");

    lineUp.style.padding = "1px 23px";

    setTimeout(() => {
      lineLeft.style.padding = "10px 1px";
      lineRight.style.padding = "10px 1px";

      setTimeout(() => {
        lineDownLeft.style.padding = "1px 23px 1px 0px";
        lineDownRight.style.padding = "1px 0px 1px 23px";

        setTimeout(() => {
          lineUp.style.padding = "0";
          lineLeft.style.padding = "0";
          lineRight.style.padding = "0";
          lineDownLeft.style.padding = "0";
          lineDownRight.style.padding = "0";
        }, 5050);
      }, 300);
    }, 300);
  }, 350);

  // Anima secciones del botón y restablece todo a su estado inicial
  let porcentage = 0;
  setTimeout(() => {
    btnCheck.style.display = "inline";

    const estado = setInterval(() => {
      if (porcentage === 100) {
        // Regresa a su estado inicial
        clearInterval(estado);

        setTimeout(() => {
          btnProgressBar.style.height = `0px`;
          btnProgress.style.display = "none";
          btnCanasta.style.display = "none";
          btnCheck.style.display = "none";
          btnStatus.style.display = "none";
          btn.classList.remove("contenedor-btn-escala");
          btnArrow.classList.remove("icon-arrow-animation");
          btnDownloader.classList.remove("icon-downloader-animation");
          btnProgress.classList.remove("btn-progress-background");

          btnPercentage.textContent = "0%";
        }, 2800);
      }

      // Incrementa la barra de progreso y el status
      btnProgressBar.style.height = `${porcentage}%`;
      btnPercentage.textContent = `${porcentage}%`;
      porcentage++;
    }, 25);
  }, 600);

  // Animación de palomita formándose
  setTimeout(() => {
    // Coordenadas y porcentajes para que la animación sea fluida y lineal
    const line1 = document.querySelector(".icon_line_1");
    const line2 = document.querySelector(".icon_line_2");

    dibujarLineas([line1, line2], 30, 50, 45, 70);
  }, 2750);
});

function dibujarLineas(lines, coorX, coorY, coorXExpect, coorYExpect) {
  // Saca el 5% de el valor esperado para lograr una animación fluida
  let coorXSum = (coorXExpect - coorX) * 0.05;
  let coorYSum = (coorYExpect - coorY) * 0.05;
  lines[index].style.opacity = 1;

  const formarPalomita = setInterval(() => {
    if (index === lines.length - 1 && coorX >= coorXExpect && coorY >= coorYExpect) {
      // Termina la animación y regresa a su estado inicial
      setTimeout(() => {
        lines[0].style.opacity = 0;
        lines[1].style.opacity = 0;

        lines[0].setAttribute("x2", "30%");
        lines[0].setAttribute("y2", "50%");
        lines[0].setAttribute("x2", "45%");
        lines[1].setAttribute("y2", "70%");

        index = 0;
      }, 3024);
      clearInterval(formarPalomita);
    } else if (coorX >= coorXExpect && coorY >= coorYExpect) {
      // Dibujar la siguiente linea
      index++;
      clearInterval(formarPalomita);
      dibujarLineas(lines, 45, 70, 75, 35);
    } else {
      // Dibuja la linea
      lines[index].setAttribute("x2", `${coorX}%`);
      lines[index].setAttribute("y2", `${coorY}%`);

      coorX += coorXSum;
      coorY += coorYSum;
    }
  }, 13);
}
