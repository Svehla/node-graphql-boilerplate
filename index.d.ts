

declare module "graphql-cursor-sql-helper" {
  export function connectionToSqlQuery<T>(
    totalCount: number,
    paginationArgs:Object,
    paginationCb: (paginationArgs: { offset: number, limit: number }) => any // BluebirdPromise<any> / Promise<any>
  ): Promise<T>
}