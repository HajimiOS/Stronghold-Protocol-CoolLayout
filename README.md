# Coollayout

为[卫戍协议](https://github.com/sganggs/Stronghold-Protocol) 0.3.3 准备的页面布局调整。非官方同人模块。

## 开始使用

只需服主安装。玩家打开原来的地址即可，电脑和手机不用另装软件。

游戏目录是能看到 `public/index.html` 的那一层。安装后模块落到：

```
Stronghold-Protocol/plugins/coollayout/
Stronghold-Protocol/public/sp-plugins/coollayout/
```

安装程序还会改这一个文件：

```
Stronghold-Protocol/public/index.html
```

因需改宿主页面 DOM/CSS，不能只靠官方「界面插件」沙箱单独启用；脚本仍由服主注入。首次打开会默认在「设置 → 界面插件」里打开 `Coollayout`，之后可手动关闭。

### Windows

1. 关闭游戏服务。
2. 把本文件夹放到任意位置，双击 `windows/install.bat`，按提示选择游戏目录。
3. 重新启动游戏，并刷新浏览器。

更新本模块时再双击一次这个 bat。更新游戏本体前先双击 `windows/uninstall.bat`，更新完成后再安装。

### Linux

1. 关闭游戏服务。
2. 执行（把路径换成实际游戏目录）：

```sh
sh linux/install.sh /path/to/Stronghold-Protocol
```

3. 重新启动游戏服务，并刷新浏览器。

更新本模块时再执行一次上面的命令。更新游戏本体前先卸载，更新完成后再安装：

```sh
sh linux/uninstall.sh /path/to/Stronghold-Protocol
```

不能放进游戏的插件工作台来替代上述安装。

## 目录

```
plugin.json   官方插件清单（占位 frame）
client.js     宿主注入脚本
frame/        界面插件占位页
README.md
LICENSE
NOTICE.md
windows/      Windows 安装与卸载
linux/        Linux 安装与卸载
```

## 功能

- 增添大厅标题与背景的指针跟随
- 增添全屏按钮
- 增添空位亮条动画
- 优化房间顶栏的显示
- 优化延迟数字变化时旁边按钮的位置
- 优化较矮屏幕下大厅和房间的显示
- 优化手机上方形按钮的大小
- 优化空位、招募和羁绊信息的排版
- 优化大厅铭牌的显示

## 兼容

电脑、手机和平板浏览器都可以使用。触屏和较矮的屏幕会单独调整顶栏、按钮和房间布局。全屏按钮只出现在支持网页全屏的浏览器里，iPhone 自带的 Safari 不会出现。

只改网页，不改对局，也不另开端口。放进已有的 0.3.3 游戏目录后，由原来的网站一起提供。服主和玩家都不用再安装运行环境。

## 许可与声明

本模块自己编写的代码以 **GPL-3.0-or-later** 发布，全文见 [LICENSE](LICENSE)。

非官方、非商业同人模块，与上海鹰角网络科技有限公司、Yostar 及卫戍协议原作者没有关系，未获其授权。本仓库不包含游戏美术、音乐、文本或数据，这些内容版权归原权利人所有，不适用上述许可证。按原样提供，不提供担保。完整说明见 [NOTICE.md](NOTICE.md)。
