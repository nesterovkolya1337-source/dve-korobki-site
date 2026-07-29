const common = 'viewBox="0 0 24 24" aria-hidden="true" focusable="false"';

export function icon(name, className = 'icon') {
  const paths = {
    check: '<path d="m5 12 4 4L19 6"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.1 7.4 7.5 9.5 4.4-2.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
    diagnostic: '<path d="M4 6h16v10H4z"/><path d="M8 20h8M9 16l-1 4m7-4 1 4"/><path d="M7 11h2l1-2 2 5 1.5-3H17"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.6a7 7 0 0 0-.7-1.7l1-1.8-2.1-2.1-1.8 1a7 7 0 0 0-1.7-.7L11 2h-3l-.6 2a7 7 0 0 0-1.7.7l-1.8-1-2.1 2.1 1 1.8a7 7 0 0 0-.7 1.7L0 10v3l2 .6a7 7 0 0 0 .7 1.7l-1 1.8 2.1 2.1 1.8-1a7 7 0 0 0 1.7.7L8 21h3l.6-2a7 7 0 0 0 1.7-.7l1.8 1 2.1-2.1-1-1.8a7 7 0 0 0 .7-1.7L19 13.5Z" transform="translate(2 1) scale(.9)"/>',
    wrench: '<path d="M14.5 6.2a5 5 0 0 0-6.7 6.7L3 17.7 6.3 21l4.8-4.8a5 5 0 0 0 6.7-6.7l-3.1 3.1-3.3-.8-.8-3.3 3-3.1Z"/>',
    phone: '<path d="M6.8 3.5 9 8l-2 1.5c1.5 3.1 3.8 5.4 7 7l1.5-2 4.5 2.2-.8 3.3c-.3 1.1-1.4 1.8-2.6 1.6C9.2 20.3 3.7 14.8 2.4 7.4 2.2 6.2 2.9 5.1 4 4.8l2.8-.8Z"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    ruble: '<path d="M7 19V5h6a4 4 0 0 1 0 8H7m0 3h8m-8-6h7"/>',
    award: '<circle cx="12" cy="9" r="5"/><path d="m9 14-1 7 4-2 4 2-1-7"/><circle cx="12" cy="9" r="2"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>'
  };
  const body = paths[name] || paths.gear;
  return `<svg class="${className}" ${common} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}
