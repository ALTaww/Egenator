let collectionsButtons = document.querySelector('.collections-buttons');
collectionsButtons.addEventListener('click', toggleButtons);

showEverything.click();

function toggleButtons(event) {
    let serviceContainer = document.querySelector('.service-container');
    let target = event.target;
    let showEverythingText = 'Показать всё';
    let hideEverythingText = 'Убрать всё';

    if (!serviceContainer) throw new Error('Отсутствует класс service-container');
    if (target.dataset.target === 'everything') {
        toggleEverything();
    } else {
        toggleCollection();
    }

    function toggleEverything() {
        if (target.classList.contains('showed')) {
            for (let service of serviceContainer.children) {
                service.hidden = true;
            }
            target.classList.remove('showed');
            target.parentNode.querySelector('label').innerText = showEverythingText;

            for (let collection of Array.from(collectionsButtons.children).slice(1)) {
                collection.querySelector('input').checked = false;
            }
        } else {
            for (let service of serviceContainer.children) {
                service.hidden = false;
            }
            target.classList.add('showed');
            target.parentNode.querySelector('label').innerText = hideEverythingText;

            for (let collection of Array.from(collectionsButtons.children).slice(1)) {
                collection.querySelector('input').checked = true;
            }
        }
    }

    function toggleCollection() {
        let allServices = serviceContainer.getElementsByClassName(target.dataset.target);
        for (let service of allServices) {
            service.hidden = !service.hidden;
        }
        checkIfEverythingToggled();
    }

    function checkIfEverythingToggled() {
        let i = 0;
        let buttons = Array.from(collectionsButtons.children).slice(1);
        for (let collection of buttons) {
            if (collection.querySelector('input').checked) {
                i++;
            }
        }

        let checkForEverything = collectionsButtons.children[0].querySelector('input');
        if (i === buttons.length) {
            checkForEverything.checked = true;
            checkForEverything.classList.add('showed');
            collectionsButtons.children[0].querySelector('label').innerText = hideEverythingText;

        } else if (i === 0) {
            checkForEverything.checked = false;
            checkForEverything.classList.remove('showed');
            collectionsButtons.children[0].querySelector('label').innerText = showEverythingText;
        }
    }
}


let serviceContainer = document.querySelector('.service-container');
serviceContainer.addEventListener('click', cardEnlargement);
window.addEventListener('resize', normalizeCards);

function normalizeCards() {
    for (let card of serviceContainer.children) {
        if (card.style.width) {
            card.style.width = '';
            if (card.classList.contains('large')) {
                card.style.width = card.getBoundingClientRect().width * 2 + 'px';
            }
        }
    }
}

function cardEnlargement(event) {
    let target = event.target;
    // Разворачивание только при клике на .resize
    if (target.classList.contains('resize')) {
        let card = target.closest('.col');
        let description = card.querySelector('.description');
        let resizeText = card.querySelector('.resize-text');

        if (card.classList.contains('large')) {
            card.classList.remove('large');
            description.hidden = true;

            card.style.width = '';

            let cardTop = card.getBoundingClientRect().top;
            if (0 > cardTop) {
                window.scrollBy(0, cardTop);
            }
            resizeText.innerText = 'Развернуть ->';

        } else {
            card.classList.add('large');
            description.hidden = false;
            let cardWidth = card.getBoundingClientRect().width;
            card.style.width = cardWidth * 2 + 'px';
            resizeText.innerText = '<- Свернуть';
        }
    }
}


let carousel = document.querySelector('#ourTeachers');
document.addEventListener('DOMContentLoaded', changeCarouselHeight);
window.addEventListener('resize', changeCarouselHeight);

function changeCarouselHeight() {
    let carouselHeight = carousel.getBoundingClientRect().height;
    let carouselWidth = carousel.getBoundingClientRect().width;
    let clientHeight = document.documentElement.clientHeight;
    let ratio = carouselHeight / carouselWidth;

    if (clientHeight < carouselHeight) {
        carousel.style.height = clientHeight + 'px';
        carousel.style.width = clientHeight / ratio + 'px';
    } 
    else {
        let containerStyles = getComputedStyle(document.querySelector('main').querySelector('.container'), null)
        let containerWidth = parseInt(containerStyles.getPropertyValue('width'));
        let paddingLeft = parseInt(containerStyles.getPropertyValue('padding-left'));
        containerWidth = containerWidth - paddingLeft *2;

        if (containerWidth >= clientHeight / ratio) {
            carousel.style.height = clientHeight + 'px';
            carousel.style.width = clientHeight / ratio + 'px';

        } else if (containerWidth < carouselWidth) {
            carousel.style.height = containerWidth * ratio + 'px';
            carousel.style.width = containerWidth + 'px';
        }
    }
}

