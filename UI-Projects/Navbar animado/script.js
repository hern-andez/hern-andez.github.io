const buttons = document.querySelectorAll(".lugar__icon");

buttons.forEach((element) => {
  element.addEventListener("touchstart", handleEnter);
  element.addEventListener("touchend", handleExit);
  element.addEventListener("mouseenter", handleEnter);
  element.addEventListener("mouseleave", handleExit);
});

function handleEnter(e) {
  const target = e.target.closest(".lugar__icon");

  if (!target) return;
  const container = e.target;
  const reflect = container.firstElementChild;
  const button = container.lastElementChild;

  container.classList.add("btn_container-animation");
  reflect.classList.add("btn_animation-reflect");
  button.classList.add("icon--animation");
}

function handleExit(e) {
  const container = e.target;
  const reflect = container.firstElementChild;
  const button = container.lastElementChild;

  container.classList.remove("btn_container-animation");
  reflect.classList.remove("btn_animation-reflect");
  button.classList.remove("icon--animation");
}

// Agrega eventos de mouse y táctiles al contenedor del fondo e icono para agregar clases de animación a los hijos
