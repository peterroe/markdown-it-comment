// src/index.ts
function comment_plugin(md, options) {
  const renderContentDefault = (tokens, idx, _options, env, slf) => {
    if (tokens[idx].nesting === 1)
      tokens[idx].attrJoin("class", "content");
    return slf.renderToken(tokens, idx, _options, env, slf);
  };
  const renderCommentDefault = (tokens, idx, _options, env, slf) => {
    if (tokens[idx].nesting === 1)
      tokens[idx].attrJoin("class", "comment");
    return slf.renderToken(tokens, idx, _options, env, slf);
  };
  const renderContent = options?.renderContent || renderContentDefault;
  const renderComment = options?.renderComment || renderCommentDefault;
  function container(state, silent) {
    const start = state.pos;
    const marker = state.src[start];
    if (!/\[(.+)\]-(.+)-/g.test(state.src) || marker !== "[")
      return;
    const result = /\[(.+)\]-(.+)-/g.exec(state.src);
    const content = result[1];
    const comment = result[2];
    state.push("content_open", "span", 1);
    let token = state.push("text", "", 0);
    token.content = content;
    state.push("content_close", "span", -1);
    state.push("comment_open", "span", 1);
    token = state.push("text", "", 0);
    token.content = comment;
    state.push("comment_close", "span", -1);
    state.pos += content.length + comment.length + 4;
  }
  md.inline.ruler.before("emphasis", "content", container);
  md.renderer.rules.content_open = renderContent;
  md.renderer.rules.content_close = renderContent;
  md.renderer.rules.comment_open = renderComment;
  md.renderer.rules.comment_close = renderComment;
}
export {
  comment_plugin as default
};
