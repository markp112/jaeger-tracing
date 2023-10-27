export type ResultType<T> = {
  count: number;
  data: T;
};

export abstract class Result {
  getResult<T>(data: T): ResultType<T> {
    let records = 1;
    if (Array.isArray(data)) {
      records = data.length;
    }
    return {
      count: records,
      data,
    };
  }
}
