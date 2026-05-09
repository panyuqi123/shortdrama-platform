# 短剧平台 - 技术选型方案

> 选型原则：好招人、好迭代、成本低、跑得快
> 生成时间：2026-05-08

---

## 一、技术选型总览

```
┌──────────────────────────────────────────────────────────┐
│                       用户层                              │
│    iOS App (React Native)   │   Android App (React Native)│
│    Web 端 (Next.js)         │   H5 落地页 (Next.js)       │
└─────────────────────────────┼────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    API Gateway     │
                    │   (Nginx / Kong)   │
                    └─────────┬──────────┘
                              │
┌─────────────────────────────▼────────────────────────────┐
│                    后端服务层                              │
│  ┌────────────────┐    ┌────────────────┐               │
│  │  BFF 层        │    │  业务服务层     │               │
│  │  (Node.js)     │    │  (Node.js / Go)│               │
│  └────────────────┘    └────────────────┘               │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │          微服务（SaaS 替代，自研 MVP 阶段可选）     │    │
│  │  用户服务 │ 内容服务 │ 支付服务 │ 推荐服务         │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────┬────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────┐
│                    基础设施层                              │
│                                                          │
│  数据库层                                                 │
│  ├─ 主库：PostgreSQL (Supabase / Neon)                  │
│  ├─ 缓存：Redis (Upstash / Railway)                      │
│  └─ 搜索：Meilisearch（轻量，部署简单）                   │
│                                                          │
│  视频基础设施（关键！）                                    │
│  ├─ 存储 + 转码 + 播放：Cloudflare Stream ⭐ 推荐         │
│  │   （或：阿里云视频点播 VOD / AWS Elemental）           │
│  ├─ CDN 分发：Cloudflare CDN                            │
│  └─ 防盗链：Cloudflare Stream 自带签名 URL               │
│                                                          │
│  支付基础设施                                             │
│  ├─ 国际：Stripe（信用卡/PayPal）                        │
│  ├─ 印尼本地：Xendit（GoPay/OVO/BCA/运营商计费）⭐       │
│  └─ 应用内购：Google Play / App Store                   │
│                                                          │
│  部署 & 运维                                              │
│  ├─ 托管平台：Vercel（前端）+ Railway / Render（后端）    │
│  │   （省钱快速出 MVP，不用管服务器运维）                  │
│  └─ 容器化：Docker（后续扩缩容用）                        │
└──────────────────────────────────────────────────────────┘
```

---

## 二、逐项选型说明

---

### 1. 移动端：React Native > Flutter

**推荐：React Native**

| 对比项 | React Native | Flutter |
|--------|-------------|---------|
| 生态 | 更大，印尼开发者多 | 相对少，不好招 |
| Web 复用 | 与 React Web 共享部分代码 | 完全独立 |
| 学习成本 | 前端工程师直接上手 | 需要学 Dart |
| 第三方库 | 极多（支付、推送、统计）| 较少 |
| 迭代速度 | 快 | 快 |
| Facebook/Meta 支持 | 原生 | 需要第三方 |

**选型理由**：你们是两人团队 + 印尼同事，React Native 更容易找到帮手，长期好招人。前端基础好上手，可以快速出活。

> 如果团队 Flutter 经验更丰富，选 Flutter 也完全可以。核心是**一套代码两端跑**。

---

### 2. Web 端：Next.js（App Router）

**推荐：Next.js 15 + React 19 + TypeScript**

- SSR/SSG 支持 SEO（H5 落地页需要）
- 与 React Native 共用组件库（如 Reach UI）
- Vercel 一键部署
- 生态成熟，社区活跃

---

### 3. 后端：Node.js（Fastify）⭐ 主推

**推荐：Node.js + Fastify**

| 对比项 | Node.js | Go |
|--------|---------|-----|
| 团队适配 | 前端全员能写 | 需要额外学习 |
| 生态 | npm 库极多 | 较少但质量高 |
| 视频/流媒体 | 够用（配合 FFmpeg）| 性能更强 |
| 开发速度 | 快（原型阶段）| 中等 |
| 并发 | V8 优化后不错 | 更高 |

