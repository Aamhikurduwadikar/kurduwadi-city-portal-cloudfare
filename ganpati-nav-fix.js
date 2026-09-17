/* Ganpati 2026 navigation fix */
(function () {
  const href = '/ganpati-2026.html';
  const label = '🙏 गणेशोत्सव २०२६';
  function addGanpatiLinks() {
    document.querySelectorAll('nav a, .nav a, .menu a, header a').forEach(a => {
      if (a.dataset.ganpatiLink === 'true') return;
      const text = (a.textContent || '').trim();
      if (text.includes('गणेशोत्सव २०२६')) a.dataset.ganpatiLink = 'true';
    });
    const navs = document.querySelectorAll('nav, .nav, .menu, header');
    navs.forEach(nav => {
      if (nav.querySelector('[data-ganpati-nav]')) return;
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      a.setAttribute('data-ganpati-nav', 'true');
      a.style.cursor = 'pointer';
      nav.appendChild(a);
    });
    document.querySelectorAll('a').forEach(a => {
      const t = (a.textContent || '').trim();
      if (t.includes('गणपतीचा फोटो/व्हिडिओ पाठवा')) {
        a.href = '/gallery-submit.html?category=ganpati-2026';
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addGanpatiLinks);
  else addGanpatiLinks();
})();
