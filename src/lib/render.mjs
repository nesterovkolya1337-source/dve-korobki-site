import { escapeHtml, jsonScript, joinUrl, canonicalUrl } from './html.mjs';
import { icon, serviceIconName, symptomMeta } from './icons.mjs';

const esc = escapeHtml;

function sectionTitle(title, kicker = '') {
  return `<div class="section-heading">
    ${kicker ? `<p class="eyebrow">${esc(kicker)}</p>` : ''}
    <h2>${esc(title)}</h2>
    <span class="red-rule" aria-hidden="true"></span>
  </div>`;
}

function logo(ctx, variant = 'compact', tone = 'default') {
  const isInverse = tone === 'inverse';
  const src = variant === 'symbol'
    ? '/brand/logo-symbol.svg'
    : isInverse
      ? '/brand/logo-detailed-compact-dark.webp'
      : '/brand/logo-compact.svg';
  const dimensions = isInverse ? 'width="1072" height="126"' : 'width="430" height="74"';
  return `<img class="brand-logo brand-logo--${variant}" src="${ctx.asset(src)}" alt="Две Коробки — сервис DSG и DCT" ${dimensions}>`;
}

function header(ctx, currentRoute) {
  const nav = ctx.navigation.map(item => {
    const active = currentRoute === item.route || (item.route !== '/' && currentRoute.startsWith(item.route));
    return `<a class="nav-link${active ? ' is-active' : ''}" href="${ctx.link(item.route)}">${esc(item.label)}</a>`;
  }).join('');
  return `<header class="site-header">
    <div class="container header-inner">
      <a class="brand-link" href="${ctx.link('/')}" aria-label="Две Коробки — на главную">${logo(ctx)}</a>
      <nav class="desktop-nav" aria-label="Основная навигация">${nav}</nav>
      <div class="header-contact">
        <a class="header-phone" href="tel:${esc(ctx.business.phoneHref)}">${esc(ctx.business.phoneDisplay)}</a>
        <span>${esc(ctx.business.hours)}</span>
      </div>
      <a class="button button--primary header-cta" href="#lead-form">Записаться</a>
      <button class="menu-button" type="button" aria-label="Открыть меню" aria-expanded="false" data-menu-toggle>
        <span class="menu-icon menu-icon--open">${icon('menu')}</span>
        <span class="menu-icon menu-icon--close">${icon('close')}</span>
      </button>
    </div>
    <div class="mobile-menu-backdrop" data-mobile-menu-backdrop hidden></div>
    <div class="mobile-menu" data-mobile-menu hidden>
      <nav class="container mobile-nav" aria-label="Мобильная навигация">${nav}
        <a class="button button--primary" href="tel:${esc(ctx.business.phoneHref)}">Позвонить</a>
      </nav>
    </div>
  </header>`;
}

