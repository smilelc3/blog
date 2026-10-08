#!/bin/bash
set -euo pipefail

config_path=$1

yq --inplace $'
  .title = "生命不息，奋斗不止" |

  .description = "smile\'s blog" |

  .author = "smile" |

  .language = "zh-CN" |

  .timezone = "Asia/Shanghai" |

  .url = "https://liuchang.men" |

  .index_generator.per_page = 4 |
  
  .theme = "next" |

  # markdown-it 渲染器（替代 pandoc）：footnote 提供脚注。
  # 数学公式交给主题自带的 MathJax 在前端渲染；公式里的 _ 由
  # hexo-mermaid-diagram 插件的 math-guard 规则保护，详见该插件的说明。
  # 注意：不要关闭 markdown-it 的 emphasis 规则 —— 它是核心规则，
  # 同时负责 *、_、**、__，关掉会让 **粗体** 一起失效。
  .markdown.plugins = ["markdown-it-footnote"] |

  .deploy.type = "git" |
  .deploy.repo = "git@github.com:smilelc3/smilelc3.github.io.git" |
  .deploy.branch = "master"
' $config_path