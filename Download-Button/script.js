import gsap from "gsap";

const btn = document.querySelector(".contenedor");

const btnArrow = btn.querySelector(".icon_downloader_arrow");
const btnProgressBar = btn.querySelector(".progress__bar");
const btnPercentage = btn.querySelector(".status__percentage");
const btnProgress = btn.querySelector(".btn__progress");
const btnCheck = btn.querySelector(".progress__icon");
const btnStatus = btn.querySelector(".btn__status");
const btnCanasta = btn.querySelector(".icon_downloader_canasta");

// Animación de contenedor expandiéndose
const containerTl = gsap.timeline({ paused: true });
containerTl.to(btn, {
  duration: 0.5,
  width: "270px",
  height: "90px",
  onStart: () => {
    showSectionsTl.restart();
    showBoxTl.restart();
    arrowAnimationTl.restart();
    processTl.restart();
  },
  onReverseComplete: () => {
    processTl.revert();
    animate();
    btnProgressBar.style.height = `0%`;
    btnPercentage.textContent = "0%";
  },
});

// Muestra El contenido del botón
const showSectionsTl = gsap.timeline({ paused: true });
showSectionsTl.to(".btn-content-box", { duration: 0.45, backgroundColor: "#fff", flex: "0 0 90px" });

// Animación de caja apareciendo bajo la flecha
const showBoxTl = gsap.timeline({ paused: true });
showBoxTl
  .to(".line--up", { duration: 0.25, padding: "1px 50%" })
  .to(".line--side", { duration: 0.25, padding: "25% 1px" })
  .to(".line--down", { duration: 0.25, padding: "1px 25%" });

// Animación de flecha subiendo y bajando
const arrowAnimationTl = gsap.timeline({ yoyo: true, repeat: Infinity, paused: true });
arrowAnimationTl
  .to(btnArrow, { duration: 0.5, ease: "none", top: "10px" })
  .to(btnArrow, { duration: 0.5, ease: "none", top: "0px" });

// Animación de la barra de progreso
let porcentage = { value: 0 };
const processTl = gsap.timeline({ paused: true });

processTl.to(porcentage, {
  duration: 2.5,
  delay: 0.8,
  value: 100,
  onUpdate: () => {
    // Incrementa la barra de progreso y el status
    btnProgressBar.style.height = `${porcentage.value}%`;
    btnPercentage.textContent = `${Math.trunc(porcentage.value)}%`;
  },
  onComplete: () => {
    // Reinicia el valor y ejecuta la animación de la palomita
    porcentage.value = 0;
    checkTl.restart();
  },
});

// Coordenadas de destino de las líneas svg que forman la palomita
const [line1, line2] = [
  [`${45}%`, `${70}%`],
  [`${75}%`, `${35}%`],
];
const properties = { duration: 0.2, ease: "steps(20)", opacity: 1 }; // Propiedades de cada linea
const checkTl = gsap.timeline({ paused: true }); // Animación de la palomita

checkTl
  .to(".icon_line_1", {
    ...properties,
    attr: { x2: line1[0], y2: line1[1] },
    onReverseComplete: () => {
      arrowAnimationTl.revert();
      showBoxTl.reverse();
      showSectionsTl.reverse();
      containerTl.reverse();
    },
  })
  .to(".icon_line_2", { ...properties, attr: { x2: line2[0], y2: line2[1] } })
  .to({}, { duration: 0.5, delay: 1.5, onStart: () => checkTl.reverse() });

// Comienza la animación de los componentes
const startTl = gsap.timeline({ paused: true });
startTl.to({}, { onStart: () => containerTl.restart() });

let stateAnimation = "start"; // Empieza la animación

/**
 * Empieza o finaliza la animación
 */
function animate() {
  const isInline = stateAnimation === "start" ? "inline" : "none";
  const isGrid = stateAnimation === "start" ? "grid" : "none";

  btnCanasta.style.display = isInline;
  btnProgress.style.display = isGrid;
  btnCheck.style.display = isInline;

  btn.classList.toggle("btn--animated");
  btnArrow.classList.toggle("icon-arrow-animation");
  btnStatus.classList.toggle("btn-status-animation");

  stateAnimation = stateAnimation === "start" ? "end" : "start";
}

btn.addEventListener("click", (e) => {
  const elements = [!btnProgressBar, !btnArrow, !btnCanasta, !btnProgress, !btnCheck, !btnStatus, !btnPercentage];
  if (elements.some((i) => i === true)) return;

  animate();
  startTl.restart();
});