function footer(ctx) {
  const serviceLinks = [
    ['/diagnostika-dsg-powershift-dct/', 'Диагностика'],
    ['/remont-mehatronika-dsg-dct/', 'Мехатроник'],
    ['/zamena-stsepleniya-dsg-dct/', 'Сцепление'],
    ['/remont-dvuhmassovyh-mahovikov/', 'Маховики']
  ];
  const gearboxLinks = [
    ['/remont-dsg-dq200/', 'DSG / S-Tronic'],
    ['/remont-powershift-dps6/', 'PowerShift'],
    ['/remont-geely-7dct/', 'Китайские DCT'],
    ['/ceny/', 'Цены']
  ];
  const links = list => list.map(([route, label]) => `<a href="${ctx.link(route)}">${esc(label)}</a>`).join('');
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a href="${ctx.link('/')}">${logo(ctx, 'compact', 'inverse')}</a>
        <p>${esc(ctx.business.tagline)}</p>
        <p class="footer-specialization">${esc(ctx.business.specialization)}</p>
      </div>
      <div class="footer-column"><strong>Услуги</strong>${links(serviceLinks)}</div>
      <div class="footer-column"><strong>Коробки</strong>${links(gearboxLinks)}</div>
      <div class="footer-column">
        <strong>Контакты</strong>
        <span>${ctx.business.cities.map(esc).join('<br>')}</span>
        <a href="tel:${esc(ctx.business.phoneHref)}">${esc(ctx.business.phoneDisplay)}</a>
        <span>${esc(ctx.business.hours)}</span>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} «Две Коробки»</span>
      <span>Ремонт роботизированных коробок передач</span>
    </div>
  </footer>`;
}

function breadcrumbs(page, ctx) {
  if (page.route === '/') return '';
  return `<nav class="breadcrumbs" aria-label="Хлебные крошки">
    <a href="${ctx.link('/')}">Главная</a><span>/</span><span>${esc(page.shortTitle)}</span>
  </nav>`;
}

function homeBrandMedia(ctx) {
  return `<figure class="home-brand-visual" aria-label="Логотип сервиса Две Коробки">
    <img class="brand-hero__logo" src="${ctx.asset('/brand/hero-brand-emblem.webp')}" alt="Две Коробки — ремонт DSG и DCT в Санкт-Петербурге и Москве" width="1108" height="366">
  </figure>`;
}

function media(page, ctx) {
  if (page.route === '/') return homeBrandMedia(ctx);
  if (page.image && !page.image.includes('placeholder')) {
    return `<figure class="hero-media">
      <img src="${ctx.asset(page.image)}" alt="${esc(page.shortTitle)}" width="960" height="640">
    </figure>`;
  }
  return `<figure class="service-hero-visual" aria-label="Фирменная иллюстрация: ${esc(page.shortTitle)}">
    <div class="service-hero-visual__top">
      <span>Две Коробки</span>
      <span>${esc(page.eyebrow || 'Сервис трансмиссий')}</span>
    </div>
    <div class="service-hero-visual__core">
      <span class="service-hero-visual__icon" aria-hidden="true">${icon('gear')}</span>
      <strong>${esc(page.shortTitle)}</strong>
      <small>DSG · S-TRONIC · POWERSHIFT · DCT</small>
    </div>
    <figcaption>Диагностика · Ремонт · Настройка</figcaption>
  </figure>`;
}

function heroHeading(page) {
  if (page.route !== '/') return esc(page.title);
  return `РЕМОНТ DSG,<br>S-TRONIC,<br>POWERSHIFT И<br><span class="hero-title-accent">КИТАЙСКИХ DCT</span>`;
}

function hero(page, ctx) {
  return `<section class="hero${page.route === '/' ? ' hero--home' : ''}">
    <div class="container">
      ${breadcrumbs(page, ctx)}
      <div class="hero-grid">
        <div class="hero-copy">
          ${page.eyebrow ? `<p class="eyebrow">${esc(page.eyebrow)}</p>` : ''}
          <h1>${heroHeading(page)}</h1>
          <p class="hero-lead">${esc(page.lead || page.description)}</p>
          <div class="button-row">
            <a class="button button--primary" href="#lead-form">Записаться на диагностику</a>
            <a class="button button--secondary" href="${ctx.link('/ceny/')}">Рассчитать стоимость</a>
          </div>
        </div>
        <div class="hero-visual">${media(page, ctx)}</div>
      </div>
    </div>
  </section>`;
}

function benefits(items = [], variant = 'default') {
  if (!items.length) return '';
  const icons = variant === 'home'
    ? ['shield', 'award', 'target', 'wrench']
    : ['shield', 'diagnostic', 'clock', 'ruble'];
  return `<section class="benefit-section">
    <div class="container"><div class="benefit-strip${variant === 'home' ? ' benefit-strip--home' : ''}">
      ${items.map((item, index) => `<div class="benefit-item">
        <span class="icon-badge">${icon(icons[index % icons.length])}</span>
        <div><strong>${esc(item.title)}</strong><span>${esc(item.text)}</span></div>
      </div>`).join('')}
    </div></div>
  </section>`;
}

function symptoms(items = [], title = 'Частые признаки неисправности') {
  if (!items.length) return '';
  return `<section class="section">
    <div class="container">
      <div class="dark-panel symptom-panel">
        ${sectionTitle(title)}
        <p class="symptom-intro">Один признак ещё не определяет неисправность. Точную причину показывают диагностика и проверка автомобиля в движении.</p>
        <div class="symptom-grid">
          ${items.map((item, index) => {
            const meta = symptomMeta(item);
            return `<article class="symptom-item">
              <div class="symptom-item__top">
                <span class="symptom-icon">${icon(meta.icon)}</span>
                <span class="symptom-index">${String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3>${esc(item)}</h3>
              <p>${esc(meta.text)}</p>
            </article>`;
          }).join('')}
        </div>
        <div class="symptom-action">
          <div><strong>Заметили один или несколько признаков?</strong><span>Опишите поведение автомобиля — начнём с диагностики.</span></div>
          <a class="button button--light" href="#lead-form">Записаться на диагностику</a>
        </div>
      </div>
    </div>
  </section>`;
}

function serviceCards(items = [], title = 'Что мы делаем') {
  if (!items.length) return '';
  return `<section class="section">
    <div class="container">
      ${sectionTitle(title)}
      <div class="card-grid card-grid--4">
        ${items.map((item, index) => `<article class="service-card">
          <div class="service-card__visual" aria-hidden="true">
            <span>${icon(serviceIconName(item, index))}</span>
          </div>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.text)}</p>
          ${item.route ? `<a class="text-link" href="${ctxPlaceholder(item.route)}">Подробнее ${icon('arrow','inline-icon')}</a>` : ''}
        </article>`).join('')}
      </div>
    </div>
  </section>`;
}

// Replaced by renderServiceCards to keep route links context-aware.
function ctxPlaceholder(route) {
  return route;
}

function renderServiceCards(items, ctx, title = 'Что мы делаем') {
  if (!items?.length) return '';
  return `<section class="section">
    <div class="container">
      ${sectionTitle(title)}
      <div class="card-grid card-grid--4">
        ${items.map((item, index) => `<article class="service-card">
          <div class="service-card__visual" aria-hidden="true">
            <span>${icon(serviceIconName(item, index))}</span>
          </div>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.text)}</p>
          ${item.route ? `<a class="text-link" href="${ctx.link(item.route)}">Подробнее ${icon('arrow','inline-icon')}</a>` : ''}
        </article>`).join('')}
      </div>
    </div>
  </section>`;
}

function pricesBlock(items = []) {
  if (!items.length) return '';
  return `<section class="section">
    <div class="container split-layout">
      <div class="price-panel">
        ${sectionTitle('Стоимость')}
        <div class="price-list">
          ${items.map(item => `<div class="price-row"><span>${esc(item.name)}</span><strong>${esc(item.value)}</strong></div>`).join('')}
        </div>
        <p class="fine-print">* Диапазоны ориентировочные. Финальная стоимость определяется после диагностики.</p>
      </div>
      <div class="process-wrap">${processSteps(['Диагностика','Согласование','Ремонт','Адаптация','Проверка'])}</div>
    </div>
  </section>`;
}

function processSteps(items = []) {
  return `<div class="process">
    ${sectionTitle('Как мы работаем')}
    <ol class="process-list">${items.map((item, index) => `<li><span>${index + 1}</span><strong>${esc(item)}</strong></li>`).join('')}</ol>
  </div>`;
}

function faq(items = []) {
  if (!items.length) return '';
  return `<section class="section">
    <div class="container">
      ${sectionTitle('Вопросы и ответы')}
      <div class="faq-list">
        ${items.map((item, index) => `<details class="faq-item"${index === 0 ? ' open' : ''}>
          <summary>${esc(item.q)}<span>+</span></summary>
          <p>${esc(item.a)}</p>
        </details>`).join('')}
      </div>
    </div>
  </section>`;
}

function formMeta() {
  return `<input type="hidden" name="_subject" value="Новая заявка — Две Коробки">
    <input type="hidden" name="_template" value="table">
    <input type="hidden" name="_url" value="" data-form-source>
    <input class="form-honeypot" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">`;
}

