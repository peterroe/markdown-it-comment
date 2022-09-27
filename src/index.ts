interface Ruler {
  before: (a: string, b: string, c: Function) => void
  after: (a: string, b: string, c: Function) => void
  push: (a: string, b: Function) => void
}

interface MarkdownIt {
  inline: {
    ruler: Ruler
  }
  block: {
    ruler: Ruler
  }
  core: {
    ruler: Ruler
  }
  renderer: {
    rules: {
      fence: Function
    }
  }
}

interface Token {
  type: string
  tag: string
  attrs: Array<string>
  nesting: number
  level: number
  children: Array<MarkdownIt>
  content: string
  markup: string
  info: string
  meta: {
    count: number
    content: string
    comment: string
  }
  block: boolean
  hidden: boolean
  attrJoin: (a: string, b: string) => void
  map: [number, number]
}

interface StateBlock {
  src: string
  md: MarkdownIt
  env: any
  tokens: Array<Token>
  bMarks: Array<number>
  eMarks: Array<number>
  tShift: Array<number>
  sCount: Array<number>
  bsCount: Array<number>
  blkIndent: number
  line: number
  lineMax: number
  tight: boolean
  pos: number
  posMax: number
  ddIndent: number
  lastIndent: number
  parentType: string
  level: number
  result: string
  push: (a: string, b: string, c: number) => Token
}

interface Options {
  direction: 'left' | 'right'
  distance: string | number
}

type renderFunction = (tokens: Array<Token>, idx: number, options: any, env: any, slf: any) => string

let count = 0
let globalOptions: Options = {
  direction: 'right',
  distance: '100px',
}

const renderContentDefault: renderFunction = (tokens, idx, _options, env, slf) => {
  if (tokens[idx].nesting === 1) {
    const { count, comment } = tokens[idx].meta
    tokens[idx].attrJoin('class', `content content_${count}`)
    window.addEventListener('load', () => {
      generationComment(count, comment)
    })
  }

  return slf.renderToken(tokens, idx, _options, env, slf)
}

export default function comment_plugin(md: MarkdownIt, options: Options) {
  globalOptions = { ...globalOptions, ...options }
  globalOptions.distance = typeof globalOptions.distance === 'number' ? `${globalOptions.distance}px` : globalOptions.distance

  function container(state: StateBlock) {
    const start = state.pos
    const marker = state.src[start]

    if (!/\[(.+)\]-(.+)-/g.test(state.src) || marker !== '[')
      return

    const result = /\[(.+)\]-(.+)-/g.exec(state.src)!
    const content = result[1]
    const comment = result[2]

    let token = state.push('content_open', 'span', 1)

    // record the serial number and comment in meta
    token.meta = {
      count,
      content,
      comment,
    }

    token = state.push('text', '', 0)
    token.content = content

    state.push('content_close', 'span', -1)

    // serial number plus one
    count++

    // go to the end of the comment
    state.pos += content.length + comment.length + 4
  }

  md.inline.ruler.before('emphasis', 'content', container)
  md.renderer.rules.content_open = renderContentDefault
}

/**
 * @description: generate comment node and append to body
 * @param {number} count serial number
 * @param {string} content content
 * @param {string} comment comment
 */
function generationComment(count: number, comment: string) {
  const contentNode: HTMLDivElement = document.querySelector(`.content_${count}`)!

  const commentNode: HTMLDivElement = document.createElement('div')
  commentNode.innerText = comment
  commentNode.className = `comment comment_${count}`

  const style = {
    position: 'absolute',
    ...(globalOptions.direction === 'right'
      ? { right: globalOptions.distance }
      : { left: globalOptions.distance }),
  }

  Object.assign(commentNode.style, style)

  document.body.appendChild(commentNode)
  if (contentNode && commentNode)
    commentNode.style.top = `${contentNode.offsetTop}px`
}
