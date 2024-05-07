export const createProgressMessage = (currentProgress: number): string => {
  let progressMessage = "";

  for (let i = 0; i < 20; i++) {
    if (i < currentProgress * 0.2) {
      progressMessage += `▓`;
    } else {
      progressMessage += `░`;
    }
  }

  progressMessage += ` ${currentProgress}%`;

  return progressMessage;
};