**选型理由**：
- MVP 阶段 Node.js 够用，你们两人团队前端肯定更强
- Fastify 比 Express 快 2-3 倍，API 性能不输
- 后续如果性能成瓶颈，再拆分 Go 微服务即可

> 备选：如果预计付费用户 > 50 万 / 日活 > 500 万，Go 更稳。

---

### 4. 数据库：PostgreSQL（Supabase）

**推荐：PostgreSQL via Supabase**

- Supabase = Postgres + 鉴权 + 实时订阅 + Storage + Edge Functions
- 免费额度够跑 MVP（2GB 数据库，8GB 文件存储）
- 印尼同事如果懂 SQL 就能上手
- 支持 Row Level Security（RLS），安全策略写在数据库层

**备选**：
- Neon（更轻量的 Serverless Postgres）
- MySQL（如果团队 MySQL 经验更多）

---

### 5. 缓存：Redis（Upstash）

**推荐：Upstash Redis**

- Serverless，按请求计费，不用管理服务器
- 支持 Kafka 兼容的事件队列（Upstash Kafka）
- 免费额度：10K 命令/天

**备选**：Redis（自建或 Railway）

---

### 6. 搜索：Meilisearch

**推荐：Meilisearch（自托管或 Meilisearch Cloud）**

- 安装简单：`docker run`
- 搜索速度快（< 50ms）
- 支持中文分词（当然印尼语也支持）
- 功能全：过滤、分面、排序、纠错

> 对比 Elasticsearch：轻量太多，运维简单，MVP 用它足够。

---

### 7. 视频基础设施：Cloudflare Stream ⭐⭐⭐

**这是整个平台最关键的基础设施选择。**

**推荐：Cloudflare Stream**

| 功能 | Cloudflare Stream |
|------|-------------------|
| 上传存储 | ✅ 按存储时长计费 |
| 转码（多码率）| ✅ 全自动，10分钟出片 |
| CDN 分发 | ✅ 全球 300+ 节点 |
| 播放器 | ✅ 嵌入式，定制化强 |
| 防盗链 | ✅ 签名 URL，开箱即用 |
| 付费墙视频 | ✅ 支持（HLS 片段级保护）|
| 费用 | ~$5/千分钟播放 |
| 中国大陆 | ⚠️ 访问受限（但你们主攻印尼，无影响）|

**为什么不用其他方案：**

| 方案 | 问题 |
|------|------|
| 自建 FFmpeg + S3 | 运维复杂，转码慢，CDN 费用高 |
| AWS Elemental | 贵，配置复杂 |
| 阿里云 VOD | 印尼访问质量不稳定 |
| Mux | 便宜好用，但印尼/东南亚节点不如 CF |
| YouTube embed | 无法做付费墙，版权风险大 |

> **特别说明**：Cloudflare Stream 的付费墙功能支持 `video.access_control.allow_permission` 逻辑，配合后端 JWT 鉴权，可以做到"未解锁用户只能看试看片段"，这是红果短剧的核心功能之一。

**备选**：AWS MediaConvert + CloudFront（更便宜，但需要自己搭防盗链逻辑）

---

### 8. 支付：Stripe + Xendit 双轨

**Stripe（国际支付）**
- 信用卡、PayPal、Apple Pay、Google Pay
- 全球覆盖，API 友好
- 结算周期快（2天）

**Xendit（印尼本地支付）⭐）**
- GoPay、OVO、DANA
- 运营商计费（Telkomsel / XL / Indosat）
- 银行转账（VA）
- 覆盖印尼 90% 主流支付方式
- 有中文文档，团队友好

> 为什么两个都要接？
> - Stripe 搞定欧美用户（方便后续扩张）
> - Xendit 搞定印尼本地用户（提升转化率，减少苹果/谷歌税）

**关于苹果税**：
- App 内购必须走 IAP，苹果抽 30%（小开发者 15%）
- H5/Web 端不走 IAP，可以规避苹果税
- **建议：iOS App 走 IAP，Android + Web 走 Xendit/Stripe**

---

### 9. 部署架构

