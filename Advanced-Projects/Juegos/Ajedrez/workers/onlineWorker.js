self.addEventListener("message", (e) => {
  const type = e.data.type; // Deside que accion hacer dependiendo del type

  if (type === "SEARCH") searchEnemy(e.source, e.data.name, e.data.clients);
  else if (type === "LINK") linkGame(e.data.ids, e.data.name);
  else if (type === "START") startGame(e.data.ids);
  else if (type === "BREAK") breakLink(e.data.id, e.data.name);
  else if (type === "CANCEL") cancel(e.source.id, e.data.clients);
  else if (type === "CANCEL_REQUEST") cancelRequest(e.data.id);
});

// Función que devuelve los clientes activos controlados por el sW
async function returnClients() {
  return (controllerClients = await self.clients.matchAll({ includeUncontrolled: true, type: "window" }));
}

// Busca clientes diferentes al que empezó el enlace
async function searchEnemy(myClient, name, clients) {
  const controllerClients = await returnClients();
  controllerClients.forEach((client) => {
    if (myClient.id !== client.id && !clients.some((id) => id === client.id)) {
      myClient.postMessage({ type: "CLIENT_FOUND", id: client.id });
      client.postMessage({ type: "SEARCH", ids: [client.id, myClient.id], nameWhite: name });
    }
  });
}

// Envía la data al que empezó el enlace
async function linkGame(ids, name) {
  const controllerClients = await returnClients();
  controllerClients.forEach((client) => {
    if (client.id === ids[1]) client.postMessage({ type: "LINK", ids: [ids[1], ids[0]], nameBlack: name });
  });
}

// Envía la data a los 2 clientes enlazados
async function startGame(ids) {
  const controllerClients = await returnClients();
  controllerClients.forEach((client) => {
    if (ids.includes(client.id)) client.postMessage({ type: "START", channel: `${ids[0]}_${ids[1]}` });
  });
}

// Busca el cliente diferente al que rompió el enlace
async function breakLink(id, name) {
  const controllerClients = await returnClients();
  controllerClients.forEach((client) => {
    if (client.id === id) client.postMessage({ type: "BREAK", namePlayer: name });
  });
}

// Cancela la petición cuando el conteo llega a 0
async function cancel(id, clients) {
  const controllerClients = await returnClients();
  controllerClients.forEach((client) => {
    if (id !== client.id && clients.some((idClient) => idClient === client.id))
      client.postMessage({ type: "CANCEL", id });
  });
}

// Cancela el enlace cuando el cliente que lo empezó ya se enlazo a otro cliente
async function cancelRequest(id) {
  const controllerClients = await returnClients();
  controllerClients.forEach((client) => {
    if (id === client.id) client.postMessage({ type: "CANCELREQUEST", id });
  });
}
