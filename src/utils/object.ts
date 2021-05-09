export default function getEnumKeys<T, P extends keyof T>(enumObject:T):P[] {
  return Object
    .values(enumObject)
    .filter((value: string | number) => typeof value === 'string');
}
