import { describe, expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import comment_plugin from '../src/index'

const md = new MarkdownIt()

md.use(comment_plugin as any)

describe('test', () => {
  it('should workd', () => {
    const result = md.render(`
    
Hello [World]{This is a comment}, Please comment on this article
    
`)
    expect(result).toMatchInlineSnapshot(`
      "<p>Hello <span class=\\"content\\">World</span><span class=\\"comment\\">This is a comment</span>, Please comment on this article</p>
      "
    `)
  })

  it('should workd', () => {
    const result = md.render(`
    
Hello [World]{This is a comment}
    
`)
    expect(result).toMatchInlineSnapshot(`
      "<p>Hello <span class=\\"content\\">World</span><span class=\\"comment\\">This is a comment</span></p>
      "
    `)
  })
})
