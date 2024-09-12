import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { forkJoin, Observable } from "rxjs"
import { environment } from "../environment"

@Injectable()
export class RandomizeNamesService {
  constructor (private http: HttpClient) {}

  randomLevelName(): Observable<string> {
    const url = `${environment.apiBaseUrl}/random/level-name`
    return this.http.get(url, {
      observe: 'body',
      responseType: 'text',
    })
  }

  randomAuthorName(): Observable<string> {
    const url = `${environment.apiBaseUrl}/random/author-name`
    return this.http.get(url, {
      observe: 'body',
      responseType: 'text',
    })
  }

  randomizeBothNames(): Observable<{ level: string, author: string }> {
    return forkJoin({
      level: this.randomLevelName(),
      author: this.randomAuthorName(),
    })
  }
}
