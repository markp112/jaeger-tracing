export interface ProviderUrl {
  getUrl(): string;
}

export namespace Config {
  export class PostUrl implements ProviderUrl {
    getUrl() {
      return process.env.POST_URL ?? 'http://localhost:3010';
    }
  }
}
