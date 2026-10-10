// ============================================================
//  All the practice content lives in this file.
//  To add a video, copy one line and change it. Formats:
//    YouTube video:  { title:"Name", note:"Description", type:"视频", youtube:"VIDEO_ID" }
//        (VIDEO_ID = the letters after youtu.be/ and before the ?)
//    Bilibili video: { title:"Name", type:"视频", bilibili:"BV_NUMBER" }
//    Plain web link: { title:"Name", type:"音频", link:"https://..." }
//    No link yet:    { title:"Name", type:"视频", search:"search words", site:"youtube" or "bilibili" }
//  type is shown to your mom: "视频" = video, "音频" = audio.
//  minutes = suggested length; adds a button that sets the timer to it.
//  Keep the Chinese text (title, note) in Mandarin - that's what she sees.
// ============================================================
const CATEGORIES = [
  {
    id: "pingshuai",
    name: "平甩功",
    icon: "甩",
    desc: "李凤山师父 · 梅门",
    items: [
      { title: "平甩功 10分钟", note: "李凤山师父示范，适合每天练习", type: "视频", youtube: "2fGQ0W-RKfI", minutes: 10 },
      { title: "平甩功 30分钟", note: "连续练习说明版", type: "视频", youtube: "iWD-w06Me8s", minutes: 30 }
    ]
  },
  {
    id: "baduanjin",
    name: "八段锦",
    icon: "锦",
    desc: "健身气功 · 杨柏龙",
    items: [
      { title: "健身气功·八段锦", note: "杨柏龙老师教学", type: "视频", search: "健身气功 八段锦 杨柏龙", site: "bilibili" }
    ]
  },
  {
    id: "yijinjing",
    name: "易筋经",
    icon: "筋",
    desc: "古导引易筋经",
    items: [
      { title: "古导引易筋经", note: "张玉松老师示范", type: "视频", youtube: "8vr20TpUZsE" }
    ]
  },
  {
    id: "jingang",
    name: "八部金刚功",
    icon: "刚",
    desc: "张至顺道长",
    items: [
      { title: "八部金刚功（跟练版）", note: "完整五遍，跟着一起练", type: "视频", youtube: "ow_qvzuHJbM" }
    ]
  },
  {
    id: "taiyi",
    name: "太乙站桩功",
    icon: "桩",
    desc: "李一道长养生大讲堂",
    items: [
      { title: "太乙站桩功 15分钟", note: "B站视频，点开后选第一个", type: "视频", search: "李一道长养生大讲堂 太乙站桩功", site: "bilibili", minutes: 15 },
      { title: "太乙站桩功 36分钟", note: "B站视频，点开后选第二个", type: "视频", search: "李一道长养生大讲堂 太乙站桩功", site: "bilibili", minutes: 36 }
    ]
  },
  {
    id: "sanjiao",
    name: "三焦运动",
    icon: "焦",
    desc: "吴清忠老师",
    items: [
      { title: "三焦经运动", note: "吴清忠老师亲自示范", type: "视频", search: "吴清忠 三焦经运动", site: "youtube" }
    ]
  },
  {
    id: "jingzuo",
    name: "静坐音乐",
    icon: "坐",
    desc: "按时间长短选择",
    items: [
      { title: "15分钟静坐音乐", note: "眼睛疲劳放松", type: "音频", youtube: "RA50y17i6A0", minutes: 15 },
      { title: "20分钟静坐音乐", note: "胸口放松、深呼吸", type: "音频", youtube: "WN8-t_Vw-Bw", minutes: 20 },
      { title: "25分钟静坐音乐", note: "眼前放松、安定", type: "音频", youtube: "-Q9xtl_e09Y", minutes: 25 },
      { title: "30分钟静坐音乐", note: "528Hz 眼部修护", type: "音频", youtube: "egg4dlZongs", minutes: 30 },
      { title: "35分钟静坐音乐", note: "爱自己 · 深层放松", type: "音频", youtube: "kuZwMp0nqd4", minutes: 35 },
      { title: "40分钟静坐音乐", note: "眼睛放松", type: "音频", youtube: "weMdM24NmFQ", minutes: 40 },
      { title: "45分钟静坐音乐", note: "身体轻盈放松", type: "音频", youtube: "Y5A2BGNCe4k", minutes: 45 },
      { title: "50分钟静坐音乐", note: "闭眼聆听", type: "音频", youtube: "4R8nRlOjEXo", minutes: 50 },
      { title: "55分钟静坐音乐", note: "肩颈放松", type: "音频", youtube: "YNQ0hNgwUc0", minutes: 55 },
      { title: "60分钟静坐音乐", note: "一小时 · 深度放松", type: "音频", youtube: "fAh3bea0Vq0", minutes: 60 }
    ]
  },
  {
    id: "drive",
    name: "道家功法音频",
    icon: "音",
    desc: "云端文件夹里的录音",
    items: [
      { title: "道家功法音频（打开文件夹）", note: "里面是妈妈收集的录音，点开后选择要听的", type: "音频", link: "https://drive.google.com/drive/folders/1j9gjuhSLjZ2XKKf1vEP5RKL1qaOEnwmP" }
    ]
  }
];


