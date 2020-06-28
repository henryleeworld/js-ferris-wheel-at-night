const themeColors = {
    darker: '#252B33',
    dark: '#3A4451',
    cyan: '#5DE2F9',
    pink: '#FF6EA8',
};

const colors = {
    yellow: '#FFEB3B',
    red: '#F44336',
    purple: '#9C27B0',
    green: '#4CAF50',
    blue: '#2196F3',
};

const SPIN_DURATION = 36;

const getCoord = (index, num) => {
    const angPI = index * 360 / num * Math.PI / 180;
    const x = Math.cos(angPI) * 250;
    const y = Math.sin(angPI) * 250 + 250;
    return {
        x,
        y
    };
};

const wheelScene = function() {
    let points = [];
    for (let index = 0; index < 360; index++) {
        points.push(getCoord(index, 360));
    }
    points = [...points.slice(270), ...points.slice(0, 270)];
    const tl = new TimelineMax();
    tl.add('wheel-start');
    tl.add(wheelCartScene(points), 'wheel-start');
    tl.add(wheelLinesScene(), 'wheel-start');
    tl.add(wheelCirclesScene(), '0.8-=wheel-start');
    tl.add(wheelBaseScene(), '0.8-=wheel-start');
    tl.add(spinCartsScene(points), 'wheel-spin');
    tl.add(spinLinesScene(), 'wheel-spin');
    return tl;
};

const wheelCartScene = function(points) {
    const numberOfCarts = 8;
    let colorsCycle = Object.values(colors);
    while (colorsCycle.length < numberOfCarts) {
        colorsCycle = [...colorsCycle, ...colorsCycle];
    }
    const $cart = $('.wheel-cart');
    for (let i = 1; i < numberOfCarts; i++) {
        $cart.clone().insertAfter($cart);
    }
    const mult = 360 / numberOfCarts;
    return TweenMax.staggerTo(
        '.wheel-cart',
        1, {
            opacity: 1,
            transformOrigin: 'center 230px',
            cycle: {
                bezier: function(index) {
                    return {
                        type: 'soft',
                        values: points.slice(0, (index + 1) * mult),
                    };
                },
            },
        },
        0.1
    );
};

const wheelLinesScene = function() {
    const numberOfWheels = 36;
    const $line = $('.wheel-line');
    for (let i = 0; i < numberOfWheels; i++) {
        $line.clone().insertAfter($line);
    }
    return TweenMax.staggerTo(
        '.wheel-line',
        1, {
            opacity: 1,
            transformOrigin: 'center bottom',
            cycle: {
                rotation: function(index) {
                    const angle = index * 360 / numberOfWheels;
                    return `${angle}__cw`;
                },
            },
        },
        0.01
    );
};

const wheelCirclesScene = function() {
    return TweenMax.staggerFrom(
        '.wheel-circle',
        1.5, {
            scale: '0',
            transformOrigin: 'center center',
            ease: Elastic.easeOut.config(0.5, 0.4),
        },
        0.2
    );
};

const wheelBaseScene = function() {
    return TweenMax.from('.wheel-base', 1, {
        scale: '0.3',
        opacity: 0,
        transformOrigin: 'center top',
    });
};

const spinCartsScene = function(points) {
    const tl = new TimelineMax();
    const numberOfCarts = $('.wheel-cart').length;
    const mult = 360 / numberOfCarts;
    tl.add('spin-start');
    $('.wheel-cart').each(function(index) {
        const pointsAdjusted = [
            ...points.slice((index + 1) * mult),
            ...points.slice(0, (index + 1) * mult),
        ];
        tl.to(
            $(this),
            SPIN_DURATION, {
                bezier: {
                    type: 'thru',
                    values: pointsAdjusted,
                },
                ease: Power0.easeNone,
                repeat: -1,
            },
            'spin-start'
        );
    });
    return tl;
};

const spinLinesScene = function() {
    return TweenMax.to('.wheel-line', SPIN_DURATION, {
        rotation: '+=360',
        modifiers: {
            rotation: angle => angle % 360,
        },
        transformOrigin: 'center bottom',
        ease: Power0.easeNone,
        repeat: -1,
    });
};

const buildingScene = function() {
    return TweenMax.from('.building', 3, {
        y: '100%',
    });
};
const windowsScene = function(delay) {
    TweenMax.set('.window', {
        delay,
        opacity: 1
    });
    return TweenMax.staggerFrom(
        '.window',
        0.4, {
            scale: 0,
            ease: Back.easeOut.config(4),
        },
        0.075
    );
};

const moonScene = function() {
    const tl = new TimelineMax();
    tl.from(
        '#moon',
        2, {
            y: 300,
            opacity: 0,
        },
        'moon'
    );
    tl.from(
        '#moon-bg',
        2, {
            attr: {
                cx: 0,
                cy: 0,
            },
        },
        'moon'
    );
    return tl;
};

function createStars() {
    const numOfStars = 100;
    const s = Snap('#svg');
    const {
        x,
        y,
        width,
        height
    } = s.getBBox();
    for (let i = 0; i < numOfStars; i++) {
        const xpos = Math.floor(Math.random() * (width + x));
        const ypos = Math.floor(Math.random() * (height + y));
        const r = Math.floor(Math.random() * 3 + 1);
        const star = Snap().circle(xpos, ypos, r);
        star
            .attr({
                fill: '#B9B075',
                // opacity: 0.6,
            })
            .addClass('no-opacity')
            .addClass('star');
        s.prepend(star);
    }
}

function starsScene() {
    const tl = new TimelineMax();
    tl.to('.star', 0.75, {
        opacity: 0.6
    }, 'star-start');
    $('.star').each(function() {
        tl.to(
            $(this),
            1, {
                opacity: 0,
                yoyo: true,
                repeat: -1,
                delay: Math.random() * 3,
            },
            'star-start'
        );
    });
    return tl;
}

$(document).ready(function() {
    createStars();
    const masterScene = new TimelineMax();
    masterScene.add(windowsScene(1), 'windows');
    masterScene.add(moonScene(), 'windows');
    masterScene.add(starsScene(), 'wheelScene');
    masterScene.add(wheelScene(), 'wheelScene');
});