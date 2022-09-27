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
  left: string
  right: string
  direction: 'left' | 'right'
}

type renderFunction = (tokens: Array<Token>, idx: number, options: any, env: any, slf: any) => string

let count = 0
let globalOptions: Options = {
  left: '100px',
  right: '100px',
  direction: 'right',
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
  // const renderContent = options?.renderContent || renderContentDefault
  // const renderComment = options?.renderComment || renderCommentDefault

  globalOptions = { ...globalOptions, ...options }

  function container(state: StateBlock) {
    const start = state.pos
    const marker = state.src[start]

    if (!/\[(.+)\]-(.+)-/g.test(state.src) || marker !== '[')
      return

    const result = /\[(.+)\]-(.+)-/g.exec(state.src)!
    const content = result[1]
    const comment = result[2]

    let token = state.push('content_open', 'span', 1)

    token.meta = {
      count,
      content,
      comment,
    }

    token = state.push('text', '', 0)
    token.content = content

    state.push('content_close', 'span', -1)

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
  const contentNode = document.querySelector(`.content_${count}`)
  // const commentNode = document.querySelector(`.comment_${count}`)
  const commentNode = document.createElement('div')
  commentNode.innerText = comment
  commentNode.className = `comment comment_${count}`
  const style = {
    position: 'absolute',
    ...(globalOptions.direction === 'right' ? { right: globalOptions.right } : { left: globalOptions.left }),
  }
  Object.assign(commentNode.style, style)

  console.log('commentNode', commentNode, contentNode)
  document.body.appendChild(commentNode)
  if (contentNode && commentNode)
    commentNode.style.top = `${contentNode.offsetTop}px`
    // document.querySelector('.comment')
}
