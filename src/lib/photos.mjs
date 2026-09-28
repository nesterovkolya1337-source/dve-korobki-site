// Original owner-supplied photographs. Presentation crops never alter source bytes.
const photos = {
  measurement: {
    src: '/images/team/gearbox-measurement.jpg', width: 960, height: 1280,
    alt: 'Мастер измеряет узел коробки передач индикатором на рабочем столе',
    caption: 'Проверка узлов коробки', position: '50% 82%'
  },
  clutch: {
    src: '/images/team/double-clutch.jpg', width: 960, height: 1280,
    alt: 'Двойное сцепление в упаковке, крупный план',
    caption: 'Двойное сцепление', position: '50% 50%'
  },
  workshop: {
    src: '/images/team/workshop.jpg', width: 1280, height: 577,
    alt: 'Автомобили на подъёмниках в мастерской команды',
    caption: 'Автомобили в работе', position: '50% 50%'
  },
  mechatronic: {
    src: '/images/team/mechatronic.jpg', width: 592, height: 1280,
    alt: 'Мехатроник с разъёмами и металлической крышкой на светлом фоне',
    caption: 'Мехатроник крупным планом', screenshot: true
  }
};

const servicePhotos = {
  '/diagnostika-dsg-powershift-dct/': 'measurement',
  '/zamena-stsepleniya-dsg-dct/': 'clutch',
  '/remont-mehatronika-dsg-dct/': 'mechatronic'
};

export function servicePhotoKey(route) { return servicePhotos[route]; }

export function photo(key, ctx, { variant = '', eager = false, caption = true } = {}) {
  const item = photos[key];
  if (!item) return '';
  return `<figure class="real-photo real-photo--${key}${variant ? ` real-photo--${variant}` : ''}">
    <div class="real-photo__frame${item.screenshot ? ' real-photo__frame--screenshot' : ''}">
      <img src="${ctx.asset(item.src)}" alt="${item.alt}" width="${item.width}" height="${item.height}"
        loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}
        ${item.position ? `style="object-position:${item.position}"` : ''}>
    </div>
    ${caption ? `<figcaption>${item.caption}</figcaption>` : ''}
  </figure>`;
}

export function teamGallery(ctx) {
  return `<section class="section team-gallery" aria-labelledby="team-gallery-title">
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">Коробки, детали, работа</p>
        <h2 id="team-gallery-title">Из практики нашей команды</h2>
        <span class="red-rule" aria-hidden="true"></span>
      </div>
      <div class="team-gallery__grid">
        ${photo('measurement', ctx, { variant: 'portrait' })}
        <div class="team-gallery__details">
          ${photo('workshop', ctx, { variant: 'workshop' })}
          <div class="team-gallery__parts">
            ${photo('clutch', ctx, { variant: 'part' })}
            ${photo('mechatronic', ctx, { variant: 'part' })}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}
