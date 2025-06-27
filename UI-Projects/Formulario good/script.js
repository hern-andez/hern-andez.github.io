// Obtenemos el viewport menor y se lo damos de medidas al contenedor
const container = document.querySelector(".container");
const dimencion = innerHeight < innerWidth ? innerHeight : innerWidth;

container.style.width = `${dimencion - 50}px`;
container.style.height = `${dimencion - 50}px`;

// Crea 25 divs blanco transparentado y 25 negros para la animacion
const background = document.querySelector(".loggin__background");
const fragment = document.createDocumentFragment();
const angleInlination = 180 / 25; // Divide el 180 grados entre los 25 divs
let sumAngle = 0; // Empieza desde el grado 0 y va sumando

for (let i = 0; i < 25; i++) {
  const div = document.createElement("div"); // Blanco transparentado
  const divBlack = document.createElement("div"); // Negro

  div.classList.add("background__item");
  divBlack.classList.add("background_item_black");
  div.style.transform = `rotate(${sumAngle}deg)`;
  divBlack.style.transform = `rotate(${sumAngle + 10.7}deg)`; // Rota un poco mas para dar el efecto blanco, negro, blanco, negro...

  fragment.appendChild(div);
  fragment.appendChild(divBlack);
  sumAngle += angleInlination;
}
background.appendChild(fragment);

// Hace responsivo el formulario
window.addEventListener("resize", () => {
  const dimencion = innerHeight < innerWidth ? innerHeight : innerWidth;
  container.style.width = `${dimencion - 30}px`;
  container.style.height = `${dimencion - 30}px`;
});

// Animación del formulario
const formTitle = document.querySelector(".loggin__title");
const textTitle = "Login";
let index = 0;

setTimeout(() => {
  const interval = setInterval(() => {
    if (index === textTitle.length) {
      clearInterval(interval); // Al finalizar muestra el formulario y lo hace clickeable

      const form = document.querySelector(".loggin__form");
      form.style.opacity = 1;
      form.style.pointerEvents = "all";
    } else {
      formTitle.textContent += textTitle[index]; // Agrega el titulo letra por letra
      index++;
    }
  }, 200);
}, 900);
