const stockfish = new Worker("../stockfish/stockfish-17-single.js"); // Worker que ejecuta el análisis de tablero en segundo plano

self.onmessage = (event) => {
  stockfish.postMessage(event.data); // Manda la data obtenida al hook
};

stockfish.onmessage = (event) => {
  self.postMessage(event.data); // Manda la data al motor que empieza el análisis
};
