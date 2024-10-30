import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../environment'
import { catchError, of, Subject, switchMap, throwError } from 'rxjs'

export type FetchPageProps = {
  page: number
  pageSize?: number
  search?: string
}

export type Level = {
  id: number
  created_at: string
  parent?: number
  title: string
  author: string
  field: string
}

const isLevel = (maybeLevel: any): maybeLevel is Level => {
  const expectedSchema = Object.freeze({
    id: 'number',
    created_at: 'string',
    parent: 'number|nil',
    title: 'string',
    author: 'string',
    field: 'string',
  })
  return Object.entries(expectedSchema).every(([prop, expectedRaw]) => {
    const expectedTypes = expectedRaw.split('|')
    if (
      expectedTypes.includes('nil') &&
      (maybeLevel[prop] === undefined || maybeLevel[prop] === null)
    ) {
      return true
    }
    return expectedTypes.includes(typeof maybeLevel[prop])
  })
}

const isLevelArray = (
  maybeLevelArray: any,
): maybeLevelArray is Array<Level> => {
  if (!(maybeLevelArray instanceof Array)) {
    return false
  }
  return maybeLevelArray.every(isLevel)
}

@Injectable()
export class ListLevelsService {
  readonly error$ = new Subject<unknown>()

  constructor(private http: HttpClient) {}

  fetchPage = ({ page, pageSize, search }: FetchPageProps) => {
    const url = `${environment.apiBaseUrl}/level/list`
    let params = new HttpParams().set('page', page)
    if (pageSize !== undefined) {
      params = params.set('page-size', pageSize)
    }
    if (search !== undefined) {
      params = params.set('search', search)
    }
    return this.http.get(url, { params }).pipe(
      switchMap((response) => {
        return isLevelArray(response)
          ? of(response)
          : throwError(() => new Error('Wrong response schema'))
      }),
      catchError((error) => {
        this.error$.next(error)
        return throwError(() => new Error('Failed to fetch levels'))
      }),
    )
  }

  fetchPageCount = (pageSize?: number) => {
    const url = `${environment.apiBaseUrl}/level/page-size`
    let params = new HttpParams()
    if (pageSize !== undefined) {
      params = params.set('page-size', pageSize)
    }
    return this.http.get(url, { params }).pipe(
      switchMap((response) => {
        const output = Number(response)
        return Number.isFinite(output)
          ? of(output)
          : throwError(() => new Error('Expected number'))
      }),
      catchError((error) => {
        this.error$.next(error)
        return throwError(() => new Error('Failed to fetch page count'))
      }),
    )
  }
}
