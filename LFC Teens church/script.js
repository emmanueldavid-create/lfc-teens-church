// script.js - slideshow, navbar scroll and flipbook initializer

document.addEventListener('DOMContentLoaded', function () {
    // SLIDESHOW
    (function initSlideshow() {
        const slides = document.querySelectorAll('.slide');
        if (!slides.length) return;
        let idx = 0;
        function show(i) {
            slides.forEach((s, n) => s.classList.toggle('active', n === i));
        }
        show(0);
        setInterval(() => {
            idx = (idx + 1) % slides.length;
            show(idx);
        }, 5000);
    })();

    // NAVBAR scroll transparency -> solid
    (function initNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        function update() {
            if (window.scrollY > 60) navbar.classList.add('solid');
            else navbar.classList.remove('solid');
        }
        update();
        window.addEventListener('scroll', update);
    })();

    // FLIPBOOK initializer (runs on book pages)
    (function initFlipbook() {
        if (typeof window.BOOK_PAGES === 'undefined') return;
        const pages = Array.isArray(window.BOOK_PAGES) ? window.BOOK_PAGES : [];
        const imgEl = document.getElementById('flipbook-image');
        const prevBtn = document.querySelector('.page-btn.prev');
        const nextBtn = document.querySelector('.page-btn.next');
        const pageIndicator = document.getElementById('pageIndicator');
        const noImages = document.getElementById('noImages');
        const downloadFallback = document.getElementById('downloadFallback');

        // no images configured -> show fallback download
        if (!pages.length) {
            if (noImages) noImages.style.display = 'block';
            if (downloadFallback) downloadFallback.style.display = 'inline-block';
            if (imgEl) imgEl.style.display = 'none';
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (pageIndicator) pageIndicator.textContent = '—';
            return;
        }

        // safe preload + render
        let current = 0;
        function render() {
            if (!imgEl) return;
            imgEl.src = pages[current];
            pageIndicator.textContent = `${current + 1} / ${pages.length}`;
        }

        // Try to preload first image (handle error)
        const tmp = new Image();
        tmp.onload = function () {
            render();
            // preload rest silently
            for (let i = 0; i < pages.length; i++) {
                const p = new Image();
                p.src = pages[i];
            }
        };
        tmp.onerror = function () {
            // fallback: if first image fails, show download
            if (noImages) noImages.style.display = 'block';
            if (downloadFallback) downloadFallback.style.display = 'inline-block';
            if (imgEl) imgEl.style.display = 'none';
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (pageIndicator) pageIndicator.textContent = '—';
        };
        tmp.src = pages[0];

        function go(delta) {
            current = (current + delta + pages.length) % pages.length;
            render();
        }
        if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => go(1));
        // keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') go(-1);
            if (e.key === 'ArrowRight') go(1);
        });
    })();
});
