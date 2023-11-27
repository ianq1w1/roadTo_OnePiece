class Grafo {
    constructor() {
        this.vertices = {};
    }

    adicionarVertice(ilha, x, y) {
        this.vertices[ilha] = { x, y, arestas: {} };
    }

    adicionarAresta(ilha1, ilha2, peso) {
        this.vertices[ilha1].arestas[ilha2] = peso;
        this.vertices[ilha2].arestas[ilha1] = peso;
    }

    dijkstra(origem) {
        const distancias = {};
        const visitados = {};

        for (const vertice in this.vertices) {
            distancias[vertice] = Infinity;
            visitados[vertice] = false;
        }

        distancias[origem] = 0;

        for (let i = 0; i < Object.keys(this.vertices).length - 1; i++) {
            const verticeAtual = this.minDistancia(distancias, visitados);
            visitados[verticeAtual] = true;

            for (const vizinho in this.vertices[verticeAtual].arestas) {
                const distancia = distancias[verticeAtual] + this.vertices[verticeAtual].arestas[vizinho];

                if (distancia < distancias[vizinho]) {
                    distancias[vizinho] = distancia;
                }
            }
        }

        return distancias;
    }

    minDistancia(distancias, visitados) {
        let min = Infinity;
        let minVertice = null;

        for (const vertice in this.vertices) {
            if (!visitados[vertice] && distancias[vertice] <= min) {
                min = distancias[vertice];
                minVertice = vertice;
            }
        }

        return minVertice;
    }
}

const meuGrafo = new Grafo();
let origem = null;
let destino = null;

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    const barco = document.createElement('div');
    barco.id = 'barco';
    barco.style.width = '30px';
    barco.style.height = '30px';
    barco.style.background = 'url("merry.png")';  // Substitua pelo caminho da imagem do barco
    barco.style.backgroundSize = 'cover';
    barco.style.position = 'absolute';
    barco.style.display = 'none';
    body.appendChild(barco);

    // Adiciona as ilhas
    meuGrafo.adicionarVertice('Ilha1', 50, 50);
    meuGrafo.adicionarVertice('Ilha2', 150, 50);
    meuGrafo.adicionarVertice('Ilha3', 250, 50);
    meuGrafo.adicionarVertice('Ilha4', 50, 150);
    meuGrafo.adicionarVertice('Ilha5', 150, 200);

    // Conecta as ilhas para formar um grafo
    meuGrafo.adicionarAresta('Ilha1', 'Ilha2', 3);
    meuGrafo.adicionarAresta('Ilha1', 'Ilha3', 2);
    meuGrafo.adicionarAresta('Ilha1', 'Ilha4', 4);
    meuGrafo.adicionarAresta('Ilha1', 'Ilha5', 4);
    meuGrafo.adicionarAresta('Ilha2', 'Ilha3', 1);
    meuGrafo.adicionarAresta('Ilha2', 'Ilha5', 5);
    meuGrafo.adicionarAresta('Ilha3', 'Ilha5', 8);
    meuGrafo.adicionarAresta('Ilha4', 'Ilha5', 6);

    for (const ilha in meuGrafo.vertices) {
        const elemento = document.createElement('div');
        elemento.className = 'ilha';
        elemento.style.top = `${meuGrafo.vertices[ilha].y}px`;
        elemento.style.left = `${meuGrafo.vertices[ilha].x}px`;
        elemento.textContent = ilha;
        elemento.addEventListener('click', () => selecionarIlha(ilha));
        body.appendChild(elemento);
    }

    // Adiciona as arestas

// Adiciona as arestas
for (const ilha1 in meuGrafo.vertices) {
    for (const ilha2 in meuGrafo.vertices[ilha1].arestas) {
        const elemento = document.createElement('div');
        elemento.className = 'aresta';
        elemento.id = `${ilha1}-${ilha2}`;

        const x1 = meuGrafo.vertices[ilha1].x;
        const y1 = meuGrafo.vertices[ilha1].y;
        const x2 = meuGrafo.vertices[ilha2].x;
        const y2 = meuGrafo.vertices[ilha2].y;

        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angulo = Math.atan2(deltaY, deltaX);

        elemento.style.top = `${y1 + deltaY / 2}px`;
        elemento.style.left = `${x1 + deltaX / 2}px`;
        elemento.style.width = `${distancia}px`;
        elemento.style.transform = `rotate(${angulo}rad)`;

        body.appendChild(elemento);
    }
}

    
});

function selecionarIlha(ilha) {
    const barco = document.getElementById('barco');

    if (!origem) {
        origem = ilha;
        console.log(`Origem: ${origem}`);
        marcarOrigem(ilha, barco);
    } else if (!destino) {
        destino = ilha;
        console.log(`Destino: ${destino}`);
        const distancias = meuGrafo.dijkstra(origem);
        console.log(`Rota mais segura de ${origem} para ${destino}: ${distancias[destino]}`);
        marcarMelhorRota(distancias);
        marcarDestino(ilha, barco);
        origem = null;
        destino = null;
    }
}

function marcarOrigem(ilha, barco) {
    barco.style.display = 'block';
    barco.style.top = `${meuGrafo.vertices[ilha].y - 15}px`;
    barco.style.left = `${meuGrafo.vertices[ilha].x - 15}px`;
}

function marcarDestino(ilha, barco) {
    barco.style.top = `${meuGrafo.vertices[ilha].y - 15}px`;
    barco.style.left = `${meuGrafo.vertices[ilha].x - 15}px`;
}

function marcarMelhorRota(distancias) {
    const arestas = document.querySelectorAll('.aresta');

    arestas.forEach(aresta => {
        aresta.style.backgroundColor = 'black'; // Reset para a cor original
    });

    let ilhaAtual = destino;

    while (ilhaAtual !== origem) {
        const arestaId = `${ilhaAtual}-${distancias[ilhaAtual]}`;
        const aresta = document.getElementById(arestaId);

        if (aresta) {
            aresta.style.backgroundColor = 'red';
            ilhaAtual = distancias[ilhaAtual];
        } else {
            break;
        }
    }
}
