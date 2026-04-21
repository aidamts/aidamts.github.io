document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Creepy CV button: pupils follow cursor ---------- */
(function () {
  const btn = document.getElementById('cvBtn');
  if (!btn) return;
  const eyes = btn.querySelector('.creepy-btn__eyes');
  const pupils = btn.querySelectorAll('.creepy-btn__pupil');

  const update = (e) => {
    const p = e.touches ? e.touches[0] : e;
    const r = eyes.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = p.clientX - cx;
    const dy = p.clientY - cy;
    const angle = Math.atan2(-dy, dx) + Math.PI / 2;
    const dist = Math.hypot(dx, dy);
    const x = Math.sin(angle) * dist / 180;
    const y = Math.cos(angle) * dist / 75;
    const tx = `${-50 + x * 50}%`;
    const ty = `${-50 + y * 50}%`;
    pupils.forEach((p) => { p.style.transform = `translate(${tx}, ${ty})`; });
  };

  window.addEventListener('mousemove', update, { passive: true });
  window.addEventListener('touchmove', update, { passive: true });
})();

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Sticky header styling on scroll ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Scroll reveal via IntersectionObserver ---------- */
const revealTargets = document.querySelectorAll('.reveal, .lang');
if (!prefersReduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('in-view'));
}

/* ---------- Hero scroll animation (GSAP ScrollTrigger) ---------- */
if (!prefersReduced && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const hero = document.getElementById('hero');
  const logo = hero.querySelector('.hero__logo');
  const name = hero.querySelector('.hero__name');
  const tagline = hero.querySelector('.hero__tagline');
  const hint = hero.querySelector('.hero__scroll-hint');
  const bg = hero.querySelector('.hero__bg');

  gsap.set(bg, { clipPath: 'circle(0% at 50% 50%)', opacity: 1 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  tl.to(hint, { autoAlpha: 0, duration: 0.1 }, 0)
    .to(bg, { clipPath: 'circle(130% at 50% 50%)', duration: 1 }, 0)
    .to(logo, { scale: 2.4, opacity: 0, duration: 1, ease: 'power2.in', transformOrigin: '50% 50%' }, 0.1)
    .to([name, tagline], { y: -40, opacity: 0, duration: 0.6, ease: 'power2.in', stagger: 0.05 }, 0.15);
}
