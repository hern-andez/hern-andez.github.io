import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { Game } from "./tetrisGame/tetris";
import { GameModal } from "./App";
import "./tetris.css";

export function GameApp() {
  const [player, setPlayer] = useState(0); // Inicia el juego
  const [controls, setControls] = useState(false); // Activa los controles
  const [over, setOver] = useState(false); // Termina el juego

  return (
    <StrictMode>
      {player === 0 ? (
        <GameModal setPlayer={setPlayer} setControls={setControls} /> // Modal de inicio
      ) : (
        <div className="game__container" style={{ opacity: 1 }}>
          <Game controls={controls} gameState={[over, setOver]} />
        </div> // Todo en el juego
      )}
    </StrictMode>
  );
}

createRoot(document.querySelector(".root")).render(<GameApp />);
