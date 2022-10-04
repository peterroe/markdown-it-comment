# markdown-it-comment

[![NPM version](https://img.shields.io/npm/v/markdown-it-comment.svg?style=flat)](https://www.npmjs.org/package/markdown-it-comment)


> Plugin for creating block-level custom containers for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.

__v2.+ requires `markdown-it` v5.+, see changelog.__

With this plugin you can create block containers like:

```
[here be content]-here be comment-
```

.... and specify how they should be rendered. If no renderer defined, `<span>` with name class will be created:

```html
<span class="content">here be content</span>
<span class="comment">here be comment</span>
```

## Installation

node.js, browser:

```bash
$ npm install markdown-it-comment --save
$ bower install markdown-it-comment --save
```


## API

```js
const md = require('markdown-it')()
  .use(require('markdown-it-comment')[,options])
```

Params:

* options:
  * renderContent - optional, renderer function for opening/closing content tokens.
  * renderComment - optional, renderer function for opening/closing comment tokens.

## Example

```js
var md = require('markdown-it')();

md.use(require('markdown-it-comment'), {

  renderContentDefault(tokens, idx, _options, env, slf) {
    if (tokens[idx].nesting === 1)
      tokens[idx].attrJoin('class', 'content')

    return slf.renderToken(tokens, idx, _options, env, slf)
  }

  renderCommentDefault(tokens, idx, _options, env, slf) {
    if (tokens[idx].nesting === 1)
      tokens[idx].attrJoin('class', 'comment')

    return slf.renderToken(tokens, idx, _options, env, slf)
  }
});

console.log(md.render('hello [world]-this is a comment-.'))

// Output: 
// <p>hello <span class="content">world</span>
// <span class="comment">this is a comment</span>.</p>


```

## Demo

https://peterroe.github.io/markdown-it-comment/

## License

[MIT](https://github.com/markdown-it/markdown-it-comment/blob/master/LICENSE)