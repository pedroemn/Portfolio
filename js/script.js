(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Mobile nav                                                          */
  /* ------------------------------------------------------------------ */
  const navToggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ------------------------------------------------------------------ */
  /* Active nav link on scroll                                           */
  /* ------------------------------------------------------------------ */
  const sections = document.querySelectorAll("main .section, main .hero");
  const navLinks = document.querySelectorAll("[data-nav]");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ------------------------------------------------------------------ */
  /* Scroll reveal                                                       */
  /* ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll("[data-reveal], .skills-cloud, .code-block");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------ */
  /* Hero typewriter                                                      */
  /* ------------------------------------------------------------------ */
  const typerEl = document.getElementById("heroTyper");
  const phrases = [
    "Desenvolvedor Backend",
    "Estudante de ADS",
    "Sempre aprendendo algo novo",
  ];

  if (typerEl) {
    if (prefersReducedMotion) {
      typerEl.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const current = phrases[phraseIndex];

        if (!deleting) {
          charIndex += 1;
          typerEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1600);
            return;
          }
        } else {
          charIndex -= 1;
          typerEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
        }

        setTimeout(tick, deleting ? 35 : 65);
      };

      tick();
    }
  }

  /* ------------------------------------------------------------------ */
  /* About: count-up stat                                                */
  /* ------------------------------------------------------------------ */
  const countEls = document.querySelectorAll("[data-count]");

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);

        if (prefersReducedMotion) {
          el.textContent = target;
        } else {
          const duration = 900;
          const start = performance.now();

          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(progress * target);
            if (progress < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
        }

        countObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );

  countEls.forEach((el) => countObserver.observe(el));

  /* ------------------------------------------------------------------ */
  /* Project card spotlight                                              */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--y", `${event.clientY - rect.top}px`);
    });
  });

  /* ------------------------------------------------------------------ */
  /* Hero background: binary rain                                        */
  /* ------------------------------------------------------------------ */
  const canvas = document.getElementById("rainCanvas");

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width, height, columns, drops;
    const fontSize = 15;
    const chars = "01";

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = Math.min(window.innerHeight, 900);
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -40);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 7, 12, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i += 1) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.96 ? "#6ab8ff" : "rgba(47, 141, 255, 0.55)";
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.55;
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }
})();
