(() => {
    const photonBase = 'https://photon.komoot.io';
    const form = document.getElementById('postal-search-form');
    const input = document.getElementById('postal-location');
    const locationButton = document.getElementById('postal-geolocate');
    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.getElementById('postal-status');
    const results = document.getElementById('postal-results');

    const copy = {
        searching: ['Buscando el lugar…', 'Looking up the place…'],
        locating: ['Solicitando tu ubicación…', 'Requesting your location…'],
        noResults: ['No encontramos ese lugar. Prueba con una dirección más específica.', 'We could not find that place. Try a more specific address.'],
        noCode: ['No hay un código postal disponible para este lugar en los datos consultados.', 'No postal code is available for this place in the data we checked.'],
        serviceError: ['No se pudo consultar el servicio de ubicaciones. Inténtalo de nuevo más tarde.', 'The location service could not be reached. Please try again later.'],
        geoUnsupported: ['Este navegador no permite compartir la ubicación. Escribe un lugar para buscarlo.', 'This browser cannot share your location. Enter a place to search instead.'],
        geoDenied: ['No se autorizó el acceso a la ubicación. Puedes escribir un lugar para buscarlo.', 'Location access was not allowed. You can enter a place to search instead.'],
        geoUnavailable: ['No pudimos obtener tu ubicación. Inténtalo de nuevo o escribe un lugar.', 'We could not get your location. Try again or enter a place.'],
        postalLabel: ['Código postal', 'Postal code'],
        missingCode: ['No disponible en los datos', 'Not available in the data'],
        locationLabel: ['Ubicación encontrada', 'Location found']
    };

    function currentLanguage() {
        return document.documentElement.lang === 'en' ? 'en' : 'es';
    }

    function langNode(es, en, tagName = 'span', className = 'lang') {
        const node = document.createElement(tagName);
        node.className = className;
        node.dataset.es = es;
        node.dataset.en = en;
        node.textContent = currentLanguage() === 'en' ? en : es;
        return node;
    }

    function setStatus(message, kind = '') {
        status.hidden = !message;
        status.dataset.kind = kind;
        status.replaceChildren();
        if (!message) return;
        status.append(langNode(message[0], message[1]));
    }

    function setBusy(isBusy, message = null) {
        submitButton.disabled = isBusy;
        locationButton.disabled = isBusy;
        setStatus(message, isBusy ? 'loading' : '');
    }

    function getResultLabel(properties) {
        const street = [properties.housenumber, properties.street].filter(Boolean).join(' ');
        const title = street || properties.name || properties.city || properties.state || properties.country || '—';
        const parts = [properties.district, properties.city, properties.county, properties.state, properties.country]
            .filter(Boolean)
            .filter((part, index, all) => part !== title && all.indexOf(part) === index);
        return { title, details: parts.join(', ') };
    }

    function renderFeatures(features) {
        results.replaceChildren();
        if (!features.length) {
            results.hidden = true;
            setStatus(copy.noResults, 'error');
            return;
        }

        features.forEach(feature => {
            const properties = feature.properties || {};
            const { title, details } = getResultLabel(properties);
            const card = document.createElement('article');
            card.className = 'postal-result';

            const description = document.createElement('div');
            const heading = document.createElement('h2');
            heading.textContent = title;
            description.append(heading);
            if (details) {
                const detailLine = document.createElement('p');
                detailLine.textContent = details;
                description.append(detailLine);
            }

            const codeBlock = document.createElement('div');
            codeBlock.className = `postal-result-code${properties.postcode ? '' : ' is-empty'}`;
            codeBlock.append(langNode(copy.postalLabel[0], copy.postalLabel[1]));
            const code = document.createElement('strong');
            code.textContent = properties.postcode || copy.missingCode[currentLanguage()];
            if (!properties.postcode) {
                code.classList.add('lang');
                code.dataset.es = copy.missingCode[0];
                code.dataset.en = copy.missingCode[1];
            }
            codeBlock.append(code);
            card.append(description, codeBlock);
            results.append(card);
        });

        results.hidden = false;
        const hasPostalCode = features.some(feature => feature.properties && feature.properties.postcode);
        setStatus(hasPostalCode ? null : copy.noCode);
        if (typeof updateLanguage === 'function') updateLanguage(currentLanguage());
    }

    async function requestFeatures(url) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
            if (!response.ok) throw new Error(`Location service returned ${response.status}`);
            const data = await response.json();
            return Array.isArray(data.features) ? data.features : [];
        } finally {
            window.clearTimeout(timeout);
        }
    }

    async function searchLocation(query) {
        setBusy(true, copy.searching);
        results.hidden = true;
        const params = new URLSearchParams({ q: query, limit: '5', lang: currentLanguage() });
        try {
            const features = await requestFeatures(`${photonBase}/api?${params}`);
            setBusy(false);
            renderFeatures(features);
        } catch (error) {
            setBusy(false);
            setStatus(copy.serviceError, 'error');
        }
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        const query = input.value.trim();
        if (query.length < 2) {
            input.focus();
            return;
        }
        searchLocation(query);
    });

    locationButton.addEventListener('click', () => {
        if (!navigator.geolocation) {
            setStatus(copy.geoUnsupported, 'error');
            return;
        }

        setBusy(true, copy.locating);
        results.hidden = true;
        navigator.geolocation.getCurrentPosition(async position => {
            const params = new URLSearchParams({
                lat: String(position.coords.latitude),
                lon: String(position.coords.longitude),
                lang: currentLanguage()
            });
            try {
                const features = await requestFeatures(`${photonBase}/reverse?${params}`);
                setBusy(false);
                renderFeatures(features);
            } catch (error) {
                setBusy(false);
                setStatus(copy.serviceError, 'error');
            }
        }, error => {
            setBusy(false);
            const message = error.code === error.PERMISSION_DENIED ? copy.geoDenied : copy.geoUnavailable;
            setStatus(message, 'error');
        }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 });
    });
})();
