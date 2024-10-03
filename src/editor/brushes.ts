export interface Brush {
  name: string
  icon?: string
  brush: string
}

const brushes: readonly Brush[] = Object.freeze([
  {
    name: 'Empty Space',
    brush: ' ',
  },
  {
    name: 'Wall',
    icon: 'brush-wall.png',
    brush: '*',
  },
  {
    name: 'Box',
    icon: 'brush-box.png',
    brush: 'O',
  },
  {
    name: 'Flag',
    icon: 'brush-flag.png',
    brush: 'X',
  },
  {
    name: 'Robot Top',
    icon: 'brush-robot-top.png',
    brush: '^',
  },
  {
    name: 'Robot Right',
    icon: 'brush-robot-right.png',
    brush: '>',
  },
  {
    name: 'Robot Bottom',
    icon: 'brush-robot-bottom.png',
    brush: 'V',
  },
  {
    name: 'Robot Left',
    icon: 'brush-robot-left.png',
    brush: '<',
  },
])

export default brushes
