import { describe, expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import comment_plugin from '../src/index'

const md = new MarkdownIt()

md.use(comment_plugin)

describe('test', () => {
  it('should workd', () => {
    const result = md.render(`
    
Hello [World]-This is a comment-, Please comment on this article
    
`)
    expect(result).toMatchInlineSnapshot(`
      "<p>Hello <div class=\\"content\\">World</div><div class=\\"comment\\">This is a comment</div>, Please comment on this article</p>
      "
    `)
  })
})
