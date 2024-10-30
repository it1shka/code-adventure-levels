import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../environment'
import { throwError } from 'rxjs'
import { Brush } from './brushes'

export interface Level {
  parent?: number
  title: string
  author: string
  field: string
}

@Injectable()
export class CreateLevelService {
  constructor(private http: HttpClient) {}

  private validateLevel = (field: string): boolean => {
    const rows = field.split('\n')
    if (rows.length <= 0 || rows[0].length <= 0) return false
    let robot = false
    let checkpoints = 0
    let boxes = 0
    for (const row of rows) {
      for (const symbol of row) {
        switch (symbol) {
          case '>':
          case 'V':
          case '<':
          case '^':
            if (robot) return false
            robot = true
            break
          case 'O':
            boxes++
            break
          case 'X':
            checkpoints++
            break
        }
      }
    }
    return robot && checkpoints === boxes && boxes > 0
  }

  buildLevel = (
    width: number,
    height: number,
    info: { [position: string]: Brush },
  ): string => {
    const matrix = Array(height)
      .fill(null)
      .map(() => {
        return new Array(width).fill(' ')
      })

    for (const [position, { brush }] of Object.entries(info)) {
      const [row, column] = position.split(';').map(Number)
      matrix[row][column] = brush
    }

    for (let row = 0; row < height; row++) {
      if (matrix[row][0] === ' ') matrix[row][0] = '@'
      if (matrix[row][width - 1] === ' ') matrix[row][width - 1] = '@'
    }

    for (let column = 0; column < width; column++) {
      if (matrix[0][column] === ' ') matrix[0][column] = '@'
      if (matrix[height - 1][column] === ' ') matrix[height - 1][column] = '@'
    }

    return matrix.map((line) => line.join('')).join('\n')
  }

  createLevel = (level: Level) => {
    if (!this.validateLevel(level.field)) {
      return throwError(() => new Error('Level field is invalid'))
    }
    const url = `${environment.apiBaseUrl}/level/new`
    const output = this.http.post(url, level, {
      headers: { 'Content-Type': 'application/json' },
    })
    return output
  }
}
