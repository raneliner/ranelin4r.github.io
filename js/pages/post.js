(() => {
  if (!document.querySelector('.toc')) return;
  document.querySelectorAll('.toc a').forEach(a => {
    a.setAttribute('data-easing', 'easeOutQuart');
  });

  var toc = new SmoothScroll('[data-easing="easeOutQuart"]', {
    offset: 72,
    speed: 1500,
    speedAsDuration: true,
    easing: 'easeOutCubic'
  });

  const tocLinks = document.querySelectorAll('.toc a');
  if (!tocLinks.length) return;

  const headingMap = new Map();

  tocLinks.forEach(link => {
    const rawHash = link.getAttribute('href');
    if (!rawHash || rawHash === '#') return;

    // 🔥 关键：解码中文 hash
    const id = decodeURIComponent(rawHash.slice(1));
    const heading = document.getElementById(id);

    if (heading) {
      headingMap.set(heading, link);
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // 清空所有 active
        tocLinks.forEach(a => a.classList.remove('active'));
        document
          .querySelectorAll('.toc li.active')
          .forEach(li => li.classList.remove('active'));

        const link = headingMap.get(entry.target);
        if (!link) return;

        // 高亮当前
        link.classList.add('active');

        // 🔥 高亮父级 li（支持多级）
        let li = link.closest('li');
        while (li) {
          li.classList.add('active');
          li = li.parentElement.closest('li');
        }
      });
    },
    {
      rootMargin: '0px 0px -65% 0px', // 触发位置靠上，体验更好
      threshold: 0
    }
  );

  headingMap.forEach((_, heading) => observer.observe(heading));
})();
