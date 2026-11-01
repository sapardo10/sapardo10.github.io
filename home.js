/* Home page: drag the hero stickers with a mouse. Touch keeps scrolling and tapping. */
let topLayer = 5;

document.querySelectorAll('.sticker').forEach(sticker => {
    const offset = { x: 0, y: 0 };
    let start = null;
    let dragged = false;

    sticker.addEventListener('dragstart', e => e.preventDefault());

    sticker.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        start = { x: e.clientX - offset.x, y: e.clientY - offset.y, downX: e.clientX, downY: e.clientY };
        dragged = false;
        sticker.setPointerCapture(e.pointerId);
    });

    sticker.addEventListener('pointermove', e => {
        if (!start) return;
        if (!dragged && Math.hypot(e.clientX - start.downX, e.clientY - start.downY) < 5) return;
        if (!dragged) sticker.style.zIndex = ++topLayer;
        dragged = true;
        sticker.classList.add('is-held');
        offset.x = e.clientX - start.x;
        offset.y = e.clientY - start.y;
        sticker.style.translate = `${offset.x}px ${offset.y}px`;
    });

    const release = () => {
        start = null;
        sticker.classList.remove('is-held');
    };
    sticker.addEventListener('pointerup', release);
    sticker.addEventListener('pointercancel', release);

    // A drag ends on the link, so it must not count as opening it.
    sticker.addEventListener('click', e => {
        if (dragged) e.preventDefault();
        dragged = false;
    });
});
