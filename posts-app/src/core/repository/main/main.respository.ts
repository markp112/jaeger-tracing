import { logger } from '@logger/logger';
import axios, { Axios } from 'axios';

export interface MainRepositoryInterface {
  fetch<T>(url: string): Promise<T>;
}

export class MainRepository implements MainRepositoryInterface {
  private axiosClient: Axios;

  constructor(baseUrl: string) {
    this.axiosClient = axios.create({
      baseURL:baseUrl,
      timeout: 6000,
    });
  }

  async fetch<T>(url: string): Promise<T> {
    const result = await this.axiosClient.get(url);
    return result.data.data as T;
  }
}
