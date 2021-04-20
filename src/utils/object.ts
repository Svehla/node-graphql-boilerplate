export const filterEntries = <Key extends string | number, V>(
  fn: (a: [Key, V]) => boolean,
  obj: Record<Key, V>
) => Object.fromEntries(Object.entries(obj).filter(fn as any)) as Record<Key, V>

// iterate over keys in the object
export const mapEntries = <Key extends string | number, V, RetKey extends string | number, RV>(
  fn: (a: [Key, V]) => [RetKey, RV],
  obj: Record<Key, V>
) => Object.fromEntries(Object.entries(obj).map(fn as any)) as Record<RetKey, RV>
