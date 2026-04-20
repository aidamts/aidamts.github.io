document.getElementById('year').textContent = new Date().getFullYear();

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
      end: '+=140%',
      pin: true,
      scrub: 1,
      anticipatePin: 1
    }
  });

  tl.to(hint, { autoAlpha: 0, duration: 0.1 }, 0)
    .to(bg, { clipPath: 'circle(120% at 50% 50%)', duration: 1 }, 0)
    .to(logo, { scale: 3.2, opacity: 0, duration: 1, ease: 'power2.in', transformOrigin: '50% 50%' }, 0.1)
    .to([name, tagline], { y: -40, opacity: 0, duration: 0.6, ease: 'power2.in', stagger: 0.05 }, 0.15);
}