function formConsent() {
  return `<label class="form-consent">
    <input name="Согласие" type="checkbox" value="Да" required>
    <span>Согласен на обработку имени и телефона для обратной связи</span>
  </label>`;
}

function cta(ctx, title = 'Записаться на диагностику') {
  return `<section class="section section--cta" id="lead-form">
    <div class="container">
      <div class="lead-panel">
        <div><h2>${esc(title)}</h2><p>Опишите симптомы — перезвоним и подскажем первый шаг.</p></div>
        <form class="lead-form" data-lead-form action="${esc(ctx.business.formEndpoint || '')}" method="post">
          ${formMeta()}
          <label><span>Ваше имя</span><input name="name" type="text" autocomplete="name" placeholder="Ваше имя"></label>
          <label><span>Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" minlength="7" required placeholder="+7 ___ ___-__-__"></label>
          <button class="button button--primary" type="submit">Отправить заявку</button>
          ${formConsent()}
          <p class="form-status" role="status" data-form-status></p>
        </form>
      </div>
    </div>
  </section>`;
}

function seoText(page) {
  if (!page.seoText) return '';
  return `<section class="section section--compact">
    <div class="container">
      <div class="seo-card">${sectionTitle(`О странице «${page.shortTitle}»`)}<p>${esc(page.seoText)}</p></div>
    </div>
  </section>`;
}

