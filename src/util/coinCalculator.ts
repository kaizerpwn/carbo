export const calculateCoins = (ecoScore: number): number => {
    if (ecoScore >= 85) {
      return 3;
    } else if (ecoScore >= 70) {
      return 2;
    } else if (ecoScore >= 50) {
      return 1;
    } else {
      return 0;
    }
  };