(() => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const activate = (tab, moveFocus = false) => {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (moveFocus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { event.preventDefault(); activate(tabs[target], true); }
    });
  });
  // Carry campaign codes only into the user's editable email draft. No analytics or storage.
  const params = new URLSearchParams(location.search);
  const codes = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
    .map(key => [key, params.get(key)])
    .filter(([, value]) => value && /^[a-z0-9_-]{1,60}$/i.test(value));
  if (codes.length) document.querySelectorAll('[data-contact]').forEach(link => {
    const url = new URL(link.href);
    const body = url.searchParams.get('body') || '';
    url.searchParams.set('body', body + '\n' + codes.map(([key, value]) => key + ': ' + value).join('\n'));
    link.href = url.toString();
  });
})();
