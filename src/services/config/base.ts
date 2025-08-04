// environments
interface Environment {
  API_BASE_URL: string;
}

interface EnvironmentConfig {
  production: Environment;
  development: Environment;
  staging: Environment;
  "staging-v2": Environment;
  release: Environment;
}

const environment: EnvironmentConfig = {
  // For main branch
  production: {
    API_BASE_URL: "https://api.pollsensei.ai/api/v1",
  },
  // For v2-main branch
  development: {
    // API_BASE_URL:
    // "https://pollsensei-api-dev-2e52be17da18.herokuapp.com/api/v1",
    API_BASE_URL: "https://api-staging.pollsensei.ai/api/v1",
  },
  // For staging-v2 branch
  staging: {
    API_BASE_URL: "https://api-staging.pollsensei.ai/api/v1",
  },
  // For staging-v2 branch
  "staging-v2": {
    API_BASE_URL: "https://api-staging-v2.pollsensei.ai/api/v1",
  },
  // For release branch
  release: {
    API_BASE_URL: "https://api.pollsensei.ai/api/v1",
  },
};

console.log(process.env.NEXT_PUBLIC_APP_ENV);

// const currentEnvironment = (process.env.NEXT_PUBLIC_APP_ENV ||
//   "development") as keyof EnvironmentConfig;
const currentEnvironment = "staging-v2" as keyof EnvironmentConfig;

console.log(currentEnvironment);

export default environment[currentEnvironment];
