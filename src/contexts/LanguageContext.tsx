import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ru';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.program': { en: 'Program', ru: 'Программа' },
  'nav.curriculum': { en: 'Curriculum', ru: 'Учебный план' },
  'nav.pricing': { en: 'Pricing', ru: 'Стоимость' },
  'nav.enroll': { en: 'Enroll Now', ru: 'Записаться' },

  // Hero
  'hero.badge': { en: '🚀 Enrollment is open — spots are limited', ru: '🚀 Набор открыт — места ограничены' },
  'hero.title1': { en: 'Build an iOS App', ru: 'Создай iOS приложение' },
  'hero.title2': { en: 'That Earns', ru: 'Которое приносит' },
  'hero.title3': { en: '$10,000/month', ru: '$10,000/месяц' },
  'hero.subtitle': { en: 'Learn to build real iOS apps using AI — no prior coding experience needed. Go from zero to the App Store in 15 days.', ru: 'Научись создавать реальные iOS приложения с помощью ИИ — без опыта программирования. От нуля до App Store за 15 дней.' },
  'hero.cta': { en: 'Enroll Now — $350', ru: 'Записаться — $350' },
  'hero.students': { en: 'students enrolled', ru: 'студентов записались' },
  'hero.startDate': { en: 'Start Date', ru: 'Дата начала' },
  'hero.startDateVal': { en: 'May 1, 2026', ru: '1 мая 2026' },
  'hero.goal': { en: 'Goal', ru: 'Цель' },
  'hero.goalVal': { en: '$10K/month app', ru: 'Приложение на $10K/мес' },
  'hero.instructor': { en: 'Instructor', ru: 'Инструктор' },
  'hero.instructorVal': { en: 'Seyitbek Usmanov', ru: 'Сейитбек Усманов' },
  'hero.demo': { en: 'Demo Day', ru: 'Демо день' },
  'hero.demoVal': { en: 'May 14, 2026', ru: '14 мая 2026' },

  // Countdown
  'countdown.days': { en: 'days', ru: 'дней' },
  'countdown.hours': { en: 'hours', ru: 'часов' },
  'countdown.minutes': { en: 'min', ru: 'мин' },
  'countdown.seconds': { en: 'sec', ru: 'сек' },
  'countdown.starts': { en: 'Program starts in', ru: 'Программа начнётся через' },

  // Instructor
  'instructor.title': { en: 'Your Instructor', ru: 'Ваш инструктор' },
  'instructor.name': { en: 'Seyitbek Usmanov', ru: 'Сейитбек Усманов' },
  'instructor.bio': { en: 'Experienced iOS developer and AI enthusiast. Has launched multiple apps on the App Store and helped hundreds of students turn their ideas into real products using AI-powered development.', ru: 'Опытный iOS-разработчик и энтузиаст ИИ. Запустил несколько приложений в App Store и помог сотням студентов превратить их идеи в реальные продукты с использованием ИИ.' },
  'instructor.apps': { en: 'Apps Launched', ru: 'Запущено приложений' },
  'instructor.students': { en: 'Students Taught', ru: 'Обучено студентов' },
  'instructor.experience': { en: 'Years Experience', ru: 'Лет опыта' },

  // Vibe Coder
  'vibe.title': { en: 'What is a Vibe Coder?', ru: 'Что такое Vibe Coder?' },
  'vibe.subtitle': { en: 'A new way to build apps — let AI write the code while you focus on the vision', ru: 'Новый способ создавать приложения — ИИ пишет код, а вы фокусируетесь на идее' },
  'vibe.traditional': { en: 'Traditional Developer', ru: 'Традиционный разработчик' },
  'vibe.vibeCoder': { en: 'Vibe Coder', ru: 'Vibe Coder' },
  'vibe.trad1': { en: 'Months learning syntax', ru: 'Месяцы на изучение синтаксиса' },
  'vibe.trad2': { en: 'Debugging for hours', ru: 'Часы на отладку' },
  'vibe.trad3': { en: 'Complex setup & tooling', ru: 'Сложная настройка и инструменты' },
  'vibe.trad4': { en: 'Slow iteration cycles', ru: 'Медленные циклы разработки' },
  'vibe.vib1': { en: 'Start building day one', ru: 'Начни создавать с первого дня' },
  'vibe.vib2': { en: 'AI fixes bugs for you', ru: 'ИИ исправляет баги за тебя' },
  'vibe.vib3': { en: 'Describe what you want, AI builds it', ru: 'Опиши что хочешь, ИИ построит' },
  'vibe.vib4': { en: 'Ship in days, not months', ru: 'Запуск за дни, а не месяцы' },
  'vibe.card1.title': { en: 'AI-Powered Development', ru: 'Разработка с помощью ИИ' },
  'vibe.card1.desc': { en: 'Use ChatGPT, Cursor, and other AI tools to write SwiftUI code faster than ever', ru: 'Используйте ChatGPT, Cursor и другие ИИ-инструменты для быстрого написания SwiftUI кода' },
  'vibe.card2.title': { en: 'No Experience Needed', ru: 'Опыт не нужен' },
  'vibe.card2.desc': { en: 'Our curriculum is designed for absolute beginners — start from zero', ru: 'Наша программа создана для абсолютных новичков — начните с нуля' },
  'vibe.card3.title': { en: 'Real App, Real Revenue', ru: 'Реальное приложение, реальный доход' },
  'vibe.card3.desc': { en: 'Build a production-ready iOS app and learn monetization strategies', ru: 'Создайте готовое iOS приложение и изучите стратегии монетизации' },
  'vibe.card4.title': { en: 'App Store Launch', ru: 'Запуск в App Store' },
  'vibe.card4.desc': { en: 'We guide you through the entire process from idea to App Store submission', ru: 'Мы проведём вас через весь путь от идеи до публикации в App Store' },

  // What You'll Get
  'get.title': { en: "What You'll Get", ru: 'Что вы получите' },
  'get.item1.title': { en: 'Build in 15 Days', ru: 'Создай за 15 дней' },
  'get.item1.desc': { en: 'Intensive hands-on program that takes you from idea to a live App Store app in just 15 days', ru: 'Интенсивная практическая программа: от идеи до приложения в App Store за 15 дней' },
  'get.item2.title': { en: '$10K/Month Goal', ru: 'Цель: $10K/месяц' },
  'get.item2.desc': { en: 'Learn proven monetization strategies — subscriptions, ads, in-app purchases — to build sustainable revenue', ru: 'Изучите проверенные стратегии монетизации — подписки, реклама, покупки — для стабильного дохода' },
  'get.item3.title': { en: 'Community Access', ru: 'Доступ к сообществу' },
  'get.item3.desc': { en: 'Join a private community of builders. Get feedback, find collaborators, and stay motivated', ru: 'Присоединяйтесь к закрытому сообществу. Получайте фидбек, находите единомышленников' },
  'get.item4.title': { en: 'Expert Guidance', ru: 'Экспертная поддержка' },
  'get.item4.desc': { en: 'Direct access to Seyitbek and mentors who have launched successful iOS apps', ru: 'Прямой доступ к Сейитбеку и менторам, которые запустили успешные iOS приложения' },

  // Curriculum
  'curr.title': { en: 'Curriculum', ru: 'Учебный план' },
  'curr.subtitle': { en: '15-day intensive iOS development with AI', ru: '15-дневная интенсивная iOS-разработка с ИИ' },
  'curr.week1': { en: 'Days 1-2: Foundations', ru: 'Дни 1-2: Основы' },
  'curr.week1.desc': { en: 'AI tools setup (ChatGPT, Cursor), Xcode basics, your first SwiftUI screen, understanding the vibe coding workflow', ru: 'Настройка ИИ-инструментов (ChatGPT, Cursor), основы Xcode, первый экран SwiftUI, понимание vibe coding процесса' },
  'curr.week2': { en: 'Days 3-5: SwiftUI with AI', ru: 'Дни 3-5: SwiftUI с ИИ' },
  'curr.week2.desc': { en: 'Build complex UI using AI prompts, navigation, lists, forms, animations — all through conversational AI development', ru: 'Создание сложного UI через ИИ-промпты, навигация, списки, формы, анимации — всё через разговорную ИИ-разработку' },
  'curr.week3': { en: 'Days 6-8: Backend & Auth', ru: 'Дни 6-8: Бэкенд и авторизация' },
  'curr.week3.desc': { en: 'Connect to Supabase, user authentication, database design, real-time features, cloud storage', ru: 'Подключение к Supabase, авторизация, проектирование базы данных, реал-тайм функции, облачное хранилище' },
  'curr.week4': { en: 'Days 9-11: MVP Development', ru: 'Дни 9-11: Разработка MVP' },
  'curr.week4.desc': { en: 'Build your complete app MVP, integrate payments, push notifications, analytics, and polish the UX', ru: 'Создание полного MVP приложения, интеграция платежей, push-уведомления, аналитика, полировка UX' },
  'curr.week5': { en: 'Days 12-14: Launch & Monetize', ru: 'Дни 12-14: Запуск и монетизация' },
  'curr.week5.desc': { en: 'App Store submission, ASO optimization, monetization setup (subscriptions, ads), marketing basics, Demo Day presentation', ru: 'Публикация в App Store, ASO-оптимизация, настройка монетизации (подписки, реклама), основы маркетинга, презентация на Демо дне' },

  // Schedule
  'sched.title': { en: 'Schedule', ru: 'Расписание' },
  'sched.subtitle': { en: 'Live sessions 3 times per week', ru: 'Живые сессии 3 раза в неделю' },
  'sched.format': { en: 'Live Online Sessions', ru: 'Живые онлайн-сессии' },
  'sched.days': { en: 'Monday, Wednesday, Friday', ru: 'Понедельник, Среда, Пятница' },
  'sched.time': { en: '7:00 PM (Bishkek time, UTC+6)', ru: '19:00 (время Бишкека, UTC+6)' },
  'sched.duration': { en: '1.5 - 2 hours per session', ru: '1.5 - 2 часа за сессию' },
  'sched.recorded': { en: 'All sessions recorded — watch replays anytime', ru: 'Все сессии записываются — смотрите повторы в любое время' },

  // Pricing Timeline
  'price.timeline.title': { en: '⏰ Price increases as the course approaches', ru: '⏰ Цена растёт по мере приближения курса' },
  'price.timeline.subtitle': { en: 'Lock in the lowest price — enroll early!', ru: 'Зафиксируй самую низкую цену — записывайся раньше!' },
  'price.expired': { en: 'Expired', ru: 'Истекло' },
  'price.current': { en: 'Current Price', ru: 'Текущая цена' },
  'price.tier.early': { en: 'Early Bird', ru: 'Ранняя цена' },
  'price.tier.early.amount': { en: '$250', ru: '$250' },
  'price.tier.early.when': { en: '2+ weeks before start', ru: '2+ недели до начала' },
  'price.tier.early.dates': { en: 'Before Apr 15, 2026', ru: 'До 15 апреля 2026' },
  'price.tier.current': { en: 'Regular Price', ru: 'Обычная цена' },
  'price.tier.current.amount': { en: '$300', ru: '$300' },
  'price.tier.current.when': { en: '1–2 weeks before start', ru: '1–2 недели до начала' },
  'price.tier.current.dates': { en: 'Apr 15 – Apr 26, 2026', ru: '15 апреля – 26 апреля 2026' },
  'price.tier.last': { en: 'Last Chance', ru: 'Последний шанс' },
  'price.tier.last.amount': { en: '$350', ru: '$350' },
  'price.tier.last.when': { en: 'Last 2 days', ru: 'Последние 2 дня' },
  'price.tier.last.dates': { en: 'Apr 27 – Apr 30, 2026', ru: '27 апреля – 30 апреля 2026' },

  // Plans
  'price.plans.title': { en: 'Choose Your Plan', ru: 'Выберите свой тариф' },
  'price.plans.subtitle': { en: 'Invest in your future today', ru: 'Инвестируйте в своё будущее уже сегодня' },
  'plan.rec.title': { en: 'Recordings Only', ru: 'Только Записи' },
  'plan.rec.desc': { en: 'Learn at your own pace with full access to all materials', ru: 'Учитесь в своем темпе с полным доступом ко всем материалам' },
  'plan.live.title': { en: 'Live Sessions', ru: 'Живые Занятия' },
  'plan.live.desc': { en: 'Join live sessions with the instructor and get real-time feedback', ru: 'Участвуйте в живых сессиях с инструктором и получайте обратную связь' },
  'plan.oneTime': { en: 'one-time payment', ru: 'единоразовый платеж' },
  'plan.scanMbank': { en: 'Scan to pay via Mbank', ru: 'Сканируй для оплаты через Mbank' },
  'plan.afterPayment': { en: 'After payment, send confirmation screenshot via WhatsApp', ru: 'После оплаты отправь скриншот подтверждения в WhatsApp' },
  'plan.confirmWhatsapp': { en: 'Confirm via WhatsApp', ru: 'Подтвердить через WhatsApp' },
  'plan.or': { en: 'or', ru: 'или' },
  'plan.payCard': { en: 'Pay with Visa / Mastercard', ru: 'Оплатить через Visa, Mastercard' },
  'plan.popular': { en: 'Most Popular', ru: 'Самый Популярный' },
  'plan.totalValue': { en: 'Total value', ru: 'Общая ценность' },
  'plan.youPay': { en: 'You pay', ru: 'Вы платите' },
  'plan.savings': { en: 'Savings', ru: 'Экономия' },
  'plan.rec.v1': { en: 'Full access to all lesson recordings', ru: 'Полный доступ ко всем записям уроков' },
  'plan.rec.v2': { en: 'Community access', ru: 'Доступ к сообществу' },
  'plan.live.v1': { en: '6 live sessions with instructor', ru: '6 живых занятий с инструктором' },
  'plan.live.v2': { en: 'Full access to all lesson recordings', ru: 'Полный доступ ко всем записям уроков' },
  'plan.live.v3': { en: 'Community access', ru: 'Доступ к сообществу' },
  'plan.rec.f1': { en: 'Full access to all lesson recordings', ru: 'Полный доступ ко всем записям уроков' },
  'plan.rec.f2': { en: 'Lifetime access to materials', ru: 'Пожизненный доступ к материалам' },
  'plan.rec.f3': { en: 'Private Discord community', ru: 'Приватное сообщество Discord' },
  'plan.rec.f4': { en: 'Certificate of completion', ru: 'Сертификат об окончании' },
  'plan.live.f1': { en: 'Everything in Recordings plan', ru: 'Всё из тарифа Записи' },
  'plan.live.f2': { en: '6 live sessions with instructor', ru: '6 живых занятий с инструктором' },
  'plan.live.f3': { en: 'Real-time Q&A', ru: 'Вопросы и ответы в реальном времени' },
  'plan.live.f4': { en: 'Personal instructor support', ru: 'Персональная поддержка инструктора' },
  'plan.live.f5': { en: 'Demo Day presentation', ru: 'Презентация на Demo Day' },
  'plan.live.f6': { en: 'Priority Discord support', ru: 'Приоритетная поддержка в Discord' },
  'price.ageRec': { en: 'Recommended age: 12 to 48 years', ru: 'Рекомендуемый возраст: от 12 до 48 лет' },

  // Footer
  'footer.title': { en: 'Join Our Community', ru: 'Присоединяйтесь к сообществу' },
  'footer.whatsapp': { en: 'WhatsApp', ru: 'WhatsApp' },
  'footer.telegram': { en: 'Telegram', ru: 'Telegram' },
  'footer.instagram': { en: 'Instagram', ru: 'Instagram' },
  'footer.rights': { en: '© 2026 iOS Vibe Coding. All rights reserved.', ru: '© 2026 iOS Vibe Coding. Все права защищены.' },
  'footer.question': { en: 'Have questions? Contact us:', ru: 'Есть вопросы? Свяжитесь с нами:' },

  // Sticky CTA
  'sticky.text': { en: 'Limited spots available', ru: 'Количество мест ограничено' },
  'sticky.cta': { en: 'Enroll — $350', ru: 'Записаться — $350' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
