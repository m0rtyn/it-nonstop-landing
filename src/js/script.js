const root = document.documentElement;
const welcomeScreen = document.getElementById('welcome-screen');
const rectangles = [...welcomeScreen.querySelectorAll('.rectangle')];
const positionData = [ -800, -1300, -1800, -1200, -500, -700, -1500, -700 ];
const maxDistance = 0.5;
const header = document.querySelector('header');
let rootHeight = root.clientHeight;
let ticking = false;

window.addEventListener('scroll', (e) => {

    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            const distance = scrollTop / rootHeight;
            if ( distance < maxDistance) {
                welcomeScreen.style.cssText = `
                    transform: translate3d(0, ${scrollTop}px, 0)
                `;
            } 
            
            header.style.cssText = `opacity: ${distance >= 1.1 ? 1 : 0}`
            

            rectangles.forEach( (rectangle, index) => {
                rectangle.style.cssText = `
                    transform: translate3d(0, ${positionData[index]*distance*maxDistance}px, 0)
                `;
            })

            ticking = false;
        })

        ticking = true;
    }
})

window.addEventListener('orientationchange', (e) => {
    rootHeight = root.clientHeight;
})