export interface ProviderUrl {
  getUrl(): string;
}

export namespace Config {
  export class AuthUrl implements ProviderUrl {
    getUrl() {
      return process.env.AUTH_URL ?? 'http://localhost:3010';
    }
  }

  export class MainUrl implements ProviderUrl {
    getUrl() {
      return process.env.MAIN_URL ?? 'http://localhost:3000';
    }
  }
}
