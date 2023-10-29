type StringValue = undefined | null | string;

export function isNull(value: StringValue) {
  return value === null;
}

export function isUndefined(value: StringValue) {
  return value === undefined;
}

export function isEmptyString(value: StringValue) {
  return value === '';
}

export function isNullUndefinedOrEmpty(value: string | undefined | null): boolean {
  return isNull(value) || isUndefined(value) || isEmptyString(value);
}