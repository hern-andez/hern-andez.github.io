document.addEventListener("DOMContentLoaded", (e) => {
  const btn = document.querySelector(".contenedor--btn");

  btn.addEventListener("click", (e) => {
    console.time();
    const btnDownloader = document.querySelector(".btn-icon-downloader");
    const btnArrow = document.querySelector(".icon-downloader-arrow");
    const btnCanasta = document.querySelector(".icon-downloader-canasta");
    const btnProgress = document.querySelector(".btn--progress");
    const btnCheck = document.querySelector(".progress--icon");
    const btnProgressBar = document.querySelector(".progress--bar");
    const btnStatus = document.querySelector(".btn--status");
    const btnPercentage = document.querySelector(".status--percentage");

    btnCanasta.style.display = "inline";
    btnProgress.style.display = "grid";
    btnStatus.style.display = "grid";
    btn.classList.add("contenedor-btn-escala");
    btnArrow.classList.add("icon-arrow-animation");
    btnDownloader.classList.add("icon-downloader-animation");
    btnProgress.classList.add("btn-progress-background");
    btnStatus.classList.add("btn-status-animation");

    let porcentage = 0;
    setTimeout(() => {
      btnCheck.style.display = "inline";

      const estado = setInterval(() => {
        if (porcentage === 100) {
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
            console.timeEnd();
          }, 2800);
        }

        btnProgressBar.style.height = `${porcentage}%`;
        btnPercentage.textContent = `${porcentage}%`;
        porcentage++;
      }, 25);
    }, 600);
  });
});