let settings = document.querySelector('.settings');
settings.addEventListener('click', changeSettings);
let currentSorting = settings.querySelector('.standard').classList;
let currentFormat = document.querySelector('.increase').classList;

function changeSettings(event) {
    let target = event.target;

    if (target.closest('.by-name')) {
        changeClasses(target.closest('.by-name'));
        sortByName(target.closest('.by-name').classList);

    } else if (target.closest('.by-level')) {
        changeClasses(target.closest('.by-level'));
        sortByLevel(target.closest('.by-level').classList);

    } else if (target.closest('.increase')) {
        changeClasses(target.closest('.increase'));
        changeSize(target.closest('.increase').classList);

    } else if (target.closest('.standard')) {
        changeClasses(target.closest('.standard'));
        makeStandart(target.closest('.standard').classList);
    }
}

function changeClasses(target) {
    let targetClasses = target.classList;

    if (targetClasses.contains('selected')) {
        if (targetClasses.contains('reversed')) {
            targetClasses.remove('reversed');
        } else {
            targetClasses.add('reversed');
        }
    } else {
        targetClasses.add('selected')
    }

    if (target.closest('.sorting')) {
        if (targetClasses !== currentSorting) currentSorting.remove('selected', 'reversed');
        currentSorting = targetClasses;

    } else if (target.closest('.change-format')) {
        if (targetClasses !== currentFormat) currentFormat.remove('selected', 'reversed');
        currentFormat = targetClasses;
    }
}

function makeStandart(targetClasses) {
    let i = targetClasses.contains('reversed') ? serviceContainer.children.length : 0;
    let services = !i ? serviceContainer.children : Array.from(serviceContainer.children).reverse();

    for (let service of services) {
        service.style.order = i;
        i++;
    }
}


function sortByName(targetClasses) {
    let serviceNames = {};
    for (let service of serviceContainer.children) {
        serviceNames[service.querySelector('.card-title').innerHTML] = service;
    }
    
    let serviceTitles = Object.keys(serviceNames).sort();
    if (targetClasses.contains('reversed')) {
        serviceTitles.reverse();
    }

    for (let [i, service] of Object.entries(serviceTitles)) {
        serviceNames[service].style.order = i;
    }
}


function sortByLevel(targetClasses) {
    let i = 0;
    let isReversed = targetClasses.contains('reversed') ? true : false;
    let services = !isReversed ? serviceContainer.children : Array.from(serviceContainer.children).reverse();
    for (let service of services) {
        let serviceClasses = service.classList;
        if (serviceClasses.contains('base')) {
            if (isReversed) {
                service.style.order = i + 200;
            } else {
                service.style.order = i;
            }

        } else if (serviceClasses.contains('advanced')) {
            service.style.order = i + 100;

        } else if (serviceClasses.contains('max')) {
            if (isReversed) {
                service.style.order = i;
            } else {
                service.style.order = i + 200;
            }
        }

        i++
    }
}


function changeSize(targetClasses) {
    if (targetClasses.contains('reversed')) {
        for (let service of serviceContainer.children) {
            service.style.width = '';
            service.classList.remove('large');
            service.querySelector('.resize').click();
        }

    } else {
        for (let service of serviceContainer.children) {
            service.classList.add('large');
            service.querySelector('.resize').click();
        }
    }
}


// Подсказки
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


let classesBlock = document.querySelector('.classes-going');
let classesHeader = classesBlock.querySelector('.card-header');

classesHeader.addEventListener('click', changeClassesGoing);

function changeClassesGoing(event) {
    let target = event.target;
    if (!target.classList.contains('nav-link')) return;
    if (target.classList.contains('active')) return;

    let oldActive = classesHeader.querySelector('.active');
    oldActive.classList.remove('active');
    classesBlock.querySelector(oldActive.dataset.target).hidden = true;

    target.classList.add('active');
    classesBlock.querySelector(target.dataset.target).hidden = false;
}