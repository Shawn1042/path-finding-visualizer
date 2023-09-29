// Welcome!

const numRows = 16;
const numCols = 14;
const delayTime = 50;
let start = null;
let end = null;
let marioMusic = new Audio('mario.mp3');

const modal = document.getElementById("infoModal");
const closeBtn = document.querySelector(".close-btn");

// Display the modal when the page loads:
window.onload = () => {
    modal.style.display = "block";
};

// Close the modal when the close button is clicked:
closeBtn.onclick = () => {
    modal.style.display = "none";
};

// Close the modal when the user clicks outside of the modal content:
window.onclick = event => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


function createGrid() {
    const gridElement = document.getElementById("grid");
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.row = i;
            cellElement.dataset.col = j;
            cellElement.addEventListener('click', selectCell);
            gridElement.appendChild(cellElement);
        }
    }
}

function selectCell(event) {
    const cell = event.target;

    if (start && end) {
        start.classList.remove('start');
        end.classList.remove('end');
        start = null;
        end = null;
    }

    if (!start) {
        start = cell;
        cell.classList.add('start');
    } else if (!end && cell !== start) {
        end = cell;
        cell.classList.add('end');
    }
}

function getNeighbors(node) {
    const neighbors = [];
    const row = parseInt(node.dataset.row);
    const col = parseInt(node.dataset.col);

    if (row > 0) neighbors.push(document.querySelector(`[data-row="${row - 1}"][data-col="${col}"]`));
    if (row < numRows - 1) neighbors.push(document.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`));
    if (col > 0) neighbors.push(document.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`));
    if (col < numCols - 1) neighbors.push(document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`));

    return neighbors;
}

function startBFS() {
    marioMusic.play();

    if (!start || !end) {
        alert('Please select both a start and end point.');
        return;
    }
    
    const visited = new Set();
    const queue = [{node: start, path: [start]}];

    function visitNextNode() {
        if (queue.length === 0) return;

        const {node, path} = queue.shift();
        if (visited.has(node)) {
            visitNextNode();
            return;
        }
        visited.add(node);
        node.classList.add('visited');

        if (node === end) {
            animatePath(path);
            return;
        }

        const neighbors = getNeighbors(node);
        neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) {
                queue.push({node: neighbor, path: [...path, neighbor]});
            }
        });

        setTimeout(visitNextNode, delayTime);
    }

    visitNextNode();
}

function animatePath(path) {
    let index = 0;
    function moveSnake() {
        if (index > 0) {
            path[index - 1].classList.remove('path');
        }

        if (index < path.length) {
            path[index].classList.add('path');
            index++;
            setTimeout(moveSnake, delayTime);
        } else {
            for (const cell of path) {
                cell.classList.add('path');
            }

            marioMusic.pause();
            marioMusic.currentTime = 0;
        }
    }
    moveSnake();
}

function clearGrid() {
    start = null;
    end = null;

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('start', 'end', 'visited', 'path');
    });

    if (!marioMusic.paused) {
        marioMusic.pause();
        marioMusic.currentTime = 0;
    }
}

function startDFS() {
    marioMusic.play();

    if (!start || !end) {
        alert('Please select both a start and end point.');
        return;
    }
    
    const visited = new Set();
    const stack = [{node: start, path: [start]}];

    function visitNextNode() {
        if (stack.length === 0) return;

        const {node, path} = stack.pop();
        if (visited.has(node)) {
            visitNextNode();
            return;
        }
        visited.add(node);
        node.classList.add('visited');

        if (node === end) {
            animatePath(path);
            return;
        }

        const neighbors = getNeighbors(node);
        neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) {
                stack.push({node: neighbor, path: [...path, neighbor]});
            }
        });

        setTimeout(visitNextNode, delayTime);
    }

    visitNextNode();
}

function startDijkstra() {
    marioMusic.play();

    if (!start || !end) {
        alert('Please select both a start and end point.');
        return;
    }

    const visited = new Set();
    const distances = {};
    const previousNodes = {};

    const allNodes = Array.from(document.querySelectorAll('.cell'));

    allNodes.forEach(node => {
        distances[node] = Infinity;
    });
    distances[start] = 0;

    const nodesToVisit = new Set(allNodes);

    while (nodesToVisit.size) {
        const currentNode = getClosestNode(nodesToVisit, distances);
        nodesToVisit.delete(currentNode);

        if (currentNode === end) {
            animateDijkstraPath(previousNodes);
            return;
        }

        const neighbors = getNeighbors(currentNode);
        neighbors.forEach(neighbor => {
            const tentativeDistance = distances[currentNode] + 1;

            if (tentativeDistance < distances[neighbor]) {
                distances[neighbor] = tentativeDistance;
                previousNodes[neighbor] = currentNode;
            }
        });

        visited.add(currentNode);
        currentNode.classList.add('visited');
    }
}

function getClosestNode(nodesToVisit, distances) {
    return Array.from(nodesToVisit).reduce((closest, node) => {
        if (closest === null || distances[node] < distances[closest]) {
            return node;
        }
        return closest;
    }, null);
}




function animateDijkstraPath(previousNodes) {
    const path = [];
    let currentNode = end;
    while (currentNode) {
        path.unshift(currentNode);
        currentNode = previousNodes[currentNode];
    }

    animatePath(path);
}



document.getElementById('dfsButton').addEventListener('click', startDFS);

document.getElementById('clearButton').addEventListener('click', clearGrid);
createGrid();
