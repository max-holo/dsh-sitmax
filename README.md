# dsh-sitmax

[![npm](https://img.shields.io/npm/v/dsh-sitmax.svg)](https://www.npmjs.com/package/dsh-sitmax)
[![weekly downloads](https://img.shields.io/npm/dw/dsh-sitmax.svg)](https://www.npmjs.com/package/dsh-sitmax)

DeepSeek Harness（DSH）插件：久坐提醒「跑道小人」。

久坐提醒插件：跑道环形 HUD 实时显示已坐时长，到点提醒你站起来，离开自动暂停，每天一份久坐报告。

- 顶部居中：**环形操场跑道**，一个小人沿跑道跑动（即本轮久坐进度，默认 15 分钟跑完一圈），跑道中心的沙金小字显示已坐时间 / 状态；
- 每连续坐 30 分钟弹出「该起来走走了」卡片（可休息 5 分钟 / 暂缓 5 分钟），附桌面系统通知 + 提示音；
- 键鼠活动检测：无操作自动暂停，回来智能恢复，离开过久自动按一次休息重置；**默认使用 Windows 系统级空闲检测（`GetLastInputInfo`）**——在别的软件/标签页活动也算在工作，只有整个系统都无输入才判定离开（仅 Windows；不可用时自动回退为页面内检测）；
- 设置页（`settings.section`）：循环/提醒/休息/暂缓/离开判定时长 + 开关，存 localStorage；
- 每日报告页：今天久坐时长、提醒/休息/轮次次数，近 7 天柱状图。

## 目录结构（本目录即 npm 包）

| 文件 | 作用 |
| --- | --- |
| `package.json` | 包清单：`dsh.bundle.patch` + `dsh.client`（web 平台） |
| `cordis.patch.yml` | bundle 补丁层：向组合树插入一行 `dsh-sitmax` |
| `host.cjs` | Host 半部：常驻 PowerShell 子进程轮询 Windows `GetLastInputInfo`（系统级键鼠空闲），经 `/api/dsh-sitmax/idle` 供浏览器端读取 |
| `src-client/index.js` | 浏览器半部：HUD + 弹窗 + 设置页 + 报告页 |
| `lib/client.js` | 构建产物（`build-client.cjs` 生成，随包发布） |
| `build-client.cjs` | 客户端 bundle 构建脚本（无外部构建依赖） |

## 安装 / 升级

```powershell
# DSH 插件页 → 发现 → 搜索 dsh-sitmax → 安装；或命令行：
dsh plugin --profile web add dsh-sitmax
```

要求 DSH `>= 0.2.2-0 < 0.3.0`。纯客户端插件：安装后**刷新页面**即生效。

从源码运行（开发）：

```powershell
git clone https://github.com/max-holo/dsh-sitmax.git
dsh plugin --profile web add <克隆目录>
# 改动 src-client/ 后重新构建，再刷新页面
node build-client.cjs
```

## 使用

- 点跑道：手动暂停 / 继续；
- **收起 / 展开**：平时只显示 30px 的小进度环（不挡界面），悬停展开完整跑道 + 时间 + 按钮；
- **可拖动**：按住拖到任意位置，位置存 localStorage（`dsh.sitmax.pos.v1`）自动记住；**双击复位**回顶部居中；
- 左侧栏「设置」→「久坐沙漏 · 设置 / 报告」；
- 桌面通知首次使用需在设置页点「请求 / 测试桌面通知」授权；
- 数据（配置 + 每日历史）存在浏览器 localStorage（`dsh.sitmax.cfg.v1` / `dsh.sitmax.hist.v1`），跨会话累计。
