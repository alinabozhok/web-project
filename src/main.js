gsap.registerPlugin(TextPlugin)

document.addEventListener('DOMContentLoaded', function() {
    const icons = document.querySelectorAll('.algorithm-icon');
    const invisibleIcons = document.querySelectorAll('.algorithm-icon-invisible');

    icons.forEach(function(icon, index) {
        icon.addEventListener('mouseenter', function() {
            invisibleIcons[index].style.left = '105%';
            invisibleIcons[index].style.opacity = '1';
        });

        invisibleIcons[index].addEventListener('mouseenter', function() {
            invisibleIcons[index].style.left = '105%';
            invisibleIcons[index].style.opacity = '1';
        });

        icon.addEventListener('mouseleave', function() {
            invisibleIcons[index].style.left = '0';
            invisibleIcons[index].style.opacity = '0';
        });

        invisibleIcons[index].addEventListener('mouseleave', function() {
            invisibleIcons[index].style.left = '0';
            invisibleIcons[index].style.opacity = '0';
        });
    });
});

gsap.to('.main-title', {
    duration: 4,
    text: "devs: Bogdan T. Alina B. Stanislav B.",
    delay: 4,
    repeat: -1,
    yoyo: true,
    repeatDelay: 2,
});


