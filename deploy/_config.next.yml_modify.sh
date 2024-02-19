#!/bin/bash

config_path=$1

yq --inplace $'
  .minify = true |
  .darkmode = true |

  .menu.home = "/ || fa fa-home" |
  .menu.archives = "/archives/ || fa fa-archive" |

  .social.GitHub = "https://github.com/smilelc3 || fab fa-github" |
  .social.E-Mail = "mailto:smile@liuchang.men || fa fa-envelope" |
  
  .toc.number = false |
  .toc.wrap = true |

  .footer.powered = false |

  .codeblock.highlight_theme = "night" |

  .reading_progress.enable = true |

  .github_banner.enable = true |
  .github_banner.permalink = "https://github.com/smilelc3" |

  .math.every_page = true |
  .math.mathjax.enable = true |
  .math.mathjax.tags = "ams"  |

  .fancybox = true |

  .lazyload = true |

  .quicklink.enable = true |
  
  .utterances.enable = true |
  .utterances.repo = "smilelc3/smilelc3.github.io" |
  .utterances.theme = "github-dark" |

  .local_search.enable = true |
  .local_search.unescape = true |
  .local_search.preload = true
' $config_path
