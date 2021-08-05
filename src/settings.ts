export interface Config {
  // either there's a token either apps and login urls
  x4b?: {
    appsUrl: string;
    authenticationUrl?: string;
  };
}

export let ProductVersion = "[PRODUCT_VERSION]";

export let BuildNumber = "";

if (process.env.REACT_APP_SERVICEFULL_PRODUCT_VERSION) {
  ProductVersion = process.env.REACT_APP_SERVICEFULL_PRODUCT_VERSION;
}

if (process.env.REACT_APP_SERVICEFULL_BUILD_NUMBER) {
  BuildNumber = process.env.REACT_APP_SERVICEFULL_BUILD_NUMBER;
}

export let config: Config | undefined;

export async function loadConfig() {
  if (config) return config;

  const response = await fetch("/config.json");
  const data = await response.text();

  if (response.ok) {
    const newConfig = JSON.parse(data) as Config;

    config = newConfig;
  } else {
    console.error(
      "Error reading config",
      response.status,
      response.statusText,
      data
    );
    throw new Error(response.statusText);
  }

  return config;
}
