"use strict";
/**
 * Главная BurningHouse: витрина сервисов. Авторизации здесь нет — карточка
 * ведёт прямо на домен сервиса, а не через /authorize.
 *
 * Список сервисов — данные, а не разметка: новый сервис добавляется одной
 * записью в SERVICES, карточка и модалка собираются из неё же.
 */

const $ = id => document.getElementById(id);

/* ---------- тема (см. Design/palette.md: рассвет — не осветлённая ночь) ---------- */

const THEME_KEY = "bh-theme";
const moonIcon = `<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;
const sunIcon = `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>`;

function currentTheme() {
  return localStorage.getItem(THEME_KEY) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  $("themeBtn").innerHTML = theme === "dark" ? sunIcon : moonIcon;
}
applyTheme(currentTheme());
$("themeBtn").addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

/* ---------- язык ----------
   Тот же приём, что и с темой: явный выбор в localStorage побеждает,
   иначе — авто-определение по языку браузера. Только ru/en, поэтому логика
   вырождается в одну проверку, а не в подбор ближайшей локали. */

const LANG_KEY = "bh-lang";

function detectLang() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === "ru" || stored === "en") return stored;
  const nav = (navigator.language || navigator.userLanguage || "ru").toLowerCase();
  return nav.startsWith("ru") ? "ru" : "en";
}
let lang = detectLang();

const STRINGS = {
  ru: {
    htmlLang: "ru",
    ogLocale: "ru_RU",
    title: "BurningHouse — сервисы",
    description: "Мои финансы, «Что смотрим?», «Куда поедем?», «Пораскинем мозгами?» и «Что собираем?» — сервисы BurningHouse в одном месте.",
    heroTitle: "Мои сервисы",
    heroText: "Небольшие штуки для дома и для друзей. Выберите карточку, чтобы узнать подробнее и перейти.",
    close: "Закрыть",
    go: "Перейти",
    screenshot: n => `Скриншот ${n}`,
    themeToggle: "Сменить тему",
    langLabel: "EN",
    langToggle: "Переключить на английский",
  },
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    title: "BurningHouse — services",
    description: "My Finances, “What Are We Watching?”, “Where Are We Going?”, “Brain Games?” and “What Are We Piecing Together?” — BurningHouse services in one place.",
    heroTitle: "My services",
    heroText: "Small tools for home and friends. Pick a card to learn more and go.",
    close: "Close",
    go: "Open",
    screenshot: n => `Screenshot ${n}`,
    themeToggle: "Toggle theme",
    langLabel: "RU",
    langToggle: "Switch to Russian",
  },
};
const t = () => STRINGS[lang];

/* ---------- сервисы ----------
   base/tip — вершина и уголь пламени сервиса (Design/palette.md), вписаны
   вручную: карточек на странице несколько одновременно, а --flame-* в
   brand.css — переменная одна на документ, всем сразу её не отдать.
   name/teaser/desc — по языку (ru/en), остальное от языка не зависит. */

const SERVICES = [
  {
    id: "finance",
    href: "https://money.burninghouse.ru",
    base: "#b45309",
    tip: "#ffd447",
    shots: ["assets/Images/Money1.png", "assets/Images/Money2.png", "assets/Images/Money3.png"],
    ru: {
      name: "Мои финансы",
      teaser: "Бюджет, счета и общие траты — свои и семейные.",
      desc: "Учёт доходов и расходов, общие бюджеты и цели накоплений. Разбивка по категориям — для одного человека или для всей семьи.",
    },
    en: {
      name: "My Finances",
      teaser: "Budget, accounts, and shared expenses — personal and family.",
      desc: "Track income and expenses, shared budgets, and savings goals. Broken down by category — for one person or the whole family.",
    },
  },
  {
    id: "movies",
    href: "https://movies.burninghouse.ru",
    base: "#7f1d1d",
    tip: "#ff3d5a",
    shots: ["assets/Images/Movies2.png", "assets/Images/Movies3.png", "assets/Images/Movies4.png"],
    ru: {
      name: "Что смотрим?",
      teaser: "Выбирает фильм на вечер, когда компания не может договориться.",
      desc: "Когда все долго спорят, что посмотреть, сервис сам выбирает случайный фильм из общего списка — быстро и без лишних споров.",
    },
    en: {
      name: "What Are We Watching?",
      teaser: "Picks a movie for the night when nobody can agree.",
      desc: "When everyone argues for ages about what to watch, the service picks a random movie from the shared list — fast, no more arguing.",
    },
  },
  {
    id: "trip",
    href: "https://trip.burninghouse.ru",
    base: "#0f766e",
    tip: "#4fe3c1",
    shots: ["assets/Images/Trip3.png", "assets/Images/Trip.png", "assets/Images/Trip4.png"],
    ru: {
      name: "Куда поедем?",
      teaser: "Планирование поездки компанией: маршрут, даты, участники.",
      desc: "Планирование поездки на несколько человек: куда, когда и кто едет — всё в одном месте, а не в разрозненной переписке.",
    },
    en: {
      name: "Where Are We Going?",
      teaser: "Planning a group trip: route, dates, participants.",
      desc: "Planning a trip for several people: where, when, and who's going — all in one place instead of a scattered chat.",
    },
  },
  {
    id: "brain",
    href: "https://brain.burninghouse.ru",
    base: "#9d174d",
    tip: "#ff5c8a",
    shots: ["assets/Images/Brain1.png", "assets/Images/Brain2.png", "assets/Images/Brain3.png"],
    ru: {
      name: "Пораскинем мозгами?",
      teaser: "Четырнадцать коротких упражнений на память, внимание и реакцию.",
      desc: "Упражнения на память, внимание, счёт и гибкость мышления — без регистрации и без сохранения аккаунта. Открыл и играешь.",
    },
    en: {
      name: "Brain Games?",
      teaser: "Fourteen short exercises for memory, attention, and reaction.",
      desc: "Exercises for memory, attention, arithmetic, and mental flexibility — no sign-up, no saved account. Just open it and play.",
    },
  },
  {
    id: "puzzle",
    href: "https://puzzle.burninghouse.ru",
    base: "#3f6212",
    tip: "#7ddf3c",
    shots: ["assets/Images/Puzzle1.png", "assets/Images/Puzzle2.png", "assets/Images/Puzzle3.png"],
    ru: {
      name: "Что собираем?",
      teaser: "Пазлы прямо в браузере — из своих фото или из библиотеки, одному или с друзьями.",
      desc: "Библиотека готовых пазлов с фигурными деталями, стол можно зумить и таскать. Играть можно без входа — прогресс хранится в браузере; вошедшие открывают комнаты, собирают пазл вместе с друзьями в реальном времени и могут превратить в пазл любую свою фотографию.",
    },
    en: {
      name: "What Are We Piecing Together?",
      teaser: "Jigsaw puzzles right in your browser — from your own photos or the library, solo or with friends.",
      desc: "A library of ready-made puzzles with irregular pieces; the table can be zoomed and dragged. Play without signing in — progress is kept in the browser; signed-in users open rooms, assemble puzzles together with friends in real time, and can turn any photo of their own into a puzzle.",
    },
  },
];
const svcText = svc => svc[lang];

/* ---------- знак с цветом конкретного сервиса ----------
   Тот же контур, что в Shared/mark.svg, но градиент со своим id и вписанными
   стопами — см. комментарий выше про одну переменную на документ. */
function markSvg(gradId, base, tip) {
  return `<svg class="bh-mark" viewBox="0 0 24 24" role="img" aria-hidden="true">
    <defs><linearGradient id="${gradId}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="${base}"/><stop offset="1" stop-color="${tip}"/>
    </linearGradient></defs>
    <path fill="url(#${gradId})" fill-rule="evenodd"
      d="M12 1.2C13.6 5 16.4 6.6 18.2 9.4C21.4 14.4 18.6 22.4 12 22.4C5.4 22.4 2.6 14.4 5.8 9.4C7.2 7.2 9.2 6 10.2 3.4C10.9 5.6 11.4 6.6 12 7.4C12.4 5.6 12.3 3.4 12 1.2ZM12 9.8 7.4 13.6V19.2H16.6V13.6Z"/>
  </svg>`;
}

/* ---------- превью сервиса: картинка с запасным вариантом ----------
   Пока файла нет (или путь ещё не подставлен) — градиент цвета сервиса со
   знаком поверх, а не сломанная картинка.
   eager — для картинок, которые показываются сразу (модалка): она уже
   открыта и уже в кадре, а нативный loading="lazy" рассчитан на прокрутку и
   у только что вставленного в DOM элемента срабатывает не сразу — картинка
   повисает пустой на несколько секунд, пока с ней никто не взаимодействует. */
function mediaEl(svc, gradId, src, eager) {
  const wrap = document.createElement("div");
  wrap.className = "svc-media";
  wrap.style.setProperty("--svc-base", svc.base);
  wrap.style.setProperty("--svc-tip", svc.tip);
  wrap.innerHTML = `<div class="svc-media-fallback">${markSvg(gradId, svc.base, svc.tip)}</div>`;
  const img = new Image();
  img.alt = "";
  img.loading = eager ? "eager" : "lazy";
  img.addEventListener("error", () => img.remove());
  img.src = src;
  wrap.append(img);
  return wrap;
}

/* ---------- статичный текст страницы (шапка, метатеги, диалог) ---------- */

function applyStaticText() {
  const s = t();
  document.documentElement.lang = s.htmlLang;
  $("pageTitle").textContent = s.title;
  $("metaDescription").setAttribute("content", s.description);
  $("ogLocale").setAttribute("content", s.ogLocale);
  $("ogTitle").setAttribute("content", s.title);
  $("ogDescription").setAttribute("content", s.description);
  $("twitterTitle").setAttribute("content", s.title);
  $("twitterDescription").setAttribute("content", s.description);
  $("heroTitle").textContent = s.heroTitle;
  $("heroText").textContent = s.heroText;
  $("svcClose").textContent = s.close;
  $("svcGo").textContent = s.go;
  const themeBtn = $("themeBtn");
  themeBtn.title = s.themeToggle;
  themeBtn.setAttribute("aria-label", s.themeToggle);
  const langBtn = $("langBtn");
  langBtn.textContent = s.langLabel;
  langBtn.title = s.langToggle;
  langBtn.setAttribute("aria-label", s.langToggle);
}

/* ---------- карточки ---------- */

const grid = $("cards");

function renderCards() {
  grid.innerHTML = "";
  SERVICES.forEach((svc, i) => {
    const text = svcText(svc);
    // <a href> с настоящим URL, не <button> — раньше это была кнопка без href
    // вовсе, а единственная реальная ссылка на сервис (#svcGo в модалке)
    // получала href только через JS ПОСЛЕ клика по карточке. Итог: краулер,
    // который не эмулирует клик (в первую очередь Яндекс), не видел на
    // главной вообще ни одной исходящей ссылки на сервисы — ни на Puzzle, ни
    // на остальные (см. план «SEO»). preventDefault в клике сохраняет
    // прежнее поведение для настоящих пользователей (открывается модалка, не
    // сразу переход), а сам факт <a href> даёт: 1) ссылку, которую видит
    // краулер без интерпретации кликов, 2) открытие в новой вкладке средней
    // кнопкой/Ctrl+клик, 3) «Копировать ссылку» из контекстного меню — ничего
    // из этого раньше не работало на <button>. .svc-card начинается с
    // all:unset (см. styles.css) — переключение button→a ничего не меняет
    // визуально.
    const card = document.createElement("a");
    card.href = svc.href;
    card.className = "svc-card";
    card.style.setProperty("--svc-tip", svc.tip);
    card.setAttribute("aria-haspopup", "dialog");
    card.title = text.name;
    card.append(mediaEl(svc, "cardFlame" + i, svc.shots[0]));
    const body = document.createElement("div");
    body.className = "svc-body";
    body.innerHTML = `
      <div class="row">
        ${markSvg("cardMark" + i, svc.base, svc.tip)}
        <h2>${text.name}</h2>
        <svg class="icon arrow" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
      </div>
      <p class="teaser">${text.teaser}</p>`;
    card.append(body);
    card.addEventListener("click", e => { e.preventDefault(); openDialog(svc, i); });
    grid.append(card);
  });
}

/* ---------- модалка ---------- */

const scrim = $("svcScrim");
const dlgMedia = $("svcMedia");
const dlgThumbs = $("svcThumbs");
let lastFocused = null;

function openDialog(svc, i) {
  const text = svcText(svc);
  dlgMedia.innerHTML = "";
  dlgMedia.append(mediaEl(svc, "dlgFlame" + i, svc.shots[0], true));

  dlgThumbs.innerHTML = "";
  svc.shots.forEach((src, j) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "svc-thumb" + (j === 0 ? " active" : "");
    b.setAttribute("aria-label", t().screenshot(j + 1));
    const img = new Image();
    img.alt = "";
    img.loading = "eager";
    img.addEventListener("error", () => b.remove());
    img.src = src;
    b.append(img);
    b.addEventListener("click", () => {
      dlgMedia.innerHTML = "";
      dlgMedia.append(mediaEl(svc, "dlgFlame" + i + "-" + j, src, true));
      dlgThumbs.querySelectorAll(".svc-thumb").forEach(el => el.classList.remove("active"));
      b.classList.add("active");
    });
    dlgThumbs.append(b);
  });

  $("svcMarkWrap").innerHTML = markSvg("dlgTitleMark" + i, svc.base, svc.tip);
  $("svcTitle").textContent = text.name;
  $("svcDesc").textContent = text.desc;
  $("svcGo").href = svc.href;
  lastFocused = document.activeElement;
  scrim.classList.add("show");
  document.body.classList.add("scroll-lock");
  $("svcClose").focus();
}
function closeDialog() {
  scrim.classList.remove("show");
  document.body.classList.remove("scroll-lock");
  if (lastFocused) lastFocused.focus();
}

scrim.addEventListener("click", e => { if (e.target === scrim) closeDialog(); });
$("svcClose").addEventListener("click", closeDialog);
document.addEventListener("keydown", e => { if (e.key === "Escape" && scrim.classList.contains("show")) closeDialog(); });

/* ---------- переключатель языка ---------- */

$("langBtn").addEventListener("click", () => {
  lang = lang === "ru" ? "en" : "ru";
  localStorage.setItem(LANG_KEY, lang);
  closeDialog();
  applyStaticText();
  renderCards();
});

applyStaticText();
renderCards();
