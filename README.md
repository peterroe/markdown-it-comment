# markdown-it-comment

[![NPM version](https://img.shields.io/npm/v/markdown-it-comment.svg?style=flat)](https://www.npmjs.org/package/markdown-it-comment)


> Plugin for creating custom comment for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.

__v2.+ requires `markdown-it` v5.+, see changelog.__

With this plugin you can create comments like:

```
[here be content]{here be comment}
```

.... and specify how they should be rendered. If no renderer defined, `<span>` with name class will be created:

```html
<span class="md-content">here be content</span>
<span class="md-comment">here be comment</span>
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
const md = require('markdown-it')()

md.use(require('markdown-it-comment'), {

  renderContentDefault(tokens, idx, _options, env, slf) {
    if (tokens[idx].nesting === 1)
      tokens[idx].attrJoin('class', 'md-content')

    return slf.renderToken(tokens, idx, _options, env, slf)
  },

  renderCommentDefault(tokens, idx, _options, env, slf) {
    if (tokens[idx].nesting === 1)
      tokens[idx].attrJoin('class', 'md-comment')

    return slf.renderToken(tokens, idx, _options, env, slf)
  }
})

console.log(md.render('hello [world]{this is a comment}'))

// Output:
// <p>hello <span class="md-content">world</span>
// <span class="md-comment">this is a comment</span></p>

```

## Style

Recommended style for comments:

```css
.md-content {
  display: inline-block;
  border-bottom: 2px solid #ffc60a;
}
.md-content:hover {
  background-color: #faf1d1;
}
.md-content:hover + .md-comment {
  opacity: 1;
  animation: appear 0.5s;
}
@keyframes appear {
  from {
    right: -100px;
  }
  to {
    right: 30px;
  }
}
.md-comment {
  display: inline-block;
  opacity: 0;
  text-align: left;
  position: fixed;
  transform: translateY(-50%);
  top: 50%;
  right: 30px;
  border: 1px solid #ddd;
  border-top: 6px solid #ffc60a;
  border-radius: 8px;
  padding: 10px 16px;
  box-shadow: 0px 0px 16px #ddd;
  transition: all .4s ease-out;
  width: 250px;
}

@media (max-width: 1200px) {
  .md-comment {
    display: none;
  }
}
```


## Demo

https://peterroe.github.io/markdown-it-comment/

## License

[MIT](https://github.com/markdown-it/markdown-it-comment/blob/master/LICENSE)