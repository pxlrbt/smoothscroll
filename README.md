# Smoothscroll

Simple vanilla js library to smoothly scroll to anchors.

## Installation

```bash
npm install @pxlrbt/smoothscroll
```

## Usage

```js
import Smoothscroll from '@pxlrbt/smoothscroll';
new Smoothscroll({
    speed: 400,
    elementSelector: 'a[href*="#"]',
    useHash: true,
    threshold: function () {
        return document.querySelector('header').offsetHeight;
    }
});
```

```html
<a href="#section">Scroll to section</a>
...
<section id="section">...</section>
````
