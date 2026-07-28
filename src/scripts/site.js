(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  const backdrop = document.querySelector('[data-mobile-menu-backdrop]');

  const setMenu = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.hidden = !open;
    if (backdrop) backdrop.hidden = !open;
    document.body.classList.toggle('is-menu-open', open);
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });

    backdrop?.addEventListener('click', () => setMenu(false));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) setMenu(false);
    });
  }

  const toast = document.querySelector('[data-toast]');
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 5000);
  };

  document.querySelectorAll('[data-lead-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      const endpoint = form.getAttribute('action')?.trim();
      const status = form.querySelector('[data-form-status]');

      if (!endpoint) {
        event.preventDefault();
        const message = 'Preview: форма собрана, но endpoint ещё не подключён.';
        if (status) status.textContent = message;
        showToast(message);
        return;
      }

      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      if (status) status.textContent = 'Отправляем…';

      try {
        const response = await fetch(endpoint, {
          method: form.method || 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        form.reset();
        if (status) status.textContent = 'Заявка отправлена.';
        showToast('Заявка отправлена.');
      } catch (error) {
        if (status) status.textContent = 'Не удалось отправить. Позвоните нам.';
        showToast('Ошибка отправки. Позвоните по номеру в шапке.');
      } finally {
        if (button) button.disabled = false;
      }
    });
  });
})();
