/**
 * Handles the high score system.
 */
export class HighScoreManager {
    private static readonly STORAGE_KEY_PREFIX = 'highscore_';
    private static readonly MAX_SCORES = 10;

    public readonly missionName: string;
    private scores: PlayerScore[];

    constructor(missionName: string) {
        this.missionName = missionName;
        this.scores = this.loadScores();
        this.scores.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
    }

    private loadScores(): PlayerScore[] {
        const storedScores = localStorage.getItem(HighScoreManager.STORAGE_KEY_PREFIX + this.missionName);
        return HighScoreManager.parseStoredScores(storedScores);
    }

    private saveScores(): void {
        localStorage.setItem(HighScoreManager.STORAGE_KEY_PREFIX + this.missionName, JSON.stringify(this.scores));
    }

    public addScore(playerScore: PlayerScore): void {
        this.scores.push(playerScore);
        this.scores.sort((a, b) => b.score - a.score);
        if (this.scores.length > HighScoreManager.MAX_SCORES) {
            this.scores.length = HighScoreManager.MAX_SCORES;
        }
        this.saveScores();
    }

    public getScores(): PlayerScore[] {
        return this.scores;
    }

    private static parseStoredScores(storedScores: string | null): PlayerScore[] {
        if (!storedScores) {
            return [];
        }
        try {
            const parsedScores = JSON.parse(storedScores);
            if (
                Array.isArray(parsedScores) &&
                parsedScores.every(
                    (score) =>
                        typeof score.playerName === 'string' &&
                        typeof score.score === 'number' &&
                        typeof score.timestamp === 'number'
                )
            ) {
                return parsedScores.map((score) => ({
                    playerName: score.playerName,
                    score: score.score,
                    timestamp: score.timestamp,
                }));
            }
        } catch (e) {
            console.error('Failed to parse stored scores:', e);
        }
        return [];
    }
}

export type PlayerScore = {
    playerName: string;
    score: number;
    timestamp: number;
};
