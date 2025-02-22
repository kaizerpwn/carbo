export interface ScanResult {
  isEcoFriendly: boolean;
  score: number;
  reasons: string[];
  potentialPoints: number;
  text: string; // Add this line
}