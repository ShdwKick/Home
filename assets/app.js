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

/* ---------- сервисы ----------
   base/tip — вершина и уголь пламени сервиса (Design/palette.md), вписаны
   вручную: карточек на странице несколько одновременно, а --flame-* в
   brand.css — переменная одна на документ, всем сразу её не отдать. */

const SERVICES = [
  {
    id: "finance",
    name: "Мои финансы",
    teaser: "Бюджет, счета и общие траты — свои и семейные.",
    desc: "Учёт доходов и расходов, общие бюджеты и цели накоплений. Разбивка по категориям — для одного человека или для всей семьи.",
    href: "https://money.burninghouse.ru",
    base: "#b45309",
    tip: "#ffd447",
    shots: ["assets/Images/Money1.png", "assets/Images/Money2.png", "assets/Images/Money3.png"],
  },
  {
    id: "movies",
    name: "Что смотрим?",
    teaser: "Выбирает фильм на вечер, когда компания не может договориться.",
    desc: "Когда все долго спорят, что посмотреть, сервис сам выбирает случайный фильм из общего списка — быстро и без лишних споров.",
    href: "https://movies.burninghouse.ru",
    base: "#7f1d1d",
    tip: "#ff3d5a",
    shots: ["assets/Images/Movies2.png", "assets/Images/Movies3.png", "assets/Images/Movies4.png"],
  },
  {
    id: "trip",
    name: "Куда поедем?",
    teaser: "Планирование поездки компанией: маршрут, даты, участники.",
    desc: "Планирование поездки на несколько человек: куда, когда и кто едет — всё в одном месте, а не в разрозненной переписке.",
    href: "https://trip.burninghouse.ru",
    base: "#0f766e",
    tip: "#4fe3c1",
    shots: ["assets/Images/Trip3.png", "assets/Images/Trip.png", "assets/Images/Trip4.png"],
  },
];

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
   знаком поверх, а не сломанная картинка. */
function mediaEl(svc, gradId, src) {
  const wrap = document.createElement("div");
  wrap.className = "svc-media";
  wrap.style.setProperty("--svc-base", svc.base);
  wrap.style.setProperty("--svc-tip", svc.tip);
  wrap.innerHTML = `<div class="svc-media-fallback">${markSvg(gradId, svc.base, svc.tip)}</div>`;
  const img = new Image();
  img.alt = "";
  img.loading = "lazy";
  img.addEventListener("error", () => img.remove());
  img.src = src;
  wrap.append(img);
  return wrap;
}

/* ---------- карточки ---------- */

const grid = $("cards");
SERVICES.forEach((svc, i) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "svc-card";
  card.style.setProperty("--svc-tip", svc.tip);
  card.setAttribute("aria-haspopup", "dialog");
  card.append(mediaEl(svc, "cardFlame" + i, svc.shots[0]));
  const body = document.createElement("div");
  body.className = "svc-body";
  body.innerHTML = `
    <div class="row">
      ${markSvg("cardMark" + i, svc.base, svc.tip)}
      <h2>${svc.name}</h2>
      <svg class="icon arrow" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
    </div>
    <p class="teaser">${svc.teaser}</p>`;
  card.append(body);
  card.addEventListener("click", () => openDialog(svc, i));
  grid.append(card);
});

/* ---------- модалка ---------- */

const scrim = $("svcScrim");
const dlgMedia = $("svcMedia");
const dlgThumbs = $("svcThumbs");
let lastFocused = null;

function openDialog(svc, i) {
  dlgMedia.innerHTML = "";
  dlgMedia.append(mediaEl(svc, "dlgFlame" + i, svc.shots[0]));

  dlgThumbs.innerHTML = "";
  svc.shots.forEach((src, j) => {
    const t = document.createElement("button");
    t.type = "button";
    t.className = "svc-thumb" + (j === 0 ? " active" : "");
    t.setAttribute("aria-label", `Скриншот ${j + 1}`);
    const img = new Image();
    img.alt = "";
    img.loading = "lazy";
    img.addEventListener("error", () => t.remove());
    img.src = src;
    t.append(img);
    t.addEventListener("click", () => {
      dlgMedia.innerHTML = "";
      dlgMedia.append(mediaEl(svc, "dlgFlame" + i + "-" + j, src));
      dlgThumbs.querySelectorAll(".svc-thumb").forEach(el => el.classList.remove("active"));
      t.classList.add("active");
    });
    dlgThumbs.append(t);
  });

  $("svcMarkWrap").innerHTML = markSvg("dlgTitleMark" + i, svc.base, svc.tip);
  $("svcTitle").textContent = svc.name;
  $("svcDesc").textContent = svc.desc;
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
