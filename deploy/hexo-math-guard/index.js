'use strict';

hexo.extend.filter.register('markdown-it:renderer', function (md) {
  md.use(require('./lib/math-guard'));
  return md;
});