```
┌─────────────────────────────────────────┐
│              开发 & 协作                  │
│  GitHub + GitHub Actions（CI/CD）        │
│  Linear / Notion（项目跟踪）             │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           前端部署（Vercel）              │
│  ├─ Web App (next.example.com)          │
│  └─ H5 落地页 (m.example.com)          │
├─────────────────────────────────────────┤
│           后端部署（Railway / Render）   │
│  ├─ API 服务 (api.example.com)         │
│  └─ 按需扩缩容，不用管服务器             │
├─────────────────────────────────────────┤
│           数据层（Supabase Cloud）        │
│  ├─ PostgreSQL                         │
│  ├─ Auth & Storage                     │
│  └─ Edge Functions（轻量后端逻辑）       │
└─────────────────────────────────────────┘
```

**推荐理由：**
- Vercel + Railway + Supabase = 全托管，0 运维
- 两人团队不需要 DevOps，专注写代码
- 等用户量上来（>10 万 DAU）再迁移到 Kubernetes

---

## 三、最终技术栈清单

| 层级 | 技术选型 | 备选 |
|------|---------|------|
| **移动端** | React Native 0.76+ | Flutter |
| **Web 端** | Next.js 15 + TypeScript | |
| **后端** | Node.js + Fastify | Go (后期) |
| **主数据库** | PostgreSQL (Supabase) | Neon / MySQL |
| **缓存** | Redis (Upstash) | 自建 Redis |
| **搜索** | Meilisearch | Elasticsearch |
| **视频存储/转码/播放** | Cloudflare Stream | AWS VOD |
| **CDN** | Cloudflare CDN | AWS CloudFront |
| **国际支付** | Stripe | |
| **印尼本地支付** | Xendit | |
| **App 内购** | Apple IAP / Google Play | |
| **静态存储** | Cloudflare R2 | AWS S3 |
| **前端部署** | Vercel | |
| **后端部署** | Railway | Render / AWS EC2 |
| **代码仓库** | GitHub | GitLab |
| **CI/CD** | GitHub Actions | |
| **监控** | Sentry + Vercel Analytics | |

---

## 四、MVP 阶段费用估算（印尼市场）

| 项目 | 月费用估算 |
|------|-----------|
| Supabase（数据库+存储）| $25（Pro 计划）|
| Railway（后端 x2 实例）| $20 |
| Vercel（前端 x2）| $0（Free 够用）|
| Cloudflare Stream（100用户 x 30分钟/天）| ~$30 |
| Cloudflare CDN | $0（Stream 自带）|
| Xendit / Stripe | 免费接入，收取交易费 2-3% |
| 域名 + SSL | $10 |
| **合计** | **约 $85/月** |

> 极低起步成本，验证模式最重要。

---

## 五、关键风险与建议

### 风险 1：视频版权
- **建议**：初期找有海外授权的片源（国内有版权方在卖东南亚版权），不要直接搬运国内内容。
- **印尼同事**：确保内容符合当地法规（Kominfo）

### 风险 2：支付合规
- **苹果税**：iOS 端绕不开，提前算进定价（比如 $0.99 iAP vs $0.79 Web）
- **Xendit 结算**：有 KYC 要求，需要准备公司资质

### 风险 3：印尼用户支付转化低
- **建议**：定价低于 $2.99/集，$5.99/月（比肩当地流媒体胃口）
- **本地支付优先**：GoPay 支付转化率远高于信用卡

### 风险 4：技术团队能力
- **建议**：印尼同事如果是产品/运营背景，前端可以让国内团队先做
- **下一阶段**：等拿到融资或数据验证后，再扩充后端开发

---

## 六、行动路线图

```
Week 1-2: 基础设施搭建
├── 注册 Supabase + Cloudflare + Xendit + Stripe
├── 搭本地开发环境，跑通视频上传→转码→播放全链路
└── 确认视频防盗链方案可行

Week 2-3: 核心功能开发
├── 用户注册/登录（Supabase Auth）
├── 首页推荐流 + 剧集详情页
├── 视频播放器（集成 Cloudflare Stream）
├── 试看机制 + 付费解锁 API
└── 支付接入（Xendit GoPay 优先）

Week 3-4: 完善 + Demo
├── 个人中心 + 观看历史
├── 落地页 + 广告投放素材准备
├── 印尼本地化（语言 + 支付文案）
└── 跑通完整付费流程

Week 4: 给老板演示 🚀
```

---

*文档版本：v1.0 | 下次迭代：确认技术团队配置后微调*
