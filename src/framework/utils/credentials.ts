import fs from 'fs';
import path from 'path';

export type Credentials = {
  username?: string;
  password?: string;
};

const authDirectory = path.resolve(__dirname, '../../../.auth');

export const authStateFile = path.join(authDirectory, 'user.json');
export const localCredentialsFile = path.join(authDirectory, 'local.credentials.json');

function loadLocalCredentials(): Credentials {
  if (!fs.existsSync(localCredentialsFile)) {
    return {};
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(localCredentialsFile, 'utf8')) as Credentials;

    return {
      username: parsed.username,
      password: parsed.password,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse local credentials file at ${localCredentialsFile}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function resolveCredentials(): Credentials {
  const localCredentials = loadLocalCredentials();

  return {
    username: process.env.ERP_USERNAME ?? localCredentials.username,
    password: process.env.ERP_PASSWORD ?? localCredentials.password,
  };
}
