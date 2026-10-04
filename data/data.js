/* =====================================================================
   مصدر البيانات الوحيد للموقع (Single Source of Truth)
   ---------------------------------------------------------------------
   كل صفحات الموقع (الرئيسية، المواد، الجدول، صفحة المادة، البحث) تقرأ من هنا.
   لإضافة مادة أو محاضرة أو فصل دراسي جديد: عدّل هذا الملف فقط — راجع README.md.

   ملاحظة صارمة: لا تُدخل هنا أي مادة أو موعد أو اسم لم يرد في مصدر رسمي.
   المصدر الحالي: «الجدول الدراسي الرسمي — الذكاء الاصطناعي · موازي · م1»
   (النسخة: Final ITCS TimeTable 2026 — تاريخ التصدير 2026/10/03).
   ===================================================================== */
window.SITE = {
  university: 'جامعة إقليم سبأ',
  college: 'كلية العلوم والتكنولوجيا',
  department: 'قسم الذكاء الاصطناعي',
  /* الشعار: ضع ملفه داخل assets/img/ ثم اكتب مساره هنا، مثل 'assets/img/logo.png'.
     وهو فارغ الآن، فيظهر رمز بديل محايد إلى أن يُضاف الشعار الرسمي. */
  logo: '',

  /* ------------------------------ الفصول الدراسية ------------------------------ */
  semesters: [
    {
      id: '2026-s1-l1',
      current: true,
      title: 'الفصل الدراسي الأول',
      year: '2026-2027',
      level: 'المستوى الأول',
      program: 'الذكاء الاصطناعي',
      system: 'الموازي',
      /* بيانات الجدول الرسمي كما وردت في الصورة */
      official: {
        sheetDepartment: 'قسم علوم الحاسوب',
        title: 'الذكاء الاصطناعي - موازي - م1',
        version: 'Final ITCS TimeTable 2026',
        status: 'منشور',
        exportedAt: '2026/10/03 — 6:36 م',
        updatedAt: '2026/10/3 — 5:12:24 م',
        part: 'مجموعة الجدول 2 من 2',
        coverage: 'المجموعات المجدولة 11/11 · الساعات المجدولة 27 / المطلوبة 27',
        image: 'assets/img/timetable-official.webp'
      }
    }
  ],

  /* ------------------------------ أيام الدراسة ------------------------------ */
  /* idx يطابق Date.getDay() في جافاسكربت (0 = الأحد … 6 = السبت). الجمعة عطلة. */
  days: [
    { key: 'sat', name: 'السبت', idx: 6 },
    { key: 'sun', name: 'الأحد', idx: 0 },
    { key: 'mon', name: 'الاثنين', idx: 1 },
    { key: 'tue', name: 'الثلاثاء', idx: 2 },
    { key: 'wed', name: 'الأربعاء', idx: 3 },
    { key: 'thu', name: 'الخميس', idx: 4 }
  ],

  /* ------------------------------ المواد ------------------------------
     sessions: start/end بنظام 24 ساعة. الجدول الرسمي يكتب الزمن بدون ص/م
     (مثل 12-2 و10-1) فاعتُمد تفسيره ضمن ساعات الدوام النهاري: 12-2 = 12:00→14:00.
     chapters: قائمة المحاضرات/الفصول. اتركها فارغة [] لتظهر المادة بحالة «قيد الإضافة».
     كل عنصر: { id, n, title, label, kind:'page'|'pdf'|'video'|'link', href, topics:[] }
  --------------------------------------------------------------------- */
  courses: [
    {
      id: 'computer-skills',
      semester: '2026-s1-l1',
      name: 'مهارات الحاسوب',
      kind: 'عملي',
      icon: 'terminal',
      instructor: 'أ. بشير يحيى حيدر',
      group: 'ALL',
      sessions: [{ day: 'sat', start: 10, end: 12, room: 'معمل حاسوب 3' }],
      chapters: [],
      resources: []
    },
    {
      id: 'arabic-skills-1',
      semester: '2026-s1-l1',
      name: 'مهارات اللغة العربية (1)',
      kind: 'نظري',
      icon: 'pen',
      instructor: 'د. عبدالولي السلامي',
      group: 'مجموعة 1',
      sessions: [{ day: 'sat', start: 12, end: 14, room: 'القاعة الكبرى' }],
      chapters: [],
      resources: []
    },
    {
      id: 'general-physics',
      semester: '2026-s1-l1',
      name: 'فيزياء عامة للحوسبة',
      kind: 'نظري',
      icon: 'atom',
      instructor: 'د. إبراهيم أبو عساج',
      group: 'ALL',
      sessions: [{ day: 'wed', start: 8, end: 11, room: 'القاعة الكبرى' }],
      chapters: [],
      resources: []
    },
    {
      id: 'calculus',
      semester: '2026-s1-l1',
      name: 'التفاضل والتكامل',
      kind: 'نظري',
      icon: 'sigma',
      instructor: 'أ. حسين وحيش',
      group: 'ALL',
      sessions: [{ day: 'wed', start: 11, end: 14, room: 'قاعة 11' }],
      chapters: [],
      resources: []
    },
    {
      id: 'english-skills-1',
      semester: '2026-s1-l1',
      name: 'مهارات اللغة الإنجليزية (1)',
      kind: 'نظري',
      icon: 'aa',
      instructor: 'أ. أمل شايف',
      group: 'ALL',
      sessions: [{ day: 'thu', start: 8, end: 10, room: 'قاعة 2' }],
      chapters: [],
      resources: []
    },
    {
      id: 'intro-computing',
      semester: '2026-s1-l1',
      name: 'مقدمة في الحوسبة',
      nameEn: 'Introduction to Computing', /* اختياري: اسم المادة داخل المحاضرات الإنجليزية */
      kind: 'نظري',
      icon: 'cpu',
      instructor: 'أ. عقيل معوضه البحري',
      group: 'ALL',
      sessions: [{ day: 'thu', start: 10, end: 13, room: 'قاعة 7' }],
      /* المحتوى الذي كان يمثّل الموقع القديم بالكامل (شرائح Discovering Computers) */
      chapters: [
        {
          id: 'ch1', n: 1, kind: 'page',
          title: 'اكتشف كيف يعمل الحاسوب',
          label: 'مقدمة في الحاسوب',
          href: 'courses/intro-computing/chapter-1.html',
          topics: ['ما هو الحاسوب؟', 'المكونات', 'البرمجيات', 'الأنواع', 'نظام المعلومات', 'المزايا والعيوب', 'اختبر نفسك']
        },
        {
          id: 'ch2', n: 2, kind: 'page',
          title: 'كيف تدخل البيانات إلى الحاسوب؟',
          label: 'أجهزة الإدخال',
          href: 'courses/intro-computing/chapter-2.html',
          topics: ['الإدخال', 'لوحة المفاتيح', 'التأشير', 'اللمس والقلم', 'الكاميرا', 'الصوت والفيديو', 'الماسحات', 'البيومترية', 'المستخدمون', 'اختبر نفسك']
        }
      ],
      resources: []
    }
  ]
};
