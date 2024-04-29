export interface AttributeResult<T> {
  data: T;
}

export function Result<TData>(data: TData): AttributeResult<TData> {
  return { data };
}
