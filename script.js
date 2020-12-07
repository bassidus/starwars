const cardSection = document.querySelector('.cardsection');
const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');
const info = document.querySelector('.info');
const catButtons = document.querySelectorAll('.categories > button');
const pageNumberButtons = document.querySelector('.pagenumbers');
let prevPage, nextPage
let clearInfo = true;


btnNext.addEventListener('click', () => getData(`${nextPage}`, renderCards));
btnPrev.addEventListener('click', () => getData(`${prevPage}`, renderCards));
catButtons[0].disabled = true;
catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const cat = e.target.textContent.toLowerCase();
        getData(`https://swapi.dev/api/${cat}/`, renderCards);
        catButtons.forEach(button => {
            button.classList.remove('current');            
            button.disabled = false;
        });
        e.target.classList.add('current');
        e.target.disabled = true;
    });
});

getData('http://swapi.dev/api/people/', renderCards);

function getData(url, callback) {
    fetch(url).then(r => r.json()).then(data => callback(data)).catch(e => console.log(e));
}

function getActivePage() {
    let a = 0;
    if (prevPage != null || prevPage != undefined)
        a = parseInt(prevPage.slice(prevPage.length - 1));
    return a + 1;
}

function renderCards(data) {
    removeAllChildNodes(cardSection);
    const results = data.results;
    results.forEach(result => cardSection.appendChild(createCard(result)));
    handlePages(data);
}

function createCard(object) {
    const name = object.name != undefined ? object.name : object.title;
    const b = document.createElement('button');
    b.textContent = name;
    b.addEventListener('click', e => getData(object.url, showInfo));
    b.classList.add('card');
    return b;
}

function showInfo(object) {
    if (object.url.includes('people')) {
        renderInfo(getPersonInfo(object));
        getData(object.homeworld, renderExtraInfo);
    } else if (object.url.includes('planets')) {
        renderInfo(getPlanetInfo(object));
    } else if (object.url.includes('species')) {
        renderInfo(getSpeciesInfo(object));
    } else if (object.url.includes('vehicles')) {
        renderInfo(getVehiclesInfo(object));
    } else if (object.url.includes('starships')) {
        renderInfo(getStarshipsInfo(object));
    } else if (object.url.includes('films')) {
        renderInfo(getFilmsInfo(object));
    };
    mobileScroll(650);
}

function renderInfo(information) {
    removeAllChildNodes(info);
    const div = document.createElement('div');
    for (let i = 0; i < information.length; i++) {
        const row = information[i];
        const p = document.createElement('p');
        if (i == 0) p.classList.add('name');
        p.textContent = row;
        div.appendChild(p);
    };
    info.appendChild(div);
}

function renderExtraInfo(obj) {
    let information = getPlanetInfo(obj)
    const div = document.createElement('div');
    for (let i = 0; i < information.length; i++) {
        const row = information[i];
        const p = document.createElement('p');
        if (i == 0) {
            p.classList.add('name');
            p.textContent = 'Homeworld - ' + row;
        } else {
            p.textContent = row;
        } 
        
        div.appendChild(p);
    };
    info.appendChild(div);
}

function handlePages(data) {
    removeAllChildNodes(pageNumberButtons);
    prevPage = data.previous;
    nextPage = data.next;

    btnPrev.disabled = prevPage == null || prevPage == undefined ? true : false;
    btnNext.disabled = nextPage == null || nextPage == undefined ? true : false;
    
    let pages = data.count / 10;
    pages = data.count % 10 === 0 ? pages : ++pages;

    let url = data.next == null || data.next == undefined ? data.previous : data.next;
    if (url == null || url == undefined) return;

    url = url.substring(0, url.length - 1);
    let active = getActivePage();
    for (let i = 1; i <= pages; i++) {
        const b = document.createElement('button');
        b.textContent = i;
        if (i == active)
            b.id = 'active';
        else
            b.addEventListener('click', e => getData(`${url + i}`, renderCards));
        pageNumberButtons.appendChild(b);
    }
    mobileScroll(0);
}

