import { state } from '@/auth'
import { AnyObject, EmptyObject } from '@/types/utils'
import { paths } from './generated/openapi'

type GetJSON<O extends AnyObject> = 'content' extends keyof O
  ? 'application/json' extends keyof O['content']
    ? O['content']['application/json']
    : null
  : null
type PathParameters<O extends AnyObject> = 'parameters' extends keyof O
  ? 'path' extends keyof O['parameters']
    ? O['parameters']['path']
    : EmptyObject
  : EmptyObject
type QueryParameters<O extends AnyObject> = 'parameters' extends keyof O
  ? 'query' extends keyof O['parameters']
    ? O['parameters']['query']
    : EmptyObject
  : EmptyObject
type Body<O extends AnyObject> = 'requestBody' extends keyof O ? GetJSON<O['requestBody']> : null
type Parameters<O extends AnyObject> = (EmptyObject extends PathParameters<O>
  ? { path?: PathParameters<O> }
  : {
      path: PathParameters<O>
    }) &
  (EmptyObject extends QueryParameters<O>
    ? { query?: QueryParameters<O> }
    : {
        query: QueryParameters<O>
      }) &
  (null extends Body<O> ? { body?: null } : { body: Body<O> })
type Response<O extends AnyObject> = 'responses' extends keyof O
  ? 200 extends keyof O['responses']
    ? GetJSON<O['responses'][200]>
    : 201 extends keyof O['responses']
    ? GetJSON<O['responses'][201]>
    : null
  : null

export const request =
  <P extends keyof paths, M extends keyof paths[P]>(path: P, method: M) =>
  async (
    ...args: EmptyObject extends Parameters<paths[P][M]>
      ? [params?: Parameters<paths[P][M]>]
      : [params: Parameters<paths[P][M]>]
  ): Promise<Response<paths[P][M]>> => {
    let replacedPath = path as string
    const params = args[0]
    const pathParams = (params?.path ?? {}) as Record<string, string>
    const queryParams = (params?.query ?? {}) as Record<string, string>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = (params?.body ?? null) as Record<string, any> | null
    Object.entries(pathParams).map(([key, value]) => {
      replacedPath = replacedPath.replace(`{${key}}`, value)
    })
    const search = new URLSearchParams()
    Object.entries(queryParams).map(([key, value]) => {
      search.append(key, value)
    })
    const url = new URL(`${process.env.VUE_APP_API_URL}${replacedPath}`)
    url.search = search.toString()
    const res = await fetch(url.toString(), {
      method: (method as string).toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...(state.token
          ? {
              Authorization: `Bearer ${state.token}`,
            }
          : {}),
        ...(state.userToken
          ? {
              'X-User': state.userToken,
            }
          : {}),
      },
      ...(body
        ? {
            body: JSON.stringify(body),
          }
        : {}),
    })
    if (!res.ok) {
      throw await res.json()
    } else {
      return res.json()
    }
  }
