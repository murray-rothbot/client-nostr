import { CronJob } from "cron";

type Props = {
  cron: string;
  action: () => void;
};

export const createCron = async ({ cron, action }: Props): Promise<CronJob<null, null>> => {
  const jobPrices = new CronJob(cron, action, null, true, "America/Sao_Paulo");

  jobPrices.start();

  return jobPrices;
};
