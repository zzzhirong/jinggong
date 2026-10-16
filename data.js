// ============================================================
//  All the practice content lives in this file.
//  To add a video, copy one line and change it. Formats:
//    YouTube video:  { title:"Name", note:"Description", type:"视频", youtube:"VIDEO_ID" }
//        (VIDEO_ID = the letters after youtu.be/ and before the ?)
//    Video file on the site: { title:"Name", type:"视频", video:"video/file.mp4" }
//        (several parts that play in a row: video:["video/a.mp4", "video/b.mp4"]; keep each file under 25 MB)
//    Bilibili video: { title:"Name", type:"视频", bilibili:"BV_NUMBER" }
//    Audio file on the site: { title:"Name", type:"音频", audio:"gongfa/01.mp3" }
//    Plain web link: { title:"Name", type:"音频", link:"https://..." }
//    No link yet:    { title:"Name", type:"视频", search:"search words", site:"youtube" or "bilibili" }
//  type is shown to your mom: "视频" = video, "音频" = audio.
//  timerAudio (静坐音乐 only) = the MP3 the TIMER plays for that button (audio/music-NN.mp3)
//  label (静坐音乐 only) = the short text under the time on the timer buttons;
//        a track WITHOUT a label gets no timer button.
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
    desc: "健身气功 · 医学八段锦",
    items: [
      { title: "健身气功 · 八段锦", note: "国家体育总局认定版", type: "视频", youtube: "QDIx22h2TBc" },
      { title: "台湾版 · 医学八段锦", note: "卫生福利部 · 动作示范（第一部分）", type: "视频", youtube: "KIMFPfrLYSs" }
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
      { title: "太乙站桩功 36分钟", note: "完整跟练", type: "视频", youtube: "wBfdk3zIUAU", minutes: 36 }
    ]
  },
  {
    id: "sanjiao",
    name: "三焦运动",
    icon: "焦",
    desc: "吴清忠老师",
    items: [
      { title: "三焦经运动", note: "吴清忠老师亲自示范", type: "视频", youtube: "R-Z0CdQn0Oo" }
    ]
  },
  {
    id: "jingzuo",
    name: "静坐音乐",
    icon: "坐",
    desc: "按时间长短选择",
    items: [
      { title: "15分钟 · 干眼舒缓", note: "静坐音乐", type: "音频", youtube: "RA50y17i6A0", minutes: 15, label: "干眼舒缓", timerAudio: "audio/music-15.mp3" },
      { title: "20分钟 · 脾脏排毒", note: "静坐音乐", type: "音频", youtube: "f59JnWq2umk", minutes: 20, label: "脾脏排毒", timerAudio: "audio/music-20.mp3" },
      { title: "25分钟 · 飞蚊症舒缓", note: "静坐音乐", type: "音频", youtube: "-Q9xtl_e09Y", minutes: 25, label: "飞蚊症舒缓", timerAudio: "audio/music-25.mp3" },
      { title: "30分钟 · 改善老花", note: "静坐音乐", type: "音频", youtube: "egg4dlZongs", minutes: 30, label: "改善老花", timerAudio: "audio/music-30.mp3" },
      { title: "35分钟 · 别再委屈", note: "静坐音乐", type: "音频", youtube: "kuZwMp0nqd4", minutes: 35, label: "别再委屈", timerAudio: "audio/music-35.mp3" },
      { title: "40分钟 · 眼睛放松", note: "静坐音乐", type: "音频", youtube: "weMdM24NmFQ", minutes: 40, label: "眼睛放松", timerAudio: "audio/music-40.mp3" },
      { title: "45分钟 · 肝脏排毒", note: "静坐音乐", type: "音频", youtube: "e99lDwBbV1g", minutes: 45, label: "肝脏排毒", timerAudio: "audio/music-45.mp3" },
      { title: "50分钟 · 肾脏排毒", note: "静坐音乐", type: "音频", youtube: "4R8nRlOjEXo", minutes: 50, label: "肾脏排毒", timerAudio: "audio/music-50.mp3" },
      { title: "55分钟静坐音乐", note: "肩颈放松", type: "音频", youtube: "YNQ0hNgwUc0", minutes: 55 },
      { title: "60分钟静坐音乐", note: "一小时 · 深度放松", type: "音频", youtube: "fAh3bea0Vq0", minutes: 60 }
    ]
  },
  {
    id: "drive",
    name: "道家功法音频",
    icon: "音",
    desc: "杨老师 · 一级功法录音",
    items: [
      { title: "一 · 养生剑指桩", note: "约25分钟", type: "音频", audio: "gongfa/01.mp3" },
      { title: "二 · 蛹动贯气法", note: "约12分钟", type: "音频", audio: "gongfa/02.mp3" },
      { title: "三 · 颤抖功", note: "约13分钟", type: "音频", audio: "gongfa/03.mp3" },
      { title: "四 · 以音助气通周法", note: "约28分钟", type: "音频", audio: "gongfa/04.mp3" },
      { title: "五 · 养气法", note: "约26分钟", type: "音频", audio: "gongfa/05.mp3" }
    ]
  }
];









