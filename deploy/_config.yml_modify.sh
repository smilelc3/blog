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

  .markdown.plugins = ["markdown-it-footnote"] |
  .markdown.disable_rules = ["emphasis", "strikethrough"] |

  .deploy.type = "git" |
  .deploy.repo = "git@github.com:smilelc3/smilelc3.github.io.git" |
  .deploy.branch = "master"
' $config_path