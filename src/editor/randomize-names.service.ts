import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, forkJoin, Observable, Subject, throwError } from 'rxjs'
import { environment } from '../environment'

@Injectable()
export class RandomizeNamesService {
  readonly error$ = new Subject<unknown>()

  constructor(private http: HttpClient) {}

  randomLevelName(): Observable<string> {
    const url = `${environment.apiBaseUrl}/random/level-name`
    return this.http
      .get(url, {
        observe: 'body',
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          this.error$.next(error)
          return throwError(
            () => new Error('Failed to fetch random level name'),
          )
        }),
      )
  }

  randomAuthorName(): Observable<string> {
    const url = `${environment.apiBaseUrl}/random/author-name`
    return this.http
      .get(url, {
        observe: 'body',
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          this.error$.next(error)
          return throwError(
            () => new Error('Failed to fetch random author name'),
          )
        }),
      )
  }

  randomizeBothNames(): Observable<{ level: string; author: string }> {
    return forkJoin({
      level: this.randomLevelName(),
      author: this.randomAuthorName(),
    })
  }
}
