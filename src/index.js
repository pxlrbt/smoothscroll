const defaults = {
    speed: 400,
    elementSelector: 'a[href*="#"]',

    useHash: true,
    threshold: function () {
        return document.querySelector('header').offsetHeight;
    }
}

export default class Smoothscroll
{
    /**
     * Smoothly scroll to target
     *
     * @param {Object} options
     * @param {number} options.speed  Animation speed
     * @param {string} options.elementSelector  Selector for elements which Smoothscroll is bound to
     * @param {boolean} options.useHash Whether to scroll to hash on page load
     * @param {number|function} options.threshold Threshold before scroll target
     *
     */
    constructor(options) {
        this.options = Object.assign({}, defaults, options);
        this.scrolling = false;

        this.bindListeners();

        if (this.options.useHash) {
            this.scrollByHash();
        }
    }

    bindListeners() {
        const elements = document.querySelectorAll(this.options.elementSelector);
        elements.forEach(el => el.addEventListener('click', this.handleClick.bind(this)));
    }

    scrollByHash() {
        let hash = window.location.hash.substr(1);
        let target = document.getElementById(hash);

        if (target == null) return;

        this.scrollToElement(target);
    }

    handleClick(e) {
        let href = e.currentTarget.getAttribute('href');

        if (href.indexOf('#') === -1) return;

        let hash = href.substr(href.indexOf('#') + 1);
        let target = document.getElementById(hash);

        // No target found
        if (target === null) return;

        // Target not visible
        if (target.offsetParent === null) return;

        e.preventDefault();
        this.scrollToElement(target);
        this.setHash(hash);
    }

    setHash(hash) {
        history.replaceState(null, null, '#' + hash);
    }

    scrollToElement(target) {
        if (target == null) return;

        this.scrollTarget = target;
        this.scrollStart  = +new Date();
        this.scrollStartPosition = window.scrollY || document.body.scrollTop;
        Smoothscroll.activeScroller = this;

        requestAnimationFrame(this.animateScroll.bind(this));
    }

    animateScroll() {
        if (Smoothscroll.activeScroller != this) return;

        const threshold =  (typeof this.options.threshold === 'function')
                                ? this.options.threshold()
                                : this.options.threshold;


        let currentPosition = window.scrollY || document.body.scrollTop;
        let targetPosition = currentPosition + this.scrollTarget.getBoundingClientRect().top - threshold;

        let progress = 1 - Math.max(0, (this.scrollStart + this.options.speed - new Date()) / this.options.speed)
        let diff = targetPosition - this.scrollStartPosition;
        let position = this.scrollStartPosition + diff * progress;

        window.scrollTo(0, position);

        if (progress < 1) {
            requestAnimationFrame(this.animateScroll.bind(this));
        }
    }
}
