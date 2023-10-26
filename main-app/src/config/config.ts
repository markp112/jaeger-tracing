export namespace Config {
  export class AuthUrl {
    getUrl() {
      return process.env.AUTH_URL ?? 'http://localhost:3010';
    }
  }

  export class PostUrl {
    getUrl() {
      return process.env.POST_URL ?? 'http://localhost:3012';
    }
  }
}
