export namespace Config {

  export class AuthUrl {
    getUrl() {
      const url = process.env.AUTH_URL || 'http://localhost:3010';
      return url;
    }
  }

}