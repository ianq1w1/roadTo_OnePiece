
  const graph = {
    nodes: [],
    edges: [
      { source: 'wano', target: 'dressrosa', weight: 5 },
      { source: 'dressrosa', target: 'punk hazard', weight: 2 },
      { source: 'punk hazard', target: 'homens-peixe', weight: 3 },
      { source: 'homens-peixe', target: 'wano', weight: 1 },
      { source: 'wano', target: 'egghead', weight: 5 },
      { source: 'egghead', target: 'whole cake', weight: 5 },
      { source: 'whole cake', target: 'punk hazard', weight: 2 },
    ],
    names: ['wano', 'dressrosa', 'punk hazard', 'homens-peixe', 'egghead', 'whole cake', 'elbaf'],
  };
  
  // Restante do código...
  
  // Função para inicializar o grafo com vértices em posições aleatórias
    // Função para gerar posições aleatórias
    function getRandomPosition() {
      return Math.floor(Math.random() * 300) + 50; // Ajuste conforme necessário
    }
    
  function initializeGraph() {
    for (let i = 0; i < 6; i++) {
      const name = graph.names[i];
      graph.nodes.push({ id: name, x: getRandomPosition(), y: getRandomPosition(), name });
    }
  }
  initializeGraph();
  
  let originNodeId = null;
  let destinationNodeId = null;
  

  

// Algoritmo de Dijkstra
function dijkstra(graph, startNodeId, targetNodeId) {
  // Inicialização de estruturas de dados
  const distances = {};
  const previous = {};
  const queue = [];

  // Inicializa as distâncias e predecessores
  for (const node of graph.nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    queue.push(node.id);
  }

  // A distância de startNodeId até ele mesmo é 0
  distances[startNodeId] = 0;

  // Algoritmo principal de Dijkstra
  while (queue.length > 0) {
    // Encontra o nó na fila com a menor distância conhecida
    let minDistance = Infinity;
    let current = null;

    for (const nodeId of queue) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        current = nodeId;
      }
    }

    // Remove o nó atual da fila
    const currentIndex = queue.indexOf(current);
    queue.splice(currentIndex, 1);

    // Atualiza as distâncias dos vizinhos do nó atual
    for (const edge of graph.edges) {
      if (edge.source === current || edge.target === current) {
        const neighborId = edge.source === current ? edge.target : edge.source;
        const newDistance = distances[current] + edge.weight;

        // Se encontrar um caminho mais curto para o vizinho, atualiza as informações
        if (newDistance < distances[neighborId]) {
          distances[neighborId] = newDistance;
          previous[neighborId] = current;
        }
      }
    }
  }

  // Reconstrói o caminho mínimo a partir do nó de destino
  const path = [];
  let current = targetNodeId;

  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
}

// Função para desenhar o caminho encontrado
function drawGraph() {
  const svg = document.getElementById('graph');
  svg.innerHTML = '';  // Limpa o conteúdo existente

  // Desenha as arestas
  graph.edges.forEach(edge => {
    const source = graph.nodes.find(node => node.id === edge.source);
    const target = graph.nodes.find(node => node.id === edge.target);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', source.x);
    line.setAttribute('y1', source.y);
    line.setAttribute('x2', target.x);
    line.setAttribute('y2', target.y);
    svg.appendChild(line);
  });

  // Desenha os vértices
  graph.nodes.forEach(node => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', 15);
    svg.appendChild(circle);

    // Adiciona texto com o nome do vértice
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y + 5); // Ajusta a posição vertical do texto
    text.setAttribute('text-anchor', 'middle');
    text.textContent = node.name;
    svg.appendChild(text);
  });
}


function drawPath(path) {
  const svg = document.getElementById('graph');
  const nodeElements = {};

  // Mapeia cada nó para o seu elemento SVG correspondente
  graph.nodes.forEach(node => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', 15);
    svg.appendChild(circle);
    nodeElements[node.id] = circle;
  });

  // Desenha o caminho
  for (let i = 0; i < path.length - 1; i++) {
    const sourceId = path[i];
    const targetId = path[i + 1];

    const source = nodeElements[sourceId];
    const target = nodeElements[targetId];

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', source.getAttribute('cx'));
    line.setAttribute('y1', source.getAttribute('cy'));
    line.setAttribute('x2', target.getAttribute('cx'));
    line.setAttribute('y2', target.getAttribute('cy'));
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);  // Adiciona a linha diretamente ao SVG
  }
}



// Inicialização
drawGraph();

let startNodeId = null;
let targetNodeId = null;


const svg = document.getElementById('graph');
svg.addEventListener('click', (event) => {
  const x = event.clientX - svg.getBoundingClientRect().left;
  const y = event.clientY - svg.getBoundingClientRect().top;

  const clickedNode = graph.nodes.find(node => {
    const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
    return distance <= 15;
  });

  if (clickedNode) {
    if (!startNodeId) {
      startNodeId = clickedNode.id;
      // Adiciona uma borda ao círculo do nó clicado para indicar origem
      //const circle = svg.querySelector(`circle[data-id="${startNodeId}"]`);
      //circle.setAttribute( 'blue');  // Adapte a cor conforme necessário
    } else {
      targetNodeId = clickedNode.id;
      const path = dijkstra(graph, startNodeId, targetNodeId);
      drawPath(path);

      // Remove a borda do nó que foi clicado anteriormente como origem
     // const previousStartCircle = svg.querySelector(`circle[data-id="${startNodeId}"]`);
      //previousStartCircle.removeAttribute('stroke');

      // Reinicializa para permitir novas buscas
      startNodeId = null;
      targetNodeId = null;
    }
  }
});
