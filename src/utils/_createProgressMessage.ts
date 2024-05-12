type Props = { currentProgress: number };

export const createProgressMessage = ({ currentProgress }: Props): string => {
  const progressChars = [];

  for (let i = 0; i < 20; i++) {
    if (i < currentProgress * 0.2) {
      progressChars.push(`▓`);
    } else {
      progressChars.push(`░`);
    }
  }

  return `${progressChars.join("")} ${currentProgress}%`;
};
