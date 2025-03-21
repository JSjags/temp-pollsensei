// environments
interface Environment {
  API_BASE_URL: string;
}

interface EnvironmentConfig {
  production: Environment;
  development: Environment;
}

const environment: EnvironmentConfig = {
  production: {
    API_BASE_URL: "https://pollsensei-api-a0e832048911.herokuapp.com/api/v1",
  },
  development: {
    API_BASE_URL:
      "https://pollsensei-api-dev-2e52be17da18.herokuapp.com/api/v1",

    // API_BASE_URL: "https://pollsensei-api-a0e832048911.herokuapp.com/api/v1",
  },
};

console.log(process.env.NEXT_PUBLIC_APP_ENV);

const currentEnvironment = (process.env.NEXT_PUBLIC_APP_ENV ||
  "development") as keyof EnvironmentConfig;

console.log(currentEnvironment);

export default environment[currentEnvironment];
