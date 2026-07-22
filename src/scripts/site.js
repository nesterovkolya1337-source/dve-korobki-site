(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.hidden = expanded;
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
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
