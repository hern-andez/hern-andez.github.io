const buttons = document.querySelectorAll(".lugar__icon"); // Iconos

// Agregar eventos de
buttons.forEach((element) => {
  element.addEventListener("pointerenter", animate);
  element.addEventListener("pointerleave", animate);
});

/**
 * Empieza o finaliza con la animación
 */
function animate(e) {
  const target = e.target.closest(".lugar__icon");

  if (!target) return;

  // Elementos
  const container = e.target;
  const reflect = container.querySelector(".effect__icon");
  const icon = container.querySelector(".icon");

  //Clases
  container.classList.toggle("btn_container-animation");
  reflect.classList.toggle("btn_animation-reflect");
  icon.classList.toggle("icon--animation");
}

// Agrega eventos de mouse y táctiles al contenedor del fondo e icono para agregar clases de animación a los hijos
