function dijkstra(systems, start, goal, speed, ignoreLowSecurity, ignoredSystems) {
    let shortestTimes = {};
    for (let system in systems) {
        shortestTimes[system] = Infinity;
    }
    shortestTimes[start] = 0;

    let predecessors = {};
    let unvisited = new Set(Object.keys(systems));

    while (unvisited.size > 0) {
        let currentSystem = Array.from(unvisited).reduce((a, b) => shortestTimes[a] < shortestTimes[b] ? a : b);

        if (shortestTimes[currentSystem] === Infinity) break;

        for (let connection of systems[currentSystem].connections) {
            let neighbor = connection["system-name"];

            // Check if the neighbor exists in the systems object and is not ignored
            if (!systems[neighbor] || ignoredSystems.includes(neighbor)) {
                continue; // Skip if the neighbor system is not found or is in the ignored list
            }

            if (ignoreLowSecurity && systems[neighbor]["security-status"] === "Low") continue;
            let distance = connection.distance;
            let time = distance / speed;
            let newTime = shortestTimes[currentSystem] + time;

            if (unvisited.has(neighbor) && newTime < shortestTimes[neighbor]) {
                shortestTimes[neighbor] = newTime;
                predecessors[neighbor] = currentSystem;
            }
        }
        unvisited.delete(currentSystem);
    }

    // Reconstruct the shortest path
    let path = [];
    let current = goal;
    while (current !== start) {
        if (!predecessors[current]) {
            return { path: null, totalTime: null };
        }
        path.push(current);
        current = predecessors[current];
    }
    path.push(start);
    path.reverse();

    return { path: path, totalTime: shortestTimes[goal] };
}

export { dijkstra };