function getPersonInfo(person) {
    return [
        `${person.name}`,
        `Gender: ${capitalize(person.gender)}`,
        `Height: ${person.height} cm`,
        `Weight: ${person.mass} kg`,
        `Skin Color: ${capitalize(person.skin_color)}`,
        `Hair Color: ${capitalize(person.hair_color)}`,
        `Eye Color: ${capitalize(person.eye_color)}`
    ];
}

function getPlanetInfo(planet) {
    return [
        `${planet.name}`,
        `Rotation period: ${capitalize(planet.rotation_period)} hours`,
        `Orbital period: ${formatNum(planet.orbital_period)} days`,
        `Diameter: ${formatNum(planet.diameter)} km`,
        `Climate: ${capitalize(planet.climate)}`,
        `Gravity: ${capitalize(planet.gravity)}`,
        `Population: ${formatNum(planet.population)}`,
        `Terrain: ${capitalize(planet.terrain)}`
    ];
}

function getSpeciesInfo(specie) {
    return [
        `${specie.name}`,
        `Classification: ${capitalize(specie.classification)}`,
        `Language: ${capitalize(specie.language)}`,
        `Designation: ${capitalize(specie.designation)}`,
        `Average Height: ${formatNum(specie.average_height)} cm`,
        `Average Lifespan: ${formatNum(specie.average_lifespan)} years`,
        `Eye Colors: ${capitalize(specie.eye_colors)}`,
        `Hair Colors: ${capitalize(specie.hair_colors)}`,
        `Skin Colors: ${capitalize(specie.skin_colors)}`
    ];
}

function getVehiclesInfo(vehicle) {
    return [
        `${vehicle.name}`,
        `Cargo Capacity: ${formatNum(vehicle.cargo_capacity)} kg`,
        `Consumables: ${capitalize(vehicle.consumables)}`,
        `Cost: ${formatNum(vehicle.cost_in_credits)} credits`,
        `Crew: ${formatNum(vehicle.crew)}`,
        `Length: ${formatNum(vehicle.length)} meters`,
        `Manufacturer: ${capitalize(vehicle.manufacturer)}`,
        `Max Atmosphering Speed: ${formatNum(vehicle.max_atmosphering_speed)}`,
        `Model: ${capitalize(vehicle.model)}`,
        `Passengers: ${formatNum(vehicle.passengers)}`,
        `Vehicle Class: ${capitalize(vehicle.vehicle_class)}`
    ];
}

function getStarshipsInfo(starship) {
    return [
        `${starship.name}`,
        `Cargo Capacity: ${formatNum(starship.cargo_capacity)} kilos`,
        `Consumables: ${capitalize(starship.consumables)}`,
        `Cost In Credits: ${formatNum(starship.cost_in_credits)} credits`,
        `Crew: ${formatNum(starship.crew)} persons`,
        `Hyperdrive Rating: ${capitalize(starship.hyperdrive_rating)}`,
        `Length: ${formatNum(starship.length)} meters`,
        `Manufacturer: ${capitalize(starship.manufacturer)}`,
        `Max Atmosphering Speed: ${capitalize(starship.max_atmosphering_speed)}`,
        `Model: ${capitalize(starship.model)}`,
        `Passengers: ${formatNum(starship.passengers)} persons`,
        `Starship Class: ${capitalize(starship.starship_class)} persons`
    ];
}

function getFilmsInfo(film) {
    return [
        `${film.title}`,
        `${film.opening_crawl}`,
        `Release Date: ${film.release_date}`
    ];
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function capitalize(s) {
    s = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    s = s.toUpperCase() == 'N/A' ? s.toUpperCase() : s;
    return s;
}

function formatNum(num) {
    return Number(num) ? Number(num).toLocaleString( /*'sv-SE'*/ ) : num;
}

function mobileScroll(to) {
    if (window.innerWidth < 900) {
        document.body.scrollTop = to; // For Safari
        document.documentElement.scrollTop = to; // For Chrome, Firefox, IE and Opera
    };
}