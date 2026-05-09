export interface Drama {
  id: string
  title: string
  cover: string
  description: string
  category: string
  tags: string[]
  episodes: Episode[]
  viewCount: number
  rating: number
  updatedAt: string
  isVipOnly: boolean
}

export interface Episode {
  id: string
  number: number
  title: string
  duration: string
  videoUrl: string
  coverUrl: string
  isFree: boolean
}

export const mockDramas: Drama[] = [
  {
    id: 'drama-001',
    title: '冷少的心尖宠',
    cover: 'https://picsum.photos/seed/drama1/400/600',
    description: '一场意外，她被迫与他签订契约婚姻。冷面总裁化身宠妻狂魔，一路甜宠到底！',
    category: '甜宠',
    tags: ['甜宠', '总裁', '契约婚姻'],
    viewCount: 2345000,
    rating: 4.8,
    updatedAt: '2026-05-08',
    isVipOnly: false,
    episodes: [
      { id: 'e001-01', number: 1, title: '意外相遇', duration: '5:32', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', coverUrl: 'https://picsum.photos/seed/e00101/400/700', isFree: true },
      { id: 'e001-02', number: 2, title: '被迫闪婚', duration: '6:15', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', coverUrl: 'https://picsum.photos/seed/e00102/400/700', isFree: true },
      { id: 'e001-03', number: 3, title: '契约条款', duration: '5:48', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', coverUrl: 'https://picsum.photos/seed/e00103/400/700', isFree: true },
      { id: 'e001-04', number: 4, title: '心跳加速', duration: '7:02', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', coverUrl: 'https://picsum.photos/seed/e00104/400/700', isFree: false },
      { id: 'e001-05', number: 5, title: '早餐风波', duration: '6:30', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', coverUrl: 'https://picsum.photos/seed/e00105/400/700', isFree: false },
      { id: 'e001-06', number: 6, title: '加班夜归', duration: '8:15', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', coverUrl: 'https://picsum.photos/seed/e00106/400/700', isFree: false },
    ]
  },
  {
    id: 'drama-002',
    title: '战神归来：千金归来',
    cover: 'https://picsum.photos/seed/drama2/400/600',
    description: '战场上归来，发现家族巨变，未婚妻背叛，妹妹失踪。她发誓要让所有人付出代价！',
    category: '战神',
    tags: ['战神', '复仇', '虐恋'],
    viewCount: 4567000,
    rating: 4.9,
    updatedAt: '2026-05-07',
    isVipOnly: true,
    episodes: [
      { id: 'e002-01', number: 1, title: '战神陨落', duration: '6:45', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', coverUrl: 'https://picsum.photos/seed/e00201/400/700', isFree: true },
      { id: 'e002-02', number: 2, title: '绝境逢生', duration: '7:20', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', coverUrl: 'https://picsum.photos/seed/e00202/400/700', isFree: true },
      { id: 'e002-03', number: 3, title: '归来复仇', duration: '8:10', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', coverUrl: 'https://picsum.photos/seed/e00203/400/700', isFree: true },
      { id: 'e002-04', number: 4, title: '揭露真相', duration: '9:05', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', coverUrl: 'https://picsum.photos/seed/e00204/400/700', isFree: false },
      { id: 'e002-05', number: 5, title: '绝地反击', duration: '8:50', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', coverUrl: 'https://picsum.photos/seed/e00205/400/700', isFree: false },
    ]
  },
  {
    id: 'drama-003',
    title: '霸道总裁爱上我',
    cover: 'https://picsum.photos/seed/drama3/400/600',
    description: '普通女孩入职第一天，就被冰山总裁盯上了？这是命运的安排还是阴谋的开始？',
    category: '霸总',
    tags: ['霸总', '职场', '甜宠'],
    viewCount: 1890000,
    rating: 4.6,
    updatedAt: '2026-05-06',
    isVipOnly: false,
    episodes: [
      { id: 'e003-01', number: 1, title: '职场新人', duration: '5:15', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', coverUrl: 'https://picsum.photos/seed/e00301/400/700', isFree: true },
      { id: 'e003-02', number: 2, title: '初次邂逅', duration: '6:30', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', coverUrl: 'https://picsum.photos/seed/e00302/400/700', isFree: true },
      { id: 'e003-03', number: 3, title: '意外同居', duration: '7:00', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', coverUrl: 'https://picsum.photos/seed/e00303/400/700', isFree: true },
      { id: 'e003-04', number: 4, title: '暗生情愫', duration: '6:45', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', coverUrl: 'https://picsum.photos/seed/e00304/400/700', isFree: false },
    ]
  },
  {
    id: 'drama-004',
    title: '重生之复仇天后',
    cover: 'https://picsum.photos/seed/drama4/400/600',
    description: '前世被闺蜜和男友联手害死，一朝重生，她誓要夺回属于自己的一切！',
    category: '重生',
    tags: ['重生', '复仇', '豪门'],
    viewCount: 3200000,
    rating: 4.7,
    updatedAt: '2026-05-05',
    isVipOnly: true,
    episodes: [
      { id: 'e004-01', number: 1, title: '含冤而死', duration: '7:10', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', coverUrl: 'https://picsum.photos/seed/e00401/400/700', isFree: true },
      { id: 'e004-02', number: 2, title: '意外重生', duration: '6:55', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', coverUrl: 'https://picsum.photos/seed/e00402/400/700', isFree: true },
      { id: 'e004-03', number: 3, title: '回到过去', duration: '8:20', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', coverUrl: 'https://picsum.photos/seed/e00403/400/700', isFree: true },
      { id: 'e004-04', number: 4, title: '暗中布局', duration: '7:40', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', coverUrl: 'https://picsum.photos/seed/e00404/400/700', isFree: false },
      { id: 'e004-05', number: 5, title: '复仇开始', duration: '9:10', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', coverUrl: 'https://picsum.photos/seed/e00405/400/700', isFree: false },
    ]
  },
  {
    id: 'drama-005',
    title: '隐婚蜜爱：影帝深深宠',
    cover: 'https://picsum.photos/seed/drama5/400/600',
    description: '当红影帝与十八线小透明的隐婚日常，从嫌弃到真香，一路撒糖停不下来！',
    category: '甜宠',
    tags: ['影帝', '隐婚', '甜宠'],
    viewCount: 2780000,
    rating: 4.8,
    updatedAt: '2026-05-04',
    isVipOnly: false,
    episodes: [
      { id: 'e005-01', number: 1, title: '隐婚协议', duration: '6:00', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', coverUrl: 'https://picsum.photos/seed/e00501/400/700', isFree: true },
      { id: 'e005-02', number: 2, title: '同居生活', duration: '7:15', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', coverUrl: 'https://picsum.photos/seed/e00502/400/700', isFree: true },
      { id: 'e005-03', number: 3, title: '绯闻缠身', duration: '6:30', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', coverUrl: 'https://picsum.photos/seed/e00503/400/700', isFree: true },
      { id: 'e005-04', number: 4, title: '公开恋情', duration: '8:05', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', coverUrl: 'https://picsum.photos/seed/e00504/400/700', isFree: false },
    ]
  },
  {
    id: 'drama-006',
    title: '天价甜妻：顾少的掌心宝',
    cover: 'https://picsum.photos/seed/drama6/400/600',
    description: '她是顾家失散多年的千金，回归后却被继母继妹处处算计，直到遇见了他……',
    category: '豪门',
    tags: ['豪门', '甜宠', '马甲'],
    viewCount: 1560000,
    rating: 4.5,
    updatedAt: '2026-05-03',
    isVipOnly: true,
    episodes: [
      { id: 'e006-01', number: 1, title: '身份揭露', duration: '6:20', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', coverUrl: 'https://picsum.photos/seed/e00601/400/700', isFree: true },
      { id: 'e006-02', number: 2, title: '重回豪门', duration: '7:45', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', coverUrl: 'https://picsum.photos/seed/e00602/400/700', isFree: true },
      { id: 'e006-03', number: 3, title: '暗中调查', duration: '8:30', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', coverUrl: 'https://picsum.photos/seed/e00603/400/700', isFree: true },
      { id: 'e006-04', number: 4, title: '真相大白', duration: '7:55', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', coverUrl: 'https://picsum.photos/seed/e00604/400/700', isFree: false },
    ]
  },
]

export const categories = ['全部', '甜宠', '霸总', '战神', '重生', '豪门', '复仇', '悬疑']

export function formatViewCount(count: number): string {
  if (count >= 10000000) return `${(count / 10000000).toFixed(1)}千万`
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`
  return count.toString()
}
