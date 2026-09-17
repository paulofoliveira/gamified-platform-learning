export { cn } from "cn"

// Level calculations
export function calculateLevel(points: number): number {
    return Math.floor(Math.sqrt(points / 100)) + 1;
}

export function calculateNextLevelPoints(points: number): number {
    const currentLevel = calculateLevel(points);
    const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
    return nextLevelPoints;
}