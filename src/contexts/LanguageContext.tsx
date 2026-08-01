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

  // Student work
  'work.badge': { en: 'Student projects', ru: 'Работы студентов' },
  'work.title': { en: 'Real apps built by our students', ru: 'Реальные приложения, созданные нашими студентами' },
  'work.subtitle': { en: 'No coding background. Just the course, AI and a few weeks of work.', ru: 'Без опыта в программировании. Только курс, AI и пара недель работы.' },
  'work.aman.name': { en: 'Aman', ru: 'Аман' },
  'work.aman.role': { en: 'Entrepreneur, South Korea', ru: 'Предприниматель, Южная Корея' },
  'work.aman.app': { en: 'Shazam clone', ru: 'Клон Shazam' },
  'work.aman.desc': { en: 'A music recognition app that identifies songs from a few seconds of audio.', ru: 'Приложение распознаёт песню за несколько секунд звука.' },
  'work.elnura.name': { en: 'Elnura', ru: 'Эльнура' },
  'work.elnura.role': { en: 'Housewife, Chicago', ru: 'Домохозяйка, Чикаго' },
  'work.elnura.app': { en: 'English phrases app', ru: 'Приложение для изучения английского' },
  'work.elnura.desc': { en: 'Learn English through simple phrases with transcription and translation.', ru: 'Учите английский по простым фразам с произношением и переводом.' },


  // Hero
  'hero.badge': { en: 'Save $150 — Live Sessions', ru: 'Экономия $150 — Живые Занятия' },
  'hero.title1': { en: 'Build an iOS app', ru: 'Создай iOS приложение' },
  'hero.title2': { en: 'that earns', ru: 'которое приносит' },
  'hero.title3': { en: '$1,000/month', ru: '$1,000/месяц' },
  'hero.subtitle': { en: 'Become an iOS Vibe Coder in 15 days. Design, build and ship AI-powered apps to the App Store without writing code.', ru: 'Стань iOS Vibe Coder\'ом за 15 дней. Проектируй, создавай и публикуй AI-приложения в App Store без написания кода.' },
  'hero.subtitleAccent': { en: 'Join the Vibe Coder movement.', ru: 'Присоединяйся к Vibe Coder движению.' },
  'hero.discountBanner': { en: 'enroll now and save $150 on Live Sessions', ru: 'запишись сейчас и сэкономь $150 на Живых Занятиях' },
  'hero.cta': { en: 'Enroll Now — $349', ru: 'Записаться — $349' },
  'hero.ctaSubtext': { en: 'Save $150 · Limited spots', ru: 'Экономия $150 · Ограниченные места' },
  'hero.startLearning': { en: 'Start Learning', ru: 'Начать обучение' },
  'nav.startLearning': { en: 'Start Learning', ru: 'Начать' },
  'hero.students': { en: 'students already enrolled', ru: 'студентов уже записались' },
  'hero.revenue': { en: 'Graduates ship real App Store apps and target their first $600+ before the course ends', ru: 'Выпускники публикуют реальные приложения в App Store и стремятся к первым $600+ до конца курса' },
  'hero.stat1.val': { en: '300+', ru: '300+' },
  'hero.stat1.label': { en: 'students on the course', ru: 'студентов на курсе' },
  'hero.stat2.val': { en: '8+', ru: '8+' },
  'hero.stat2.label': { en: 'launched projects', ru: 'запущенных проектов' },
  'hero.stat3.val': { en: '15', ru: '15' },
  'hero.stat3.label': { en: 'days to launch', ru: 'дней до запуска' },
  'hero.stat4.val': { en: '0', ru: '0' },
  'hero.stat4.label': { en: 'lines of code to write', ru: 'строк кода писать' },
  'hero.countdownTitle': { en: 'Limited spots available', ru: 'Количество мест ограничено' },

  // Countdown
  'countdown.days': { en: 'd', ru: 'd' },
  'countdown.hours': { en: 'h', ru: 'h' },
  'countdown.minutes': { en: 'm', ru: 'm' },
  'countdown.seconds': { en: 's', ru: 'с' },
  'countdown.starts': { en: 'Program starts in', ru: 'Программа начнётся через' },

  // Instructor
  'instructor.title': { en: 'Your Instructor', ru: 'Ваш инструктор' },
  'instructor.name': { en: 'Seyitbek Usmanov', ru: 'Сейитбек Усманов' },
  'instructor.bio': { en: 'Experienced software engineer and AI enthusiast with years as a Tech Lead at Deloitte, Accenture, and other major enterprises. He now helps hundreds of students turn their ideas into real products using AI-powered development. This course is built for absolute beginners — no prior Swift or programming experience required, just a Mac and curiosity.', ru: 'Опытный инженер-программист и энтузиаст ИИ, много лет работавший тех-лидом в Deloitte, Accenture и других крупных компаниях. Теперь он помогает сотням студентов превратить их идеи в реальные продукты с помощью ИИ-ассистированной разработки. Курс рассчитан на абсолютных новичков — без опыта Swift и программирования, нужны только Mac и любопытство.' },
  'instructor.techLead': { en: 'Tech Lead Roles', ru: 'Роли тех-лида' },
  'instructor.students': { en: 'Students Taught', ru: 'Обучено студентов' },
  'instructor.experience': { en: 'Years Experience', ru: 'Лет опыта' },
  'instructor.techLeadAt': { en: 'Tech Lead at', ru: 'Тех-лид в' },
  'instructor.companiesHeadline': { en: 'Worked at some of the largest IT companies in the USA', ru: 'Работал в крупнейших IT-компаниях США' },
  'instructor.revenue': { en: 'revenue', ru: 'выручка' },
  'instructor.philosophy': { en: 'I bridge enterprise-grade engineering and AI-powered product building — so beginners ship real apps, not just tutorials.', ru: 'Я соединяю корпоративный инженерный опыт и создание продуктов с помощью ИИ — чтобы новички выпускали реальные приложения, а не учебные примеры.' },

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
  'vibe.oldWay': { en: 'The Old Way', ru: 'Старый путь' },
  'vibe.newWay': { en: 'The Vibe Coder Way', ru: 'Путь Vibe Coder' },
  'vibe.vs': { en: 'VS', ru: 'VS' },
  'vibe.chapter': { en: 'Chapter', ru: 'Глава' },


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
  'sched.title': { en: 'Live sessions worldwide', ru: 'Живые сессии по всему миру' },
  'sched.titleAccent': { en: 'worldwide', ru: 'по всему миру' },
  'sched.subtitle': { en: 'Join us 3 days a week from anywhere in the world', ru: 'Присоединяйтесь к нам 3 дня в неделю из любой точки мира' },
  'sched.daysTitle': { en: 'Class Days', ru: 'Дни занятий' },
  'sched.zonesTitle': { en: 'Time Zones', ru: 'Часовые пояса' },
  'sched.yourZone': { en: 'Your time zone', ru: 'Ваш часовой пояс' },
  'sched.nextDay': { en: 'next day', ru: 'след. день' },
  'sched.day.mon': { en: 'Monday', ru: 'Понедельник' },
  'sched.day.wed': { en: 'Wednesday', ru: 'Среда' },
  'sched.day.fri': { en: 'Friday', ru: 'Пятница' },
  'sched.city.ny': { en: 'New York', ru: 'Нью-Йорк' },
  'sched.city.moscow': { en: 'Moscow', ru: 'Москва' },
  'sched.city.berlin': { en: 'Berlin', ru: 'Берлин' },
  'sched.city.bishkek': { en: 'Bishkek', ru: 'Бишкек' },

  // Pricing Timeline
  'price.timeline.title': { en: '⏰ Price increases as the course approaches', ru: '⏰ Цена растёт по мере приближения курса' },
  'price.timeline.subtitle': { en: 'Lock in the lowest price — enroll early!', ru: 'Зафиксируй самую низкую цену — записывайся раньше!' },
  'price.expired': { en: 'Expired', ru: 'Истекло' },
  'price.current': { en: 'Current Price', ru: 'Текущая цена' },
  'price.tier.early': { en: 'Early Bird', ru: 'Ранняя цена' },
  'price.tier.early.amount': { en: '$349', ru: '$349' },
  'price.tier.early.when': { en: '2+ weeks before start', ru: '2+ недели до начала' },
  'price.tier.early.dates': { en: 'Before Apr 15, 2026', ru: 'До 15 апреля 2026' },
  'price.tier.current': { en: 'Regular Price', ru: 'Обычная цена' },
  'price.tier.current.amount': { en: '$349', ru: '$349' },
  'price.tier.current.when': { en: '1–2 weeks before start', ru: '1–2 недели до начала' },
  'price.tier.current.dates': { en: 'Apr 15 – Apr 26, 2026', ru: '15 апреля – 26 апреля 2026' },
  'price.tier.last': { en: 'Last Chance', ru: 'Последний шанс' },
  'price.tier.last.amount': { en: '$349', ru: '$349' },
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

  // Requirements
  'req.eyebrow': { en: 'Requirements', ru: 'Требования' },
  'req.title': { en: 'What you need to join', ru: 'Что нужно для участия' },
  'req.subtitle': { en: 'Built for absolute beginners — here is exactly what to bring', ru: 'Курс для абсолютных новичков — вот что вам понадобится' },
  'req.needTitle': { en: 'You need', ru: 'Вам понадобится' },
  'req.skipTitle': { en: "You don't need", ru: 'Не понадобится' },
  'req.n1.title': { en: 'A Mac computer', ru: 'Mac-компьютер' },
  'req.n1.desc': { en: 'Required for Xcode and iOS builds — Windows won\'t work', ru: 'Нужен для Xcode и сборки iOS — Windows не подойдёт' },
  'req.n2.title': { en: 'Apple Developer account', ru: 'Аккаунт Apple Developer' },
  'req.n2.desc': { en: '$99/year to publish your app to the App Store', ru: '$99 в год для публикации приложения в App Store' },
  'req.n3.title': { en: '~6 hours, 3 days a week', ru: '~6 часов, 3 дня в неделю' },
  'req.n3.desc': { en: 'Live sessions on Mon, Wed, Fri — or follow recordings at your own pace', ru: 'Живые сессии в Пн, Ср, Пт — или записи в своём темпе' },
  'req.n4.title': { en: 'Reliable internet', ru: 'Стабильный интернет' },
  'req.n4.desc': { en: 'For live sessions and AI tools (Claude Code, Google Stitch)', ru: 'Для живых сессий и ИИ-инструментов (Claude Code, Google Stitch)' },
  'req.n5.title': { en: 'Budget ~$50 for Claude', ru: '~$50 на Claude' },
  'req.n5.desc': { en: 'You\'ll need an active Claude subscription — plan for at least $50 over the course for the AI coding assistant', ru: 'Понадобится активная подписка Claude — заложите минимум $50 за курс на ИИ-ассистента для написания кода' },
  'req.s1.title': { en: 'Coding experience', ru: 'Опыт программирования' },
  'req.s1.desc': { en: 'Zero Swift or programming knowledge required — built for absolute beginners', ru: 'Не нужен опыт Swift или программирования — курс для абсолютных новичков' },
  'req.s2.title': { en: 'Design skills', ru: 'Навыки дизайна' },
  'req.s2.desc': { en: 'Google Stitch generates the UI from plain words', ru: 'Google Stitch создаёт интерфейс из простых слов' },
  'req.s3.title': { en: 'Expensive software', ru: 'Дорогое ПО' },
  'req.s3.desc': { en: 'All the developer tools we use are free', ru: 'Все инструменты разработчика бесплатны' },
  'req.s4.title': { en: 'Age limits', ru: 'Возрастные ограничения' },
  'req.s4.desc': { en: 'Recommended 12–48, but everyone is welcome', ru: 'Рекомендуется 12–48, приветствуются все' },
  'req.s5.title': { en: 'An iPhone', ru: 'iPhone' },
  'req.s5.desc': { en: 'A Mac with the free Xcode Simulator is enough to build, test, and publish — no physical device needed', ru: 'Mac с бесплатным симулятором Xcode достаточно для разработки, тестирования и публикации — физическое устройство не нужно' },

  // Footer
  'footer.title': { en: 'Join Our Community', ru: 'Присоединяйтесь к сообществу' },
  'footer.whatsapp': { en: 'WhatsApp', ru: 'WhatsApp' },
  'footer.telegram': { en: 'Telegram', ru: 'Telegram' },
  'footer.instagram': { en: 'Instagram', ru: 'Instagram' },
  'footer.rights': { en: '© 2026 iOS Vibe Coding. All rights reserved.', ru: '© 2026 iOS Vibe Coding. Все права защищены.' },
  'footer.question': { en: 'Have questions? Contact us:', ru: 'Есть вопросы? Свяжитесь с нами:' },

  // Sticky CTA
  'sticky.text': { en: 'Limited spots available', ru: 'Количество мест ограничено' },
  'sticky.cta': { en: 'Enroll — $349', ru: 'Записаться — $349' },

  // App Store Section
  'as.eyebrow': { en: 'Day 15 · The finish line', ru: 'День 15 · Финиш' },
  'as.title1': { en: 'Your app.', ru: 'Твоё приложение.' },
  'as.title2': { en: 'Live on the', ru: 'Уже в' },
  'as.title3': { en: 'App Store', ru: 'App Store' },
  'as.subtitle': { en: 'Not a demo. Not a prototype. A real product downloadable by 1.8 billion iPhone users worldwide.', ru: 'Не демо. Не прототип. Реальный продукт, который могут скачать 1.8 миллиарда пользователей iPhone по всему миру.' },
  'as.check1': { en: 'Shipped via App Store Connect', ru: 'Опубликовано через App Store Connect' },
  'as.check2': { en: 'Passed Apple review', ru: 'Прошло проверку Apple' },
  'as.check3': { en: 'Reachable by 1.8B iPhone users', ru: 'Доступно 1.8 млрд пользователей iPhone' },
  'as.check4': { en: 'Ready to earn revenue', ru: 'Готово приносить доход' },
  'as.appName': { en: 'HabitFlow', ru: 'HabitFlow' },
  'as.appDev': { en: 'Force Academy', ru: 'Force Academy' },
  'as.appTagline': { en: 'Habits · Focus · Growth', ru: 'Привычки · Фокус · Рост' },
  'as.get': { en: 'GET', ru: 'ЗАГР' },
  'as.ratings': { en: '1.2K Ratings', ru: '1.2К оценок' },
  'as.category': { en: '#12 Productivity', ru: '#12 Продуктивность' },
  'as.preview': { en: 'Preview', ru: 'Превью' },
  'as.whatsNew': { en: "What's New", ru: 'Что нового' },
  'as.version': { en: 'Version 1.0.2 · 2d ago', ru: 'Версия 1.0.2 · 2 дн. назад' },
  'as.changelog': { en: 'New streak animations and iCloud sync improvements.', ru: 'Новые анимации серий и улучшения синхронизации iCloud.' },
  'as.reviews': { en: 'Ratings & Reviews', ru: 'Оценки и отзывы' },
  'as.reviewTitle': { en: 'Actually life-changing', ru: 'Реально меняет жизнь' },
  'as.reviewBody': { en: 'Clean, fast, and beautifully designed. Built by an indie dev — respect.', ru: 'Чисто, быстро и красиво. Сделано инди-разработчиком — уважение.' },
  'as.reviewer': { en: '— @sarah_builds', ru: '— @sarah_builds' },

  // Retro (retrospective feedback board)
  'retro.brand': { en: 'Retro Board', ru: 'Ретро-доска' },
  'retro.back': { en: 'Back to home', ru: 'На главную' },
  'retro.badge': { en: 'Retrospective', ru: 'Ретроспектива' },
  'retro.title.a': { en: 'iOS Vibe Coding', ru: 'iOS Vibe Coding' },
  'retro.title.b': { en: 'let\'s grow together', ru: 'растём вместе' },
  'retro.subtitle': {
    en: 'Share what worked and what we can improve for the next cohort. Vote on ideas you love.',
    ru: 'Поделись, что получилось, и что стоит улучшить в следующем потоке. Голосуй за идеи, которые тебе близки.',
  },
  'retro.stat.ideas': { en: 'Ideas', ru: 'Идей' },
  'retro.stat.wins': { en: 'Wins', ru: 'Побед' },
  'retro.stat.improvements': { en: 'Improvements', ru: 'Улучшений' },
  'retro.cta.share': { en: 'Share feedback', ru: 'Оставить отзыв' },
  'retro.share': { en: 'Share', ru: 'Поделиться' },
  'retro.share.copied': { en: 'Link copied', ru: 'Ссылка скопирована' },
  'retro.share.title': { en: 'iOS Vibe Coding — Retro', ru: 'iOS Vibe Coding — Ретро' },

  'retro.form.title': { en: 'Add your voice', ru: 'Добавь свой голос' },
  'retro.form.category': { en: 'Category', ru: 'Категория' },
  'retro.form.cat.well': { en: '✅ What went well', ru: '✅ Что получилось' },
  'retro.form.cat.improve': { en: '💡 What to improve', ru: '💡 Что улучшить' },
  'retro.form.author': { en: 'Your name (optional)', ru: 'Твоё имя (необязательно)' },
  'retro.form.author.ph': { en: 'Anonymous', ru: 'Аноним' },
  'retro.form.content': { en: 'Your feedback', ru: 'Твой отзыв' },
  'retro.form.content.ph': {
    en: 'Tell us what you think…',
    ru: 'Расскажи, что думаешь…',
  },
  'retro.form.submit': { en: 'Submit', ru: 'Отправить' },
  'retro.form.sending': { en: 'Sending…', ru: 'Отправляем…' },
  'retro.form.success': { en: 'Thanks — your feedback was added.', ru: 'Спасибо — твой отзыв добавлен.' },
  'retro.form.err': { en: 'Something went wrong. Please try again.', ru: 'Что-то пошло не так. Попробуй ещё раз.' },
  'retro.form.err.empty': { en: 'Please write at least a couple of words.', ru: 'Напиши хотя бы пару слов.' },

  'retro.well.title': { en: 'What went well', ru: 'Что получилось' },
  'retro.improve.title': { en: 'What to improve', ru: 'Что улучшить' },
  'retro.empty.well': { en: 'Be the first to share a win.', ru: 'Стань первым, кто поделится победой.' },
  'retro.empty.improve': { en: 'No suggestions yet — add one!', ru: 'Пока нет предложений — добавь своё!' },
  'retro.anon': { en: 'Anonymous', ru: 'Аноним' },
  'retro.vote': { en: 'Upvote', ru: 'Голос за' },
  'retro.voted': { en: 'Voted', ru: 'Ты проголосовал' },
  'retro.votes': { en: 'votes', ru: 'голосов' },

  'retro.status.label': { en: 'Status', ru: 'Статус' },
  'retro.status.open': { en: 'Open', ru: 'Открыто' },
  'retro.status.planned': { en: 'Planned', ru: 'В планах' },
  'retro.status.in_progress': { en: 'In progress', ru: 'В работе' },
  'retro.status.done': { en: 'Done', ru: 'Готово' },

  'retro.footer': { en: 'iOS Vibe Coding · Retro board', ru: 'iOS Vibe Coding · Ретро-доска' },
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
