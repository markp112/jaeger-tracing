export interface ProviderUrl {
  getUrl(): string;
}

export namespace Config {
  export class AuthUrl implements ProviderUrl {
    getUrl() {
      return process.env.AUTH_URL ?? 'http://localhost:3010';
    }
  }
}
