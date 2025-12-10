import { z } from "zod";

export const envSchema = z.object({
  SLACK_APP_INSTALL_URL: z.string().optional(),
  SLACK_CLIENT_ID: z.string().optional(),
  SLACK_CLIENT_SECRET: z.string().optional(),
  SLACK_INTEGRATION_ID: z.string().optional(),
});

type SlackEnv = Required<{
  [K in keyof z.infer<typeof envSchema>]: string;
}>;

let env: SlackEnv | undefined;

export const getSlackEnv = (): SlackEnv | null => {
  if (env) {
    return env;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    return null;
  }

  const { SLACK_APP_INSTALL_URL, SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_INTEGRATION_ID } =
    parsed.data;

  if (
    !SLACK_APP_INSTALL_URL ||
    !SLACK_CLIENT_ID ||
    !SLACK_CLIENT_SECRET ||
    !SLACK_INTEGRATION_ID
  ) {
    return null;
  }

  env = {
    SLACK_APP_INSTALL_URL,
    SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET,
    SLACK_INTEGRATION_ID,
  };

  return env;
};
