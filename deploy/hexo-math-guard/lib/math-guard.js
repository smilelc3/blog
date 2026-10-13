'use strict';

const DOLLAR = 0x24;

module.exports = function mathGuard(md) {
  function mathRule(state, silent) {
    const src = state.src;
    const start = state.pos;

    if (src.charCodeAt(start) !== DOLLAR) return false;

    let run = 0;
    while (src.charCodeAt(start + run) === DOLLAR) run++;
    const open = run >= 2 ? 2 : 1;

    let i = start + open;
    let close = -1;
    while (i < src.length) {
      if (src.charCodeAt(i) === DOLLAR) {
        let r = 0;
        while (src.charCodeAt(i + r) === DOLLAR) r++;
        if (r >= open) { close = i; break; }
        i += r;
        continue;
      }
      i++;
    }
    if (close === -1) return false;

    if (!silent) {
      const token = state.push('text', '', 0);
      token.content = src.slice(start, close + open);
    }
    state.pos = close + open;
    return true;
  }

  md.inline.ruler.before('emphasis', 'math_guard', mathRule);

  return md;
};
