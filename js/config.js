/**
 * مؤتمر المويا مويا | MOYA MOYA DISEASE CONFERENCE
 * مبادرة تنفّس وعي | Tanaffas Waai
 * Presentation Configuration File
 */

const presentationConfig = {
  // تفاصيل الحدث والمؤتمر
  event: {
    title: "مؤتمر المويا مويا",
    englishTitle: "MOYA MOYA DISEASE CONFERENCE",
    initiative: "تنفّس وعي",
    englishInitiative: "Tanaffas Waai",
    date: "17-10-2026",
    location: "Misurata, Libya",
    tagline: "لأن مرضًا نادرًا… يستحق صوتًا أكبر."
  },

  // بيانات الأثر (إذا كانت القيمة null لا يتم عرض الكرت نهائيًا وفقًا للمتطلبات)
  // لتفعيل أي كرت، استبدل null بالرقم الفعلي، مثلاً: volunteers: 45
  impact: {
    volunteers: null,
    cities: null,
    activities: null,
    beneficiaries: null,
    partners: null
  },

  // الرعاة المعتمدون حصريًا (ممنوع اختراع أسماء غير معتمدة)
  sponsors: [
    {
      id: "misurata-lab",
      name: "مختبر مصراتة المركزي",
      englishName: "Misurata Central Laboratory",
      type: "شريك طبي واستراتيجي",
      logo: "assets/sponsors/misurata-lab.svg",
      tag: "أحد رعاة المؤتمر"
    },
    {
      id: "yafa-apartments",
      name: "يافا للشقق الفندقية",
      englishName: "Yafa Hotel Apartments",
      type: "شريك الضيافة",
      logo: "assets/sponsors/yafa-apartments.svg",
      tag: "أحد رعاة المؤتمر"
    },
    {
      id: "al-talea",
      name: "شركة الطليعة للتجهيزات الفنية",
      englishName: "Al-Talea Technical Equipment",
      type: "شريك التجهيزات التقنية",
      logo: "assets/sponsors/al-talea.svg",
      tag: "أحد رعاة المؤتمر"
    }
  ],

  // محطات الرحلة (سلايد 7)
  journey: [
    {
      step: "01",
      title: "الفكرة",
      desc: "بداية السؤال… لماذا لا يجد مريض المويا مويا العربي محتوى يشبه واقعه؟",
      date: "",
      image: "assets/journey/step-idea.svg"
    },
    {
      step: "02",
      title: "تكوين الفرق",
      desc: "التقاء الشغف الطبي والتصميمي والإنساني لصناعة فريق يؤمن بالأثر.",
      date: "",
      image: "assets/journey/step-team.svg"
    },
    {
      step: "03",
      title: "المحتوى",
      desc: "صياغة أول دليل عربي مبسّط وموجّه للإنسان قبل المرض.",
      date: "",
      image: "assets/journey/step-content.svg"
    },
    {
      step: "04",
      title: "الأنشطة الميدانية",
      desc: "النزول إلى الأرض، والتواصل المباشر مع المجتمع والكوادر الطبية.",
      date: "",
      image: "assets/journey/step-field.svg"
    },
    {
      step: "05",
      title: "مويا في الحياة",
      desc: "إطلاق السلسلة الأكثر تأثيرًا التي تناولت المدرسة، السفر، والجامعة.",
      date: "",
      image: "assets/journey/step-life.svg"
    },
    {
      step: "06",
      title: "مؤتمر المويا مويا",
      desc: "الحدث الأكبر… الجمع بين العِلم والإنسانية تحت سقف واحد.",
      date: "17-10-2026",
      image: "assets/journey/step-conference.svg"
    }
  ],

  // سلسلة مويا في الحياة (سلايد 4)
  moyaInLife: [
    {
      id: "school",
      title: "مويا في المدرسة",
      subtitle: "كيف يتعامل المعلم والزملاء مع طالب المويا مويا؟",
      desc: "دليل عملي للبيئة المدرسية يمنح الطفل الأمان دون وصم أو خوف.",
      image: "assets/school/school-card.svg",
      details: "دليل موجه للمعلمين وأولياء الأمور لتوفير بيئة تعليمية واعية وداعمة لطلاب متلازمة مويا مويا، يشمل إرشادات شرب الماء، تجنب التوتر الشديد، والتعامل السليم مع فترات الامتحانات."
    },
    {
      id: "travel",
      title: "مويا في السفر",
      subtitle: "إرشادات الطيران والرحلات الطويلة وتغيرات الضغط",
      desc: "رحلة آمنة تبدأ من المعرفة المسبقة وكيفية الحفاظ على التروية.",
      image: "assets/travel/travel-card.svg",
      details: "إرشادات طبية مبسّطة حول السفر جواً وبراً، التعامل مع ضغط الطائرة، تنظيم مواعيد الأدوية، وحمل التقارير الطبية بلغة مفهومة للمطارات ومحطات الإسعاف."
    },
    {
      id: "university",
      title: "مويا في الجامعة",
      subtitle: "الطموح الأكاديمي، ضغط الامتحانات، وإدارة الطاقة اليومية",
      desc: "تمكين الشباب الجامعي من مواصلة شغفهم مع التوازن الصحي المتكامل.",
      image: "assets/university/university-card.svg",
      details: "ملف تمكيني للطلاب الجامعيين يتناول تنظيم ساعات الدراسة، النوم الكافي، كيفية إبلاغ المشرف الأكاديمي، وبناء شبكة دعم طلابية متفهمة للحالة."
    }
  ],

  // إعدادات الصوت
  audio: {
    muted: true, // مكتوم افتراضيًا حسب المتطلبات
    synthEnabled: true // مؤثرات Web Audio API التفاعلية
  },

  // خيارات العرض
  presentation: {
    autoHideNavDelay: 2500, // إخفاء عناصر التحكم عند ثبات الماوس (مللي ثانية)
    particlesDensity: 65,   // كثافة جزيئات الخلفية
    motionReduced: false
  }
};
