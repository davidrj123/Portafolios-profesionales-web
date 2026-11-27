export function initEntranceAnimations() {
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cards = document.querySelectorAll(".student-card");
  window.gsap.fromTo(".hero-copy", { y: 24, opacity: 0, filter: "blur(8px)" }, {
    y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out"
  });
  window.gsap.fromTo(cards, { y: 48, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1, stagger: .16, ease: "power3.out", delay: .2
  });
}

export function runScreenTransition(onCovered, color = "#080d18") {
  const overlay = document.querySelector(".transition-overlay");
  const word = document.querySelector(".transition-word");
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onCovered();
    return;
  }
  const timeline = window.gsap.timeline();
  timeline.set(overlay, { backgroundColor: color, transformOrigin: "bottom" })
    .to(overlay, { scaleY: 1, duration: .48, ease: "power4.inOut" })
    .to(word, { opacity: 1, duration: .2 }, "-=.12")
    .add(() => onCovered())
    .to(word, { opacity: 0, duration: .18 })
    .to(overlay, { scaleY: 0, transformOrigin: "top", duration: .58, ease: "power4.inOut" });
}