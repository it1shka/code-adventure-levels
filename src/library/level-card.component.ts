import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {Level} from "./list-levels.service";

@Component({
  selector: 'level-card',
  standalone: true,
  template: `
    <aside class="level-container">
      <h2 class="level-title">{{ title }}</h2>
      <div class="level-meta">
        <small>{{ timestamp }}</small>
        <small>By {{ author }}</small>
      </div>
      <div 
        class="level-minimap"
        [style]="fieldStyle"
      >
        @for (row of field; track $index) {
          @for (color of row; track $index) {
            <div
              [style]="{
                width: cellSize + 'px',
                height: cellSize + 'px',
                'background-color': color,
              }"
            ></div>
          }
        }
      </div>
    </aside>
  `,
  styles: `
    .level-container {
      padding: 1em;
      background-color: #fafafa;
      box-shadow: var(--shadow);
      width: 240px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5em;
      cursor: pointer;

      &:hover {
        scale: 1.025;
      }

      .level-title {
        color: #111;
        text-align: center;
        font-size: 1.2em;
      }

      .level-meta {
        display: flex;
        flex-direction: column;
        align-items: center;
        small {
          color: grey;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelCardComponent {
  private readonly maxTitleLength = 19
  private readonly maxAuthorLength = 19
  readonly cellSize = 15
  @Input({ required: true, alias: 'level-info' }) info!: Level

  get title() {
    const { title } = this.info
    if (title.length > this.maxTitleLength) {
      return title.slice(0, this.maxTitleLength - 3) + '...'
    }
    return title
  }

  get author() {
    const { author } = this.info
    if (author.length > this.maxAuthorLength) {
      return author.slice(0, this.maxTitleLength - 3) + '...'
    }
    return author
  }

  get timestamp() {
    try {
      const MILLIS_PER_DAY = 1000 * 60 * 60 * 24
      const now = new Date()
      const then = new Date(this.info.created_at)
      const utc1 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      const utc2 = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate());
      const difference = Math.floor((utc1 - utc2) / MILLIS_PER_DAY)
      const timestamp = `${then.getHours().toString().padStart(2, '0')}:${then.getMinutes().toString().padStart(2, '0')}`
      switch (true) {
        case difference <= 0:
          return `Today, at ${timestamp}`
        case difference === 1:
          return `Yesterday, at ${timestamp}`
        case difference <= 7:
          return `${difference} days ago, at ${timestamp}`
        default:
          return then.toDateString()
      }
    } catch {
      return 'Failed to parse date'
    }
  }

  get rows() {
    const { field } = this.info
    return field.trim().split('\n').length
  }

  get columns() {
    const { field } = this.info
    return field.trim().split('\n').pop()?.length ?? 0
  }

  get field() {
    const { field } = this.info
    return field.trim().split('\n').map(row => {
      return row.split('').map(symbol => {
        switch (symbol) {
          case '>': case 'V': case '<': case '^':
            return 'green'
          case '*':
            return 'grey'
          case 'O':
            return 'orange'
          case 'X':
            return 'red'
          default:
            return '#ccc'
        }
      })
    })
  }

  get fieldStyle() {
    return Object.freeze({
      display: 'grid',
      'grid-template-rows': `repeat(${this.rows}, 1fr)`,
      'grid-template-columns': `repeat(${this.columns}, 1fr)`,
      // gap: '2px',
    })
  }
}