function homeCategories(page, ctx) {
  return `<section class="section">
    <div class="container">
      ${sectionTitle('Виды коробок, которые мы ремонтируем')}
      <div class="card-grid card-grid--4">
        ${page.categories.map(item => `<a class="category-card" href="${ctx.link(item.route)}">
          <h3>${esc(item.title)}</h3><p>${esc(item.text)}</p><span>${icon('arrow','inline-icon')}</span>
        </a>`).join('')}
      </div>
    </div>
  </section>`;
}

function popularPages(ctx) {
  const popular = ctx.pages.filter(p => ['P0','P1'].includes(p.priority) && p.type === 'service').slice(0, 8);
  return `<section class="section">
    <div class="container">${sectionTitle('Популярные страницы')}
      <div class="popular-grid">${popular.map(p => `<a href="${ctx.link(p.route)}"><strong>${esc(p.shortTitle)}</strong>${icon('arrow','inline-icon')}</a>`).join('')}</div>
    </div>
  </section>`;
}

function renderHome(page, ctx) {
  return [
    hero(page, ctx),
    benefits(page.benefits, 'home'),
    homeCategories(page, ctx),
    renderServiceCards(page.services, ctx, 'Наши услуги'),
    symptoms(page.symptoms),
    `<section class="section"><div class="container">${sectionTitle('Почему выбирают «Две Коробки»')}
      <div class="trust-grid">
        ${[
          ['Узкая специализация', 'DSG, S-Tronic, PowerShift, DCT и маховики — не ремонтируем всё подряд.'],
          ['Диагностика до ремонта', 'Объясняем причину и варианты до начала работ.'],
          ['Согласование стоимости', 'Не добавляем операции без подтверждения.'],
          ['Документальная гарантия', 'Условия фиксируются в заказ-наряде.']
        ].map(([t,x])=>`<article>${icon('check')}<div><h3>${t}</h3><p>${x}</p></div></article>`).join('')}
      </div></div></section>`,
    `<section class="section"><div class="container">${processSteps(page.steps)}</div></section>`,
    popularPages(ctx),
    faq(page.faq),
    cta(ctx)
  ].join('');
}

function renderService(page, ctx) {
  return [
    hero(page, ctx),
    benefits(page.benefits),
    symptoms(page.symptoms, `Признаки неисправности: ${page.shortTitle}`),
    renderServiceCards(page.services, ctx, 'Что проверяем и ремонтируем'),
    pricesBlock(page.prices),
    faq(page.faq),
    cta(ctx, `Нужна диагностика ${page.shortTitle}?`),
    seoText(page)
  ].join('');
}

