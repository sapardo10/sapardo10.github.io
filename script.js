/* =============================================================================
   Sergio Pardo — Portfolio shared scripts
   Vanilla JS, no build step. Included by every page.

   ---------------------------------------------------------------------------
   SHARED NAV / FOOTER CONTRACT (read this if you build a sub-page)
   ---------------------------------------------------------------------------
   Any page that wants the shared chrome must include:

     <div id="site-nav"></div>          <!-- near the top of <body>      -->
     ...page content...
     <div id="site-footer"></div>       <!-- just before </body>         -->
     <script src="script.js"></script>  <!-- root pages                  -->
     <script src="../script.js"></script><!-- one-level-deep sub-pages    -->

   Depth handling: the injector auto-detects whether the page lives in a
   subfolder (apps/, support/, privacy/) by inspecting location.pathname.
   - Root page  -> internal links resolve as  index.html#apps
   - Sub-page   -> internal links resolve as  ../index.html#apps
   You can also force a root prefix explicitly by setting
   `data-root="../"` (or "") on the <div id="site-nav"> element.

   The injected nav + footer contain `.lang` elements (data-es / data-en),
   so the saved language is RE-APPLIED after injection. Injected `.app-card`s
   and any `.reveal` element are picked up by the IntersectionObserver too.
   ============================================================================= */

/* ----------------------------- i18n ----------------------------- */
function detectLanguage() {
    const saved = localStorage.getItem('currentLang');
    if (saved) return saved;
    const browserLang = navigator.language || navigator.userLanguage || 'es';
    const lang = browserLang.startsWith('en') ? 'en' : 'es';
    localStorage.setItem('currentLang', lang);
    return lang;
}

function updateLanguage(lang) {
    document.querySelectorAll('.lang').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text === null) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === lang);
    });
    document.documentElement.lang = lang;
}

function setLanguage(lang) {
    localStorage.setItem('currentLang', lang);
    updateLanguage(lang);
}

/* --------------------- depth / path resolution ------------------ */
function computeRootPrefix() {
    // Explicit override wins.
    const navEl = document.getElementById('site-nav');
    if (navEl && navEl.dataset.root !== undefined) return navEl.dataset.root;

    // Detect known sub-folders in the path.
    const path = location.pathname.replace(/\/+$/, '');
    const subfolders = ['/apps/', '/support/', '/privacy/'];
    const inSub = subfolders.some(seg => path.includes(seg));
    return inSub ? '../' : '';
}

/* ------------------------- nav / footer ------------------------- */
function navMarkup(root) {
    const home = `${root}index.html`;
    return `
    <nav class="navbar">
        <div class="container">
            <div class="navbar-brand">
                <a href="${home}#inicio" class="logo">Sergio Pardo</a>
                <div class="language-switcher">
                    <button class="lang-btn" type="button" onclick="setLanguage('es')">ES</button>
                    <button class="lang-btn" type="button" onclick="setLanguage('en')">EN</button>
                </div>
            </div>
            <ul class="nav-menu">
                <li><a href="${home}#inicio" class="lang" data-es="Inicio" data-en="Home">Inicio</a></li>
                <li><a href="${home}#apps" class="lang" data-es="Mis Apps" data-en="My Apps">Mis Apps</a></li>
                <li><a href="${home}#cafe" class="lang" data-es="Apoyar" data-en="Support">Apoyar</a></li>
                <li><a href="${home}#contacto" class="lang" data-es="Contacto" data-en="Contact">Contacto</a></li>
            </ul>
        </div>
    </nav>`;
}

function footerMarkup() {
    return `
    <footer class="footer">
        <div class="container footer-inner">
            <p>&copy; 2026 Sergio Pardo. <span class="lang" data-es="Todos los derechos reservados." data-en="All rights reserved."></span></p>
            <p class="footer-muted">
                <span class="lang" data-es="Desarrollador de aplicaciones Android y Flutter" data-en="Android & Flutter App Developer"></span>
            </p>
            <p><a href="#" class="back-to-top lang" data-es="Volver arriba ↑" data-en="Back to top ↑"></a></p>
        </div>
    </footer>`;
}

function injectChrome() {
    const root = computeRootPrefix();
    const navSlot = document.getElementById('site-nav');
    const footerSlot = document.getElementById('site-footer');
    if (navSlot) navSlot.innerHTML = navMarkup(root);
    if (footerSlot) footerSlot.innerHTML = footerMarkup();
}

/* ------------------------- behaviors --------------------------- */
function wireBackToTop() {
    document.querySelectorAll('.back-to-top').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function wireSmoothScroll() {
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const hash = href.includes('#') ? '#' + href.split('#')[1] : '';
            if (!hash || hash === '#') return;
            const target = document.querySelector(hash);
            // Only intercept if the target lives on THIS page.
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function wireNavbarShadow() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle('is-scrolled', window.pageYOffset > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* Scroll-reveal — works on existing AND injected elements. */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

function observeReveals() {
    const selector = '.reveal, .app-card, .coming-soon-card, .feature-item, .support-card, .contact-section, .coffee-section';
    document.querySelectorAll(selector).forEach(el => {
        if (el.dataset.revealBound) return;
        el.dataset.revealBound = '1';
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

/* ----------------------------- init ----------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    injectChrome();          // 1. inject nav/footer (adds .lang elements)
    wireSmoothScroll();      // 2. wire anchors (includes injected nav links)
    wireBackToTop();
    wireNavbarShadow();
    observeReveals();        // 3. animate cards/sections incl. injected ones
    updateLanguage(detectLanguage()); // 4. re-apply saved language LAST
});
