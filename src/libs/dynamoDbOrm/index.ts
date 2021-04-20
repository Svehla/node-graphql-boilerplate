/* eslint-disable @typescript-eslint/no-unused-vars */
// dt is abbreviation fro dataType

export const dt = {
  string: ({ type: 'string' } as any) as string | undefined | null,
  number: ({ type: 'number' } as any) as string | undefined | null,
  boolean: ({ type: 'boolean' } as any) as boolean | undefined | null,
  notNullable: <T>(a: T | null | undefined): T => ({ ...a, required: true } as any),
}

// ------------------------
// ----- dynamo utils -----
// type Head<T> = T extends [infer FirstItem, ...infer _Rest] ? FirstItem : never
type Head2<T> = T extends [infer _FirstItem, infer SecondItem, ...infer _Rest] ? SecondItem : never
type RemoveFirstChar<T> = T extends `${infer F}${infer Rest}` ? Rest : never
type Tail2<T> = T extends [infer _F, infer _S, ...infer Rest] ? Rest : never

type GetOddKeys<T> = T extends []
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : GetOddKeys<Tail2<T>> & { [K in RemoveFirstChar<Head2<T>>]: string }

type NiceObjMerge<
  T,
  U = {
    [K in keyof T]: T[K]
  }
> = U

/**
 *
 * TODO: add type to transform tuple into schema object
 * TODO: add option to parse value as integer
 * TODO: add tests
 * parseDynID(['a', ':b', 'c', ':d'], 'a#text1#c#text2')
 * { b: 'text1', d: 'text2' }
 */
export const parseDynID = <T extends any[]>(schema: T, item: any): NiceObjMerge<GetOddKeys<T>> => {
  const parsedItem = item.split('#')
  const obj = {} as any

  // TODO: zip with: parsedItem
  schema.forEach((schemaItem, index) => {
    if (schemaItem[0] !== ':') {
      // validate data string consistency
      if (schemaItem !== parsedItem[index]) {
        throw new Error('inconsistent dynamodb data')
      }
      return
    }

    if (schemaItem[0] === ':') {
      // remove first character
      const clearedItem = (schemaItem.slice(1) as any) as string

      obj[clearedItem] = parsedItem[index]
    }
  })

  return obj
}

/**
 * abbreviation for join by hashtag
 */
export const jh = (a: any[]) => a.join('#')