function renderContacts(page, ctx) {
  const cards = ctx.business.cities.map(city => `<article class="contact-card">
    ${icon('pin')}<h3>${esc(city)}</h3>
    <p>${esc(ctx.business.addresses[city] || 'Адрес требуется подтвердить')}</p>
    <a href="tel:${esc(ctx.business.phoneHref)}">${esc(ctx.business.phoneDisplay)}</a>
    <span>${esc(ctx.business.hours)}</span>
  </article>`).join('');
  return `<section class="hero hero--simple"><div class="container">${breadcrumbs(page, ctx)}
      <div class="hero-grid"><div class="hero-copy"><h1>${esc(page.title)}</h1><p class="hero-lead">${esc(page.description)}</p>
      <div class="button-row"><a class="button button--primary" href="tel:${esc(ctx.business.phoneHref)}">Позвонить</a><a class="button button--secondary" href="#lead-form">Записаться</a></div></div>
      <div class="quick-form-card">${sectionTitle('Быстрая запись')}${ctaForm(ctx)}</div></div>
    </div></section>
    <section class="section"><div class="container">${sectionTitle('Адреса и связь')}<div class="contact-grid">${cards}
      <article class="contact-card">${icon('phone')}<h3>Онлайн-заявка</h3><p>Можно прислать фото ошибок и описать симптомы.</p><a href="#lead-form">Оставить заявку</a></article>
    </div></div></section>
    <section class="section"><div class="container split-layout">
      <div class="map-placeholder">${icon('pin')}<strong>Карта появится после подтверждения адресов</strong><p>Для production нужны точные адреса Санкт-Петербурга и Москвы.</p></div>
      <div class="visit-card">${sectionTitle('Перед визитом')}<ul><li>Запишитесь заранее</li><li>Опишите симптомы</li><li>Не стирайте ошибки</li><li>Возьмите прошлые заказ-наряды</li></ul></div>
    </div></section>${cta(ctx)}`;
}

function ctaForm(ctx) {
  return `<form class="stack-form" data-lead-form action="${esc(ctx.business.formEndpoint || '')}" method="post">
    ${formMeta()}
    <input name="name" placeholder="Ваше имя" autocomplete="name">
    <input name="phone" placeholder="Телефон" type="tel" inputmode="tel" autocomplete="tel" minlength="7" required>
    <button class="button button--primary" type="submit">Отправить заявку</button>
    ${formConsent()}
    <p class="form-status" role="status" data-form-status></p>
  </form>`;
}

function renderServices(page, ctx) {
  const groups = [
    ['VAG DSG / S-Tronic', ['/remont-dsg-dq200/','/remont-dsg-dq250/','/remont-dsg-dq500/','/remont-s-tronic-dl501/']],
    ['Ford PowerShift', ['/remont-powershift-dps6/','/remont-powershift-mps6/']],
    ['Китайские и азиатские DCT', ['/remont-geely-7dct/','/remont-chery-getrag-7dct300/','/remont-exeed-borgwarner-7dct/','/remont-magna-pt-7dct/','/remont-omoda-jaecoo-dct/','/remont-hyundai-kia-d7uf1-d7gf1/']],
    ['Отдельные услуги', ['/diagnostika-dsg-powershift-dct/','/remont-mehatronika-dsg-dct/','/zamena-stsepleniya-dsg-dct/','/adaptaciya-dsg-powershift-dct/','/remont-dvuhmassovyh-mahovikov/']]
  ];
  const byRoute = new Map(ctx.pages.map(p => [p.route, p]));
  return `<section class="hero hero--simple"><div class="container">${breadcrumbs(page, ctx)}<div class="hero-copy"><h1>${esc(page.title)}</h1><p class="hero-lead">${esc(page.description)}</p></div></div></section>
    ${groups.map(([name,routes]) => `<section class="section"><div class="container">${sectionTitle(name)}
      <div class="card-grid card-grid--3">${routes.map(route => {
        const p = byRoute.get(route);
        return `<a class="service-index-card" href="${ctx.link(route)}"><span class="icon-badge">${icon(serviceIconName({ title: p.shortTitle, text: p.description, route: p.route }))}</span><h3>${esc(p.shortTitle)}</h3><p>${esc(p.description)}</p><span class="text-link">Открыть ${icon('arrow','inline-icon')}</span></a>`;
      }).join('')}</div></div></section>`).join('')}${cta(ctx)}`;
}

