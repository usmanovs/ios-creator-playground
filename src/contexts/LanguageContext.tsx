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
  'nav.course': { en: 'Course', ru: 'Курс' },
  'nav.enroll': { en: 'Enroll Now', ru: 'Записаться' },

  // Hero
  'hero.badge': { en: '🚀 Enrollment is open — spots are limited', ru: '🚀 Набор открыт — места ограничены' },
  'hero.title1': { en: 'Build an iOS App', ru: 'Создай iOS приложение' },
  'hero.title2': { en: 'That Earns', ru: 'Которое приносит' },
  'hero.title3': { en: '$10,000/month', ru: '$10,000/месяц' },
  'hero.subtitle': { en: 'Learn to build real iOS apps using AI — no prior coding experience needed. Go from zero to the App Store in 15 days.', ru: 'Научись создавать реальные iOS приложения с помощью ИИ — без опыта программирования. От нуля до App Store за 15 дней.' },
  'hero.cta': { en: 'Enroll Now — $399', ru: 'Записаться — $399' },
  'hero.students': { en: 'students already enrolled', ru: 'студентов уже записались' },
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
  'instructor.bio': { en: 'Experienced software engineer and AI enthusiast with years as a Tech Lead at Deloitte, Accenture, and other major enterprises. He now helps hundreds of students turn their ideas into real products using AI-powered development. This course is built for absolute beginners — no prior Swift or programming experience required, just a Mac and curiosity.', ru: 'Опытный инженер-программист и энтузиаст ИИ, много лет работавший тех-лидом в Deloitte, Accenture и других крупных компаниях. Теперь он помогает сотням студентов превратить их идеи в реальные продукты с помощью ИИ-ассистированной разработки. Курс рассчитан на абсолютных новичков — без опыта Swift и программирования, нужны только Mac и любопытство.' },
  'instructor.techLead': { en: 'Tech Lead Roles', ru: 'Роли тех-лида' },
  'instructor.students': { en: 'Students Taught', ru: 'Обучено студентов' },
  'instructor.experience': { en: 'Years Experience', ru: 'Лет опыта' },
  'instructor.techLeadAt': { en: 'Tech Lead at', ru: 'Тех-лид в' },

  // Vibe Coder
  'vibe.title': { en: 'What is a Vibe Coder?', ru: 'Что такое Vibe Coder?' },
  'vibe.subtitle': { en: 'A new way to build apps — an AI-first workflow with Claude Code, Claude Desktop and Google Stitch, while you focus on the vision', ru: 'Новый способ создавать приложения — AI-first процесс с Claude Code, Claude Desktop и Google Stitch, а вы фокусируетесь на идее' },
  'vibe.traditional': { en: 'Traditional Developer', ru: 'Традиционный разработчик' },
  'vibe.vibeCoder': { en: 'Vibe Coder', ru: 'Vibe Coder' },
  'vibe.trad1': { en: 'Memorize Swift syntax for months', ru: 'Месяцы зубрёжки синтаксиса Swift' },
  'vibe.trad2': { en: 'Hand-draw every screen in Figma', ru: 'Рисуешь каждый экран вручную в Figma' },
  'vibe.trad3': { en: 'Stuck for hours on Stack Overflow', ru: 'Часами зависаешь на Stack Overflow' },
  'vibe.trad4': { en: 'Months before you ship anything', ru: 'Месяцы до первого релиза' },
  'vibe.vib1': { en: 'Describe screens in plain English to Claude Code', ru: 'Описываешь экраны простыми словами в Claude Code' },
  'vibe.vib2': { en: 'Generate iOS-native UI in Google Stitch', ru: 'Генерируешь нативный iOS UI в Google Stitch' },
  'vibe.vib3': { en: 'Claude Desktop + MCP debugs and automates for you', ru: 'Claude Desktop + MCP сам отлаживает и автоматизирует' },
  'vibe.vib4': { en: 'Ship to the App Store in 15 days', ru: 'Публикация в App Store за 15 дней' },
  'vibe.card1.title': { en: 'AI-Powered Development', ru: 'Разработка с помощью ИИ' },
  'vibe.card1.desc': { en: 'Use Claude Code, Claude Desktop and Google Stitch to design, build and ship SwiftUI apps faster than ever', ru: 'Используйте Claude Code, Claude Desktop и Google Stitch, чтобы проектировать, разрабатывать и публиковать SwiftUI-приложения быстрее, чем когда-либо' },
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
  'curr.subtitle': { en: 'From zero to a published App Store app, powered by AI', ru: 'С нуля до опубликованного приложения в App Store с помощью ИИ' },
  'curr.week1': { en: 'Chapter 1: Setup', ru: 'Глава 1: Настройка' },
  'curr.week1.desc': { en: 'Get your dev environment ready: Xcode, Apple Developer account, Claude Code, Claude Desktop and Google Stitch. Understand the AI-first iOS workflow before writing a single line of code.', ru: 'Подготовка окружения: Xcode, аккаунт Apple Developer, Claude Code, Claude Desktop и Google Stitch. Знакомство с AI-first процессом до первой строчки кода.' },
  'curr.week2': { en: 'Chapter 2: Design with Google Stitch', ru: 'Глава 2: Дизайн в Google Stitch' },
  'curr.week2.desc': { en: 'Generate iOS-native UI screens from prompts with Google Stitch. Iterate on layouts, flows and visual style without needing Figma or design experience.', ru: 'Генерация нативных iOS-экранов из промптов в Google Stitch. Итерация по макетам, флоу и визуальному стилю без Figma и опыта в дизайне.' },
  'curr.week3': { en: 'Chapter 3: Building with Claude Code', ru: 'Глава 3: Разработка с Claude Code' },
  'curr.week3.desc': { en: 'Turn designs into a real SwiftUI app using Claude Code. Screens, navigation, state and data shipped through conversational coding, not memorizing Swift syntax.', ru: 'Превращаем дизайн в реальное SwiftUI-приложение с Claude Code. Экраны, навигация, состояние и данные через диалог с ИИ, без зубрёжки Swift.' },
  'curr.week4': { en: 'Chapter 4: Claude Desktop + MCP', ru: 'Глава 4: Claude Desktop + MCP' },
  'curr.week4.desc': { en: 'Supercharge your workflow with Claude Desktop and MCP servers. Connect tools, automate repetitive tasks and let AI operate across your project end-to-end.', ru: 'Прокачиваем процесс с Claude Desktop и MCP-серверами. Подключаем инструменты, автоматизируем рутину и даём ИИ работать со всем проектом.' },
  'curr.week5': { en: 'Chapter 5: Polish and Identity', ru: 'Глава 5: Полировка и айдентика' },
  'curr.week5.desc': { en: 'App icon, screenshots, onboarding and the small details that make an app feel real. Brand identity and UX polish before submission.', ru: 'Иконка, скриншоты, онбординг и детали, которые делают приложение настоящим. Айдентика и UX-полировка перед сабмитом.' },
  'curr.week6': { en: 'Chapter 6: App Store Launch', ru: 'Глава 6: Запуск в App Store' },
  'curr.week6.desc': { en: 'App Store Connect setup, submission, the review process and going live. Finish the course with a real, published iOS app, not a demo.', ru: 'Настройка App Store Connect, сабмит, ревью и публикация. Завершаем курс реальным опубликованным iOS-приложением, а не демо.' },

  // Schedule
  'sched.title': { en: 'Schedule', ru: 'Расписание' },
  'sched.subtitle': { en: 'Live sessions 3 times per week', ru: 'Живые сессии 3 раза в неделю' },
  'sched.format': { en: 'Live Online Sessions', ru: 'Живые онлайн-сессии' },
  'sched.days': { en: 'Monday, Wednesday, Friday', ru: 'понедельник, среда, пятница' },
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
  'price.tier.last.amount': { en: '$399', ru: '$399' },
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
  'plan.payCard': { en: 'Pay with Visa / Mastercard', ru: 'Оплатить через Visa или Mastercard' },
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
  'sticky.cta': { en: 'Enroll — $399', ru: 'Записаться — $399' },
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
