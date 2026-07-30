const common = 'viewBox="0 0 24 24" aria-hidden="true" focusable="false"';

export function icon(name, className = 'icon') {
  const paths = {
    check: '<path d="m5.5 12.5 4 4 9-9"/>',
    shield: '<path d="M12 2.8 19 5.6v5.7c0 4.6-2.7 7.7-7 9.9-4.3-2.2-7-5.3-7-9.9V5.6L12 2.8Z"/><path d="m8.4 12.1 2.3 2.3 4.9-5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2v5.1l3.4 2"/>',
    diagnostic: '<rect x="3.5" y="4.5" width="17" height="12" rx="2"/><path d="M8 20h8m-6.2-3.5L9 20m5.2-3.5.8 3.5M7 11h2.2l1.4-2.5 2.3 5 1.4-2.5H17"/>',
    transmission: '<path d="M5 7.5 8 5h7l4 3v8l-4 3H8l-3-2.5Z"/><circle cx="11" cy="12" r="3"/><path d="M5 10H3v4h2m14-4h2v4h-2M8 5v3m7-3v3M8 16v3m7-3v3"/>',
    mechatronic: '<rect x="6" y="6" width="12" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M9 2v4m3-4v4m3-4v4M9 18v4m3-4v4m3-4v4M2 9h4m-4 3h4m-4 3h4m12-6h4m-4 3h4m-4 3h4"/>',
    clutch: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M12 3.5v3m0 11v3M3.5 12h3m11 0h3M6 6l2.1 2.1m7.8 7.8L18 18m0-12-2.1 2.1m-7.8 7.8L6 18"/>',
    adaptation: '<path d="M4 7h6m4 0h6M4 12h2m4 0h10M4 17h10m4 0h2"/><circle cx="12" cy="7" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="17" r="2"/>',
    flywheel: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.7"/><path d="M12 6.2h.01M17 9.1h.01M17 14.9h.01M12 17.8h.01M7 14.9h.01M7 9.1h.01"/>',
    warning: '<path d="M12 3.2 21 19H3L12 3.2Z"/><path d="M12 8.5v5.2m0 2.8h.01"/>',
    temperature: '<path d="M9.5 14.8V5.5a2.5 2.5 0 0 1 5 0v9.3a4.5 4.5 0 1 1-5 0Z"/><path d="M12 8v8.5m5-10.5h2m-2 4h2"/>',
    vibration: '<path d="M3 9.5h2l1.5-3 3 11 3-11 3 11 1.5-5H21"/><path d="M3 20h18"/>',
    gear: '<g transform="translate(.9 .7)"><path d="m9.3 3-.6 2.1-1.8 1-2.1-.6L3 8.6l1.5 1.6v2.1L3 13.9 4.8 17l2.1-.6 1.8 1 .6 2.1h3.6l.6-2.1 1.8-1 2.1.6 1.8-3.1-1.5-1.6v-2.1l1.5-1.6-1.8-3.1-2.1.6-1.8-1L12.9 3Z"/><circle cx="11.1" cy="11.3" r="3.1"/></g>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-5.8 5.8 3 3 5.8-5.8a4 4 0 0 0 5.4-5.4l-3 3-3-1-1-3 3-3Z"/>',
    phone: '<path d="M7.2 3.5 9.4 8 7 9.7a15.3 15.3 0 0 0 7.3 7.3l1.7-2.4 4.5 2.2-.8 3.1c-.3 1.1-1.4 1.8-2.5 1.6A18 18 0 0 1 2.5 6.8c-.2-1.1.5-2.2 1.6-2.5l3.1-.8Z"/>',
    pin: '<path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/>',
    arrow: '<path d="M4.5 12h15m-5.5-5.5 5.5 5.5-5.5 5.5"/>',
    menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
    close: '<path d="m5.5 5.5 13 13m0-13-13 13"/>',
    ruble: '<path d="M7 20V4.5h6.2a4.2 4.2 0 0 1 0 8.4H7m0 3h8m-8-6h6.2"/>',
    award: '<circle cx="12" cy="9" r="5.2"/><path d="m8.8 13.2-.8 7.3 4-2.2 4 2.2-.8-7.3"/><path d="m10.3 9 1.1 1.1 2.3-2.3"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>'
  };
  const body = paths[name] || paths.gear;
  return `<svg class="${className} icon--${name}" ${common} fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

export function serviceIconName(item = {}, index = 0) {
  const primary = `${item.title || ''} ${item.route || ''}`.toLocaleLowerCase('ru');
  if (/диагност|ошибк/.test(primary)) return 'diagnostic';
  if (/мехатрон|гидроблок|соленоид|плат/.test(primary)) return 'mechatronic';
  if (/сцеплен/.test(primary)) return 'clutch';
  if (/адаптац|настрой|обучен/.test(primary)) return 'adaptation';
  if (/маховик/.test(primary)) return 'flywheel';
  if (/гарант/.test(primary)) return 'shield';
  if (/ремонт|короб|dsg|dct|powershift|s-tronic/.test(primary)) return 'transmission';

  const source = `${primary} ${item.text || ''}`.toLocaleLowerCase('ru');
  if (/мехатрон|гидроблок|соленоид|плат/.test(source)) return 'mechatronic';
  if (/сцеплен/.test(source)) return 'clutch';
  if (/маховик/.test(source)) return 'flywheel';
  if (/диагност|ошибк|провер/.test(source)) return 'diagnostic';
  if (/адаптац|настрой|обучен/.test(source)) return 'adaptation';
  if (/гарант/.test(source)) return 'shield';
  if (/ремонт|короб|dsg|dct|powershift|s-tronic/.test(source)) return 'transmission';
  return ['diagnostic', 'transmission', 'wrench', 'check'][index % 4];
}

export function symptomMeta(value = '') {
  const source = String(value).toLocaleLowerCase('ru');

  if (/провер.*покуп/.test(source)) {
    return { icon: 'diagnostic', text: 'Проверяем ошибки, параметры и поведение коробки до покупки автомобиля.' };
  }
  if (/перегрев/.test(source)) {
    return { icon: 'temperature', text: 'Предупреждение появляется на панели или работа коробки меняется после прогрева.' };
  }
  if (/давлен/.test(source)) {
    return { icon: 'mechatronic', text: 'Проверяем параметры гидравлики и работу мехатроника под нагрузкой.' };
  }
  if (/нет связи|tcm|мехатрон/.test(source)) {
    return { icon: 'mechatronic', text: 'Считываем коды и проверяем электронный блок управления и его цепи.' };
  }
  if (/пропада|не включ|задерж/.test(source)) {
    return { icon: 'clock', text: 'Передача включается не сразу или временно становится недоступна.' };
  }
  if (/сброс|адаптац|после ремонт|после мехатрон/.test(source)) {
    return { icon: 'adaptation', text: 'После вмешательства проверяем базовые установки и качество переключений.' };
  }
  if (/аварийн|ошибк|панел/.test(source)) {
    return { icon: 'warning', text: 'Коробка сообщает об ошибке или ограничивает доступные режимы работы.' };
  }
  if (/пробуксов/.test(source)) {
    return { icon: 'clutch', text: 'Обороты растут быстрее скорости автомобиля, особенно при разгоне.' };
  }
  if (/вибрац|дребезг|стук|шум/.test(source)) {
    return { icon: 'vibration', text: 'Появляются вибрации или посторонние звуки со стороны трансмиссии.' };
  }
  if (/замена сцеплен/.test(source)) {
    return { icon: 'clutch', text: 'После установки сцепления требуется проверка и корректное обучение.' };
  }
  if (/износ/.test(source)) {
    return { icon: 'gear', text: 'Источник и степень износа определяем после проверки конкретного узла.' };
  }
  if (/рывк|пинк|толч|удар|неровн/.test(source)) {
    return { icon: 'transmission', text: 'Толчки ощущаются при старте, разгоне или смене передач.' };
  }

  return { icon: 'diagnostic', text: 'Причину признака уточняем по результатам диагностики и тестовой поездки.' };
}