function renderPrices(page, ctx) {
  const servicePages = ctx.pages.filter(p => p.type === 'service' && p.prices?.length);
  return `<section class="hero hero--simple"><div class="container">${breadcrumbs(page, ctx)}<div class="hero-copy"><h1>${esc(page.title)}</h1><p class="hero-lead">${esc(page.description)}</p></div></div></section>
  <section class="section"><div class="container">${sectionTitle('Ориентировочные работы')}
    <div class="price-table">
      ${servicePages.map(p => `<a href="${ctx.link(p.route)}" class="price-table-row"><strong>${esc(p.shortTitle)}</strong><span>${esc(p.prices[0]?.value || 'после диагностики')}</span>${icon('arrow','inline-icon')}</a>`).join('')}
    </div><p class="fine-print">Цены со знаком * требуют подтверждения владельцем бизнеса перед публикацией.</p>
  </div></section>${cta(ctx, 'Нужна точная смета?')}`;
}

function renderAbout(page, ctx) {
  return `<section class="hero hero--simple"><div class="container">${breadcrumbs(page, ctx)}
    <div class="hero-grid"><div class="hero-copy"><h1>${esc(page.title)}</h1><p class="hero-lead">${esc(page.description)}</p><div class="button-row"><a class="button button--primary" href="#lead-form">Записаться</a><a class="button button--secondary" href="${ctx.link('/uslugi/')}">Услуги</a></div></div>
    <div class="hero-media media-placeholder"><div class="workshop-visual">${icon('gear')}</div><small>Реальное фото сервиса требуется до публикации</small></div></div>
  </div></section>
  <section class="section"><div class="container">${sectionTitle('Почему нам доверяют')}
    <div class="trust-grid">${[
      ['Профильная специализация','Роботизированные коробки и связанные узлы.'],
      ['Диагностика до ремонта','Сначала проверка, затем решение.'],
      ['Прозрачное согласование','Работы и стоимость фиксируются заранее.'],
      ['Контроль результата','Проверка и тест после ремонта.']
    ].map(([t,x])=>`<article>${icon('check')}<div><h3>${t}</h3><p>${x}</p></div></article>`).join('')}</div>
  </div></section>
  <section class="section"><div class="container"><div class="dark-panel">${sectionTitle('Наша позиция')}<p class="large-copy">Не меняем дорогие узлы без диагностики и не обещаем универсальный ремонт «всего АКПП». Фокус — DSG, S-Tronic, PowerShift и DCT.</p></div></div></section>
  ${cta(ctx)}`;
}

function schema(page, ctx) {
  const local = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: ctx.business.brand,
    description: page.description,
    telephone: ctx.business.phoneDisplay,
    areaServed: ctx.business.cities,
    openingHours: 'Mo-Su 09:00-21:00',
    url: canonicalUrl(ctx.siteUrl, page.route)
  };
  return `<script type="application/ld+json">${jsonScript(local)}</script>`;
}

export function renderDocument(page, ctx) {
  let body = '';
  if (page.type === 'home') body = renderHome(page, ctx);
  else if (page.type === 'service') body = renderService(page, ctx);
  else if (page.type === 'contacts') body = renderContacts(page, ctx);
  else if (page.type === 'services') body = renderServices(page, ctx);
  else if (page.type === 'prices') body = renderPrices(page, ctx);
  else if (page.type === 'about') body = renderAbout(page, ctx);
  else throw new Error(`Unknown page type: ${page.type}`);

  const canonical = canonicalUrl(ctx.siteUrl, page.route);
  const title = page.route === '/' ? `${page.title} — ${ctx.business.brand}` : `${page.title} — ${ctx.business.brand}`;
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <meta name="theme-color" content="#0E0F12">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(page.description)}">
  ${canonical ? `<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}">` : ''}
  <meta property="og:image" content="${esc(ctx.absoluteAsset('/brand/hero-brand-emblem.webp'))}">
  <link rel="icon" href="${ctx.asset('/brand/favicon.svg')}" type="image/svg+xml">
  <link rel="stylesheet" href="${ctx.versionedAsset('/styles/main.css')}">
  ${schema(page, ctx)}
</head>
<body data-route="${esc(page.route)}">
  <a class="skip-link" href="#main">К содержанию</a>
  ${header(ctx, page.route)}
  <main id="main">${body}</main>
  ${footer(ctx)}
  <div class="toast" data-toast hidden></div>
  <script src="${ctx.versionedAsset('/scripts/site.js')}" defer></script>
</body>
</html>`;
}
