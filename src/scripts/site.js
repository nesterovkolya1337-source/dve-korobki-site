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
      event.preventDefault();
      const endpoint = form.getAttribute('action')?.trim();
      const status = form.querySelector('[data-form-status]');
      const button = form.querySelector('button[type="submit"]');
      const source = form.querySelector('[data-form-source]');
      const buttonLabel = button?.textContent;

      const setStatus = (message, state = '') => {
        if (!status) return;
        status.textContent = message;
        if (state) status.dataset.state = state;
        else delete status.dataset.state;
      };

      if (!endpoint) {
        const message = 'Preview: форма собрана, но endpoint ещё не подключён.';
        setStatus(message, 'error');
        showToast(message);
        return;
      }

      if (source) source.value = window.location.href;
      if (button) button.disabled = true;
      if (button) button.textContent = 'Отправляем…';
      form.setAttribute('aria-busy', 'true');
      setStatus('Отправляем заявку…', 'pending');

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(endpoint, {
          method: form.method || 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
          signal: controller.signal
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || payload?.success === false) {
          throw new Error(payload?.message || `HTTP ${response.status}`);
        }
        form.reset();
        setStatus('Заявка отправлена. Скоро мы вам перезвоним.', 'success');
        showToast('Заявка отправлена. Скоро мы вам перезвоним.');
      } catch (error) {
        const message = error.name === 'AbortError'
          ? 'Отправка заняла слишком много времени. Позвоните нам.'
          : 'Не удалось отправить заявку. Позвоните нам.';
        setStatus(message, 'error');
        showToast('Ошибка отправки. Позвоните по номеру в шапке.');
      } finally {
        clearTimeout(timeout);
        form.removeAttribute('aria-busy');
        if (button) button.disabled = false;
        if (button && buttonLabel) button.textContent = buttonLabel;
      }
    });
  });
})();
