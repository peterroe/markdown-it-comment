interface Ruler {
  before: (a: string, b: string, c: Function) => void
  after: (a: string, b: string, c: Function) => void
  push: (a: string, b: Function) => void
}

interface MarkdownIt {
  inline: {
    ruler: Ruler
    ruler2: Ruler
    tokenize: Function
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
      content_open: Function
      content_close: Function
      comment_open: Function
      comment_close: Function
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
  meta: any
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
  renderContent: Function
  renderComment: Function
}

type renderFunction = (tokens: Array<Token>, idx: number, options: any, env: any, slf: any) => string

function filterTextTail(state: StateBlock) {
  state.tokens.forEach((it) => {
    if (it.type === 'text' && it.content === 'undefined')
      it.content = ''
  })
}

export default function comment_plugin(md: MarkdownIt, options: Options) {
  const renderContentDefault: renderFunction = (tokens, idx, _options, env, slf) => {
    if (tokens[idx].nesting === 1)
      tokens[idx].attrJoin('class', 'md-content')

    return slf.renderToken(tokens, idx, _options, env, slf)
  }

  const renderCommentDefault: renderFunction = (tokens, idx, _options, env, slf) => {
    if (tokens[idx].nesting === 1)
      tokens[idx].attrJoin('class', 'md-comment')

    return slf.renderToken(tokens, idx, _options, env, slf)
  }

  const renderContent = options?.renderContent || renderContentDefault
  const renderComment = options?.renderComment || renderCommentDefault

  function container(state: StateBlock) {
    const start = state.pos
    const marker = state.src[start]

    if (!/\[(.+)\]\{(.+)\}/g.test(state.src) || marker !== '[')
      return

    const result = /\[(.+)\]\{(.+)\}/g.exec(state.src)!
    const content = result[1]
    const comment = result[2]

    state.push('content_open', 'span', 1)

    const max = state.posMax
    state.pos += 1
    state.posMax = state.pos + content.length

    state.md.inline.tokenize(state)

    state.push('content_close', 'span', -1)

    state.push('comment_open', 'span', 1)

    state.pos += 2
    state.posMax = state.pos + comment.length - 1
    state.md.inline.tokenize(state)

    state.push('comment_close', 'span', -1)

    // go to the end of the comment
    state.pos += 2
    state.posMax = max
  }

  md.inline.ruler.before('emphasis', 'content', container)
  md.inline.ruler2.after('emphasis', 'content', filterTextTail)
  md.renderer.rules.content_open = renderContent
  md.renderer.rules.content_close = renderContent
  md.renderer.rules.comment_open = renderComment
  md.renderer.rules.comment_close = renderComment
}
