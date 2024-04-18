export function euclideanDistance(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

export function manhattanDistance(point1, point2) {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

export function chebyshevDistance(point1, point2) {
    return Math.max(Math.abs(point1.x - point2.x), Math.abs(point1.y - point2.y));
}