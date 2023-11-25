class Grafo {
    constructor() {
        this.vertices = {};
    }

    adicionarVertice(v) {
        this.vertices[v] = [];
    }

    adicionarAresta(v1, v2, peso) {
        this.vertices[v1][this.vertices[v1].length] = { vertice: v2, peso: peso };
        this.vertices[v2][this.vertices[v2].length] = { vertice: v1, peso: peso };
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

            for (const vizinho of this.vertices[verticeAtual]) {
                const distancia = distancias[verticeAtual] + vizinho.peso;

                if (distancia < distancias[vizinho.vertice]) {
                    distancias[vizinho.vertice] = distancia;
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

function mostrarRotaMaisSegura(origem, destino) {
    const distancias = meuGrafo.dijkstra(origem);
    console.log(`Rota mais segura de ${origem} para ${destino}: ${distancias[destino]}`);
}

// Exemplo de uso
meuGrafo.adicionarVertice('Lode Star');
meuGrafo.adicionarVertice('Ilha1');
meuGrafo.adicionarVertice('Ilha2');
meuGrafo.adicionarVertice('Ilha3');

meuGrafo.adicionarAresta('Lode Star', 'Ilha1', 1);
meuGrafo.adicionarAresta('Lode Star', 'Ilha2', 4);
meuGrafo.adicionarAresta('Ilha1', 'Ilha3', 2);
meuGrafo.adicionarAresta('Ilha2', 'Ilha3', 5);
meuGrafo.adicionarAresta('Ilha3', 'Lode Star', 1);
