document.addEventListener("DOMContentLoaded", (e) => {
  const btn = document.querySelector(".btn-animation");

  btn.addEventListener("click", (e) => {
    const waitProcess = btn.lastElementChild;
    const btnText = document.querySelector(".btn-text");

    btnText.style.display = "none";
    btn.classList.add("btn-animado");
    waitProcess.classList.add("wait-process");
    btnText.nextElementSibling.classList.add("btn-circle");

    setTimeout(() => {
      const btnIcon = btnText.nextElementSibling.firstElementChild;

      btnIcon.textContent = "check";
      btnIcon.classList.add("btn-circle-icon");
    }, 500);

    setTimeout(() => {
      const btnIcon = document.querySelector(".btn-circle-icon");

      btnIcon.textContent = "";
      btnText.style.display = "inline";
      btn.classList.remove("btn-animado");
      waitProcess.classList.remove("wait-process");
      btnText.nextElementSibling.classList.remove("btn-circle");
      btnIcon.classList.remove("btn-circle-icon");
    }, 4950);
  });
});
