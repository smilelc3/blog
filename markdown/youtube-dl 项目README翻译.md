---
title: youtube-dl 项目README翻译
date: 2019-03-23
---

该文章是对`youtube-dl` 项目`README.md`文件的翻译，项目地址：<https://github.com/ytdl-org/youtube-dl/blob/master/README.md#readme>

当前版本：v2019.03.18

---

youtube-dl - 从youtube.com或其他视频平台下载视频

- [安装](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#installation)
- [描述](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#description)
- [选项](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#options)
- [参数](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#configuration)
- [输出模板](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#output-template)
- [格式选择](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#format-selection)
- [视频选择](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#video-selection)
- [常见问题](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#faq)
- [开发者向导](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#developer-instructions)
- [嵌入 YOUTUBE-DL](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#embedding-youtube-dl)
- [BUGS](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#bugs)
- [版权](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#copyright)

# 安装

立即为所有UNIX用户安装 (如Linux, macOS, 等)，输入：

```bash
sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl
```

如果你没有curl工具， 你也可以使用相近的wget工具：

```bash
sudo wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl
```

Windows用户可以 [下载exe文件](https://yt-dl.org/latest/youtube-dl.exe) 并且放在除了`%SYSTEMROOT%\System32`以外任何的[PATH](https://en.wikipedia.org/wiki/PATH_%28variable%29) 位置 (例如：**不要** 放在 `C:\Windows\System32`).

你也可以通过pip安装：

```bash
sudo -H pip install --upgrade youtube-dl
```

如果你早已安装youtube-dl，该命令行将会更新它。想获取更多信息，请参阅 [pypi page](https://pypi.python.org/pypi/youtube_dl)。

macOS用户可以通过[Homebrew](https://brew.sh/)工具来安装youtube-dl：

```bash
brew install youtube-dl
```

或则使用 [MacPorts](https://www.macports.org/)工具：

```bash
sudo port install youtube-dl
```

此外，参考 [开发者向导](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#developer-instructions) 来查看如何使用git仓库。 想获取包括PGP签名的更多选项，请参阅[youtube-dl 下载界面](https://ytdl-org.github.io/youtube-dl/download.html)。

# 描述

**youtube-dl**是一款命令行工具，可以从YouTube.com和一些其他站点下载视频。它依赖于Python解释器，解释器版本要求为 2.6, 2.7, 或者 3.2+，并不限制于特定平台。它应该可以运行在类Unix，Windows和macOS平台上。其被发布于公共域， 意味着你可以修改、重新分发、或凭个人意愿使用它。

```bash
youtube-dl [OPTIONS] URL [URL...]
```

# 选项

```bash
-h, --help						打印帮助文档并退出
--version						打印程序版本信息并退出
-U, --update					更新程序至最新版本，需保证拥有足够权限（如需可使用sudo命令）
-i, --ignore-errors				当下载错误时继续，例如在播放列表跳过不可获取视频
--abort-on-error				当下载错误时停止下载其他视频（例如在播放列表和命令行）
--dump-user-agent				展示当前浏览器标识
--list-extractors				列出所有的提取器
--extractor-descriptions		输出所有支持的提取器描述
--force-generic-extractor		强制使用通用提取器
--default-search PREFIX 		使用前缀补全不完整的URLs。例如“gvsearch2:”利用youtube-dl从google视频中下载两个有关“大苹果”的视频，使用"auto"参数让youtube-dl自行猜一个（猜测时，"auto_warning"将会抛出）。"error"参数就会抛出错误。默认值"fixup_error"会修复不完整URLs，如果不是搜索相关就无法实现，会抛出错误。
--ignore-config      			当使用全局配置文件/etc/youtube-dl.conf时，不再读取用户的配置文件~/.config/youtube-dl/config（Windows下为%APPDATA%/youtube-dl/config.txt）
--config-location PATH			配置文件的配置，既可以是配置文件的路径或包含其的目录
--flat-playlist					仅列出视频列表而不下载
--mark-watched 					标记看过此视频（仅对YouTube）
--no-mark-watched				不标记看过此视频（仅对YouTube）
--no-color						对屏幕输出结果不上色
```

## 网络选项:

```bash
--proxy URL						使用HTTP/HTTPS/SOCKS代理。需指定一个具体的协议，例如：socks5://127.0.0.1:1080/。传入空字段（--proxy ""）将会直连
--socket-timeout SECONDS		放弃连接前的等待时间，秒为单位
--source-address IP				绑定客户端的IP地址
-4, --force-ipv4				所有连接强制走IPv4协议
-6, --force-ipv6				所有连接强制走IPv6协议
```

## 地区限制:

```bash
--geo-verification-proxy URL	在一些地区限制网址使用代理IP地址。由--proxy指定的默认代理（如果该选项不存在，则为none）用于实际下载。
--geo-bypass					通过伪装HTTP头：X-Forwarded-For 来绕过地区限制 
--no-geo-bypass					不用伪装HTTP头：X-Forwarded-For 来绕过地区限制
--geo-bypass-country CODE		利用提供具体的双字母ISO 3166-2国别码强制绕过地区限制
--geo-bypass-ip-block IP_BLOCK	使用CIDR表示法中明确提供的IP块强制绕过地理限制
```

## 视频选择:

```bash
--playlist-start NUMBER			播放列表中从第几个开始下载（默认是1）
--playlist-end NUMBER			播放列表中到第几个结束下载（默认最后一个）
--playlist-items ITEM_SPEC		指定列表中要下载的视频项目编号。如："--playlist-items 1,2,5,8"或"--playlist-items 1-3,7,10-13"
--match-title REGEX				下载标题匹配的视频（可用正则表达式或区分大小写的子字符串）
--reject-title REGEX			跳过下载标题匹配的视频（可用正则表达式或区分大小写的子字符串）
--max-downloads NUMBER			下载NUMBER个文件后中止
--min-filesize SIZE				不下载小于SIZE的视频（例如：50k或44.6m）
--max-filesize SIZE				不下载大于SIZE的视频（例如：50k或44.6m）
--date DATE						仅下载指定上传日期的视频
--datebefore DATE				仅下载指定上传日期或之前的视频
--dateafter DATE				仅下载指定上传日期或之后的视频
--min-views COUNT				不下载观看次数小于COUNT的视频
--max-views COUNT				不下载观看次数大于COUNT的视频
--match-filter FILTER			通用视频过滤器。可指定任何键（有关可用key列表，请参阅“OUTPUT TEMPLATE”）!key检查密钥是否不存在,key>NUMBER（如“comment_count> 12”，也适用于> =，<，<=，!=，=） 比较一个数字，key ='LITERAL'（比如“uploader ='Mike Smith'，也适用于!=）来匹配字符串文字可用&实现多个匹配。 除非您在参数后加问号（?），否则将排除未知的值。例如，要仅匹配已liked超过100次并且disliked不到50次的视频（或者在给定视频中不可用的不喜欢功能）并且有视频描述，请使用--match-filter "like_count > 100&dislike_count <? 50 & description"。
--no-playlist					如果URL指向视频和播放列表，则仅下载视频
--yes-playlist					如果URL指向视频和播放列表，则仅下载播放列表
--age-limit YEARS				仅下载适合特定年龄的视频
--download-archive FILE			仅下载存档文件中未列出的视频。记录下载所有视频的ID。
--include-ads					下载时同时下载广告（实验性功能）
```

## 下载选项:

```bash
-r, --limit-rate RATE			最大下载速率（bps）（例如 50K 或 4.2M）
-R, --retries RETRIES			重试次数。（默认10，可选 "infinite"）
--fragment-retries RETRIES		片段重试次数（默认10），可选 "infinite"）(DASH, hlsnative and ISM)
--skip-unavailable-fragments   	跳过不可用片段 (DASH, hlsnative and ISM)
--abort-on-unavailable-fragment	当片段不可获取时，中断下载
--keep-fragments				下载完成后，将下载的片段保存在磁盘上; 片段默认被删除
--buffer-size SIZE				下载缓存大小（例如 1024 或 16K）（默认 1024）
--no-resize-buffer				不自动调整缓存大小。默认情况下，缓存大小会基于初始大小自动调整
--http-chunk-size SIZE			基于块的HTTP下载的块的大小（例如10485760或10M）（默认为禁用）。 可能有助于绕过网络服务器强加的带宽限制（实验性功能）                  
--playlist-reverse				逆序下载视频列表
--playlist-random				随机顺序下载视频列表
--xattr-set-filesize			设定xattribute ytdl文件大小
--hls-prefer-native				使用原生HLS代替ffmpeg进行下载
--hls-prefer-ffmpeg				使用ffmpeg代替原生HLS进行下载
--hls-use-mpegts				使用mpegts容器获取HLS视频，允许在下载时播放视频（某些播放器可能无法播放）
--external-downloader COMMAND	使用指定的外部下载程序。目前支持aria2c，avconv，axel，curl，ffmpeg，httpie，wget
--external-downloader-args ARGS 为外部下载器指定参数
```

## 文件系统选项:

```
-a, --batch-file FILE            File containing URLs to download ('-' for
                                 stdin), one URL per line. Lines starting
                                 with '#', ';' or ']' are considered as
                                 comments and ignored.
--id                             Use only video ID in file name
-o, --output TEMPLATE            Output filename template, see the "OUTPUT
                                 TEMPLATE" for all the info
--autonumber-start NUMBER        Specify the start value for %(autonumber)s
                                 (default is 1)
--restrict-filenames             Restrict filenames to only ASCII
                                 characters, and avoid "&" and spaces in
                                 filenames
-w, --no-overwrites              Do not overwrite files
-c, --continue                   Force resume of partially downloaded files.
                                 By default, youtube-dl will resume
                                 downloads if possible.
--no-continue                    Do not resume partially downloaded files
                                 (restart from beginning)
--no-part                        Do not use .part files - write directly
                                 into output file
--no-mtime                       Do not use the Last-modified header to set
                                 the file modification time
--write-description              Write video description to a .description
                                 file
--write-info-json                Write video metadata to a .info.json file
--write-annotations              Write video annotations to a
                                 .annotations.xml file
--load-info-json FILE            JSON file containing the video information
                                 (created with the "--write-info-json"
                                 option)
--cookies FILE                   File to read cookies from and dump cookie
                                 jar in
--cache-dir DIR                  Location in the filesystem where youtube-dl
                                 can store some downloaded information
                                 permanently. By default
                                 $XDG_CACHE_HOME/youtube-dl or
                                 ~/.cache/youtube-dl . At the moment, only
                                 YouTube player files (for videos with
                                 obfuscated signatures) are cached, but that
                                 may change.
--no-cache-dir                   Disable filesystem caching
--rm-cache-dir                   Delete all filesystem cache files
```

## Thumbnail images:

```
--write-thumbnail                Write thumbnail image to disk
--write-all-thumbnails           Write all thumbnail image formats to disk
--list-thumbnails                Simulate and list all available thumbnail
                                 formats
```

## Verbosity / Simulation Options:

```
-q, --quiet                      Activate quiet mode
--no-warnings                    Ignore warnings
-s, --simulate                   Do not download the video and do not write
                                 anything to disk
--skip-download                  Do not download the video
-g, --get-url                    Simulate, quiet but print URL
-e, --get-title                  Simulate, quiet but print title
--get-id                         Simulate, quiet but print id
--get-thumbnail                  Simulate, quiet but print thumbnail URL
--get-description                Simulate, quiet but print video description
--get-duration                   Simulate, quiet but print video length
--get-filename                   Simulate, quiet but print output filename
--get-format                     Simulate, quiet but print output format
-j, --dump-json                  Simulate, quiet but print JSON information.
                                 See the "OUTPUT TEMPLATE" for a description
                                 of available keys.
-J, --dump-single-json           Simulate, quiet but print JSON information
                                 for each command-line argument. If the URL
                                 refers to a playlist, dump the whole
                                 playlist information in a single line.
--print-json                     Be quiet and print the video information as
                                 JSON (video is still being downloaded).
--newline                        Output progress bar as new lines
--no-progress                    Do not print progress bar
--console-title                  Display progress in console titlebar
-v, --verbose                    Print various debugging information
--dump-pages                     Print downloaded pages encoded using base64
                                 to debug problems (very verbose)
--write-pages                    Write downloaded intermediary pages to
                                 files in the current directory to debug
                                 problems
--print-traffic                  Display sent and read HTTP traffic
-C, --call-home                  Contact the youtube-dl server for debugging
--no-call-home                   Do NOT contact the youtube-dl server for
                                 debugging
```

## Workarounds:

```
--encoding ENCODING              Force the specified encoding (experimental)
--no-check-certificate           Suppress HTTPS certificate validation
--prefer-insecure                Use an unencrypted connection to retrieve
                                 information about the video. (Currently
                                 supported only for YouTube)
--user-agent UA                  Specify a custom user agent
--referer URL                    Specify a custom referer, use if the video
                                 access is restricted to one domain
--add-header FIELD:VALUE         Specify a custom HTTP header and its value,
                                 separated by a colon ':'. You can use this
                                 option multiple times
--bidi-workaround                Work around terminals that lack
                                 bidirectional text support. Requires bidiv
                                 or fribidi executable in PATH
--sleep-interval SECONDS         Number of seconds to sleep before each
                                 download when used alone or a lower bound
                                 of a range for randomized sleep before each
                                 download (minimum possible number of
                                 seconds to sleep) when used along with
                                 --max-sleep-interval.
--max-sleep-interval SECONDS     Upper bound of a range for randomized sleep
                                 before each download (maximum possible
                                 number of seconds to sleep). Must only be
                                 used along with --min-sleep-interval.
```

## Video Format Options:

```
-f, --format FORMAT              Video format code, see the "FORMAT
                                 SELECTION" for all the info
--all-formats                    Download all available video formats
--prefer-free-formats            Prefer free video formats unless a specific
                                 one is requested
-F, --list-formats               List all available formats of requested
                                 videos
--youtube-skip-dash-manifest     Do not download the DASH manifests and
                                 related data on YouTube videos
--merge-output-format FORMAT     If a merge is required (e.g.
                                 bestvideo+bestaudio), output to given
                                 container format. One of mkv, mp4, ogg,
                                 webm, flv. Ignored if no merge is required
```

## Subtitle Options:

```
--write-sub                      Write subtitle file
--write-auto-sub                 Write automatically generated subtitle file
                                 (YouTube only)
--all-subs                       Download all the available subtitles of the
                                 video
--list-subs                      List all available subtitles for the video
--sub-format FORMAT              Subtitle format, accepts formats
                                 preference, for example: "srt" or
                                 "ass/srt/best"
--sub-lang LANGS                 Languages of the subtitles to download
                                 (optional) separated by commas, use --list-
                                 subs for available language tags
```

## Authentication Options:

```
-u, --username USERNAME          Login with this account ID
-p, --password PASSWORD          Account password. If this option is left
                                 out, youtube-dl will ask interactively.
-2, --twofactor TWOFACTOR        Two-factor authentication code
-n, --netrc                      Use .netrc authentication data
--video-password PASSWORD        Video password (vimeo, smotri, youku)
```

## Adobe Pass Options:

```
--ap-mso MSO                     Adobe Pass multiple-system operator (TV
                                 provider) identifier, use --ap-list-mso for
                                 a list of available MSOs
--ap-username USERNAME           Multiple-system operator account login
--ap-password PASSWORD           Multiple-system operator account password.
                                 If this option is left out, youtube-dl will
                                 ask interactively.
--ap-list-mso                    List all supported multiple-system
                                 operators
```

## Post-processing Options:

```
-x, --extract-audio              Convert video files to audio-only files
                                 (requires ffmpeg or avconv and ffprobe or
                                 avprobe)
--audio-format FORMAT            Specify audio format: "best", "aac",
                                 "flac", "mp3", "m4a", "opus", "vorbis", or
                                 "wav"; "best" by default; No effect without
                                 -x
--audio-quality QUALITY          Specify ffmpeg/avconv audio quality, insert
                                 a value between 0 (better) and 9 (worse)
                                 for VBR or a specific bitrate like 128K
                                 (default 5)
--recode-video FORMAT            Encode the video to another format if
                                 necessary (currently supported:
                                 mp4|flv|ogg|webm|mkv|avi)
--postprocessor-args ARGS        Give these arguments to the postprocessor
-k, --keep-video                 Keep the video file on disk after the post-
                                 processing; the video is erased by default
--no-post-overwrites             Do not overwrite post-processed files; the
                                 post-processed files are overwritten by
                                 default
--embed-subs                     Embed subtitles in the video (only for mp4,
                                 webm and mkv videos)
--embed-thumbnail                Embed thumbnail in the audio as cover art
--add-metadata                   Write metadata to the video file
--metadata-from-title FORMAT     Parse additional metadata like song title /
                                 artist from the video title. The format
                                 syntax is the same as --output. Regular
                                 expression with named capture groups may
                                 also be used. The parsed parameters replace
                                 existing values. Example: --metadata-from-
                                 title "%(artist)s - %(title)s" matches a
                                 title like "Coldplay - Paradise". Example
                                 (regex): --metadata-from-title
                                 "(?P<artist>.+?) - (?P<title>.+)"
--xattrs                         Write metadata to the video file's xattrs
                                 (using dublin core and xdg standards)
--fixup POLICY                   Automatically correct known faults of the
                                 file. One of never (do nothing), warn (only
                                 emit a warning), detect_or_warn (the
                                 default; fix file if we can, warn
                                 otherwise)
--prefer-avconv                  Prefer avconv over ffmpeg for running the
                                 postprocessors
--prefer-ffmpeg                  Prefer ffmpeg over avconv for running the
                                 postprocessors (default)
--ffmpeg-location PATH           Location of the ffmpeg/avconv binary;
                                 either the path to the binary or its
                                 containing directory.
--exec CMD                       Execute a command on the file after
                                 downloading, similar to find's -exec
                                 syntax. Example: --exec 'adb push {}
                                 /sdcard/Music/ && rm {}'
--convert-subs FORMAT            Convert the subtitles to other format
                                 (currently supported: srt|ass|vtt|lrc)
```
