# 地图与 HUD 改造落点

## 地图问题

当前 `GameScene` 是 16x16 等距瓦片棋盘，适合技术验证，但缺少真实场景感。后续需要改为：

- 背景场景图铺底。
- 入口、NPC、怪物作为场景对象叠加。
- 主城和野外使用不同布局密度。
- 世界地图从列表改为大地图点位选择。

## 主城场景

目标：进入游戏第一屏像一个完整页游主城，而不是棋盘。

实现方向：

- Phaser 背景使用 `src/assets/backgrounds/city_wuhun_city.png`。
- 建筑热区：世界地图、商店、铁匠铺、学院、斗魂场、宗门、任务大厅。
- Vue 面板入口保留，但视觉入口从左侧菜单扩展到场景建筑点击。
- HUD 保持贴边，中央尽量留给场景。

## 世界地图

目标：从区域列表升级为大陆地图。

实现方向：

- 使用 `src/assets/maps/world_douluo_map.png` 作为主图。
- `MAPS` 每个区域增加屏幕坐标。
- 点位按等级、阵营、锁定状态渲染。
- 选中区域后右侧展示怪物列表和掉落。

## 野外战斗

目标：战斗场景看起来像真实野外，而不是纯色框。

实现方向：

- `BattleScene` 根据 region 选择背景图。
- 玩家和怪物横向站位。
- 技能栏贴底，HP/MP 贴顶，奖励飘字保留。
- 后续再替换怪物与角色精灵。

## HUD

目标：高密度但不乱，信息贴边。

区域：

- 左上：头像、等级、称号、HP、MP、EXP、战力。
- 顶部右侧：地图名、世界地图、邮件、设置、活动入口。
- 左侧：当前地图目标/玩家/NPC 列表。
- 右侧：竖向快捷按钮。
- 右下：任务追踪。
- 底部：聊天、技能栏、快捷物品、系统入口。

## 技术落点

- `src/ui/hud/TopBar.vue`
- `src/ui/hud/LeftMenu.vue`
- `src/ui/hud/BottomBar.vue`
- `src/App.vue`
- `src/game/scenes/GameScene.ts`
- `src/game/scenes/BattleScene.ts`
- `src/ui/panels/WorldMapPanel.vue`

