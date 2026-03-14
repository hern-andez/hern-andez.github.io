import gsap from "gsap";

const btn = document.querySelector(".submitBtn");
const btnText = document.querySelector(".btn__text");
const waitProcess = document.querySelector(".btn__load");
const btnIcon = document.querySelector(".btn_circle_animation");
let isAnimating = false; // Índice de las lineas

// Animación de botón encogiendose
const btnAnimationTl = gsap.timeline({ paused: true });
btnAnimationTl.to(btn, {
  duration: 0.3,
  width: "92px",
  color: "transparent",
  ease: "power2.inOut",
  onComplete: () => circleProcessTl.play("expand"),
  onReverseComplete: () => {
    waitProcess.style.setProperty("--progress", "0%");
    animate();
  },
});

// Animación de relleno blanco en el centro del botón
const circleProcessTl = gsap.timeline({ paused: true });
circleProcessTl
  .addLabel("expand")
  .to(btnIcon, {
    duration: 0.25,
    width: "60px",
    height: "60px",
    onComplete: () => processTl.restart(),
  })
  .addPause("success")
  .to(btnIcon, {
    duration: 0.25,
    backgroundColor: "#044fea",
    onComplete: () => checkTl.restart(),
  });

// Animación de proceso de envió
let loadPercentage = { value: 0 };
const processTl = gsap.timeline({ paused: true });
processTl.to(loadPercentage, {
  duration: 2.1,
  ease: "none",
  value: 100,
  onUpdate: () => waitProcess.style.setProperty("--progress", `${loadPercentage.value}%`),
  onComplete: () => circleProcessTl.play("success"),
});
// Envió exitoso

// Animación de la palomita
const dataLines = { duration: 0.2, opacity: 1, ease: "none" };
const checkTl = gsap.timeline({ paused: true });
checkTl
  .to(".submitBtn_line_1", { ...dataLines, attr: { x2: `45%`, y2: `70%` } })
  .to(".submitBtn_line_2", {
    ...dataLines,
    attr: { x2: `75%`, y2: `35%` },
    onReverseComplete: () => {
      circleProcessTl.revert();
      processTl.revert();
      btnAnimationTl.reverse();
    },
  })
  .to({}, { delay: 1, onComplete: () => checkTl.reverse() });

// Comienza la animación
const startTl = gsap.timeline({ paused: true });
startTl.to(null, {
  onStart: () => {
    animate();
    btnAnimationTl.restart();
  },
});

/**
 * Inicia o finaliza con la animación
 */
function animate() {
  isAnimating = !isAnimating;

  btnText.style.display = isAnimating ? "none" : "inline";
  btn.classList.toggle("submitBtn--animado");
  waitProcess.classList.toggle("wait--process");
  btnIcon.classList.toggle("btn--icon");
}

btn.addEventListener("click", () => {
  if (isAnimating) return;

  startTl.restart();
});
