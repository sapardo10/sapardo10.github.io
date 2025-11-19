const translations = {
    es: {
        'nav.home': 'Inicio',
        'nav.apps': 'Mis Apps',
        'nav.contact': 'Contacto',
        'hero.hello': 'Hola, soy',
        'hero.subtitle': 'Desarrollador de aplicaciones móviles Android y Flutter',
        'hero.description': 'Creo aplicaciones innovadoras y funcionales que mejoran la vida de millones de usuarios en Google Play Store.',
        'hero.cta': 'Explorar mis aplicaciones',
        'apps.title': 'Mis Aplicaciones',
        'apps.subtitle': 'Aplicaciones disponibles en Google Play Store',
        'apps.pausactive.description': 'Pausactive - Healthy breaks es una aplicación diseñada para recordarte tomar descansos saludables durante tu jornada.',
        'apps.pingpartner.description': 'PingPartner te ayuda a monitorizar la conexión a internet y realizar pruebas de velocidad de forma rápida y sencilla.',
        'apps.triplist.description': 'TripList es tu compañero perfecto para planificar, organizar y disfrutar de tus viajes con listas de empaque inteligentes.',
        'apps.tags.health': 'Salud',
        'apps.tags.productivity': 'Productividad',
        'apps.tags.utilities': 'Utilidades',
        'apps.tags.network': 'Red',
        'apps.tags.travel': 'Viajes',
        'apps.tags.organizer': 'Organizador',
        'apps.link': 'Ver en Play Store',
        'contact.title': 'Ponte en Contacto',
        'contact.subtitle': '¿Tienes alguna pregunta? Me encantaría saber de ti',
        'contact.form.name': 'Nombre',
        'contact.form.email': 'Email',
        'contact.form.message': 'Mensaje',
        'contact.form.submit': 'Enviar Mensaje',
        'contact.success': 'Mensaje enviado correctamente! Te responderé pronto.',
        'contact.error': 'Hubo un error al enviar el mensaje. Intenta de nuevo.',
        'footer.rights': 'Todos los derechos reservados.',
        'footer.developer': 'Desarrollador de aplicaciones Android',
        'footer.top': 'Volver arriba',
    },
    en: {
        'nav.home': 'Home',
        'nav.apps': 'My Apps',
        'nav.contact': 'Contact',
        'hero.hello': 'Hi, I am',
        'hero.subtitle': 'Android and Flutter Mobile App Developer',
        'hero.description': 'I create innovative and functional applications that improve the lives of millions of users on Google Play Store.',
        'hero.cta': 'Explore my applications',
        'apps.title': 'My Applications',
        'apps.subtitle': 'Applications available on Google Play Store',
        'apps.pausactive.description': 'Pausactive - Healthy breaks is an application designed to remind you to take healthy breaks during your workday.',
        'apps.pingpartner.description': 'PingPartner helps you monitor your internet connection and perform speed tests quickly and easily.',
        'apps.triplist.description': 'TripList is your perfect companion for planning, organizing and enjoying your trips with smart packing lists.',
        'apps.tags.health': 'Health',
        'apps.tags.productivity': 'Productivity',
        'apps.tags.utilities': 'Utilities',
        'apps.tags.network': 'Network',
        'apps.tags.travel': 'Travel',
        'apps.tags.organizer': 'Organizer',
        'apps.link': 'View on Play Store',
        'contact.title': 'Get in Touch',
        'contact.subtitle': 'Do you have any questions? I\'d love to hear from you',
        'contact.form.name': 'Name',
        'contact.form.email': 'Email',
        'contact.form.message': 'Message',
        'contact.form.submit': 'Send Message',
        'contact.success': 'Message sent successfully! I\'ll get back to you soon.',
        'contact.error': 'There was an error sending the message. Please try again.',
        'footer.rights': 'All rights reserved.',
        'footer.developer': 'Android App Developer',
        'footer.top': 'Back to top',
    }
};

class i18nManager {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        // Verificar si hay un idioma guardado en localStorage
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
            return savedLanguage;
        }

        // Detectar el idioma del navegador
        const browserLanguage = navigator.language || navigator.userLanguage;
        const languageCode = browserLanguage.split('-')[0].toLowerCase();

        if (languageCode === 'es') {
            return 'es';
        } else if (languageCode === 'en') {
            return 'en';
        }

        // Por defecto, español
        return 'es';
    }

    init() {
        this.updatePageLanguage();
        this.setupLanguageSwitcher();
    }

    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(language) {
        if (Object.keys(translations).includes(language)) {
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            this.updatePageLanguage();
        }
    }

    updatePageLanguage() {
        // Actualizar atributo lang del HTML
        document.documentElement.lang = this.currentLanguage;

        // Actualizar todos los elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const translation = this.translate(key);
            
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.type === 'submit') {
                    el.value = translation;
                } else if (el.placeholder) {
                    el.placeholder = translation;
                }
            } else {
                el.textContent = translation;
            }
        });

        // Actualizar botones de idioma activos
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLanguage) {
                btn.classList.add('active');
            }
        });
    }

    translate(key) {
        const keys = key.split('.');
        let translation = translations[this.currentLanguage];

        for (const k of keys) {
            if (translation && typeof translation === 'object') {
                translation = translation[k];
            } else {
                return key; // Retornar la clave si no se encuentra la traducción
            }
        }

        return translation || key;
    }
}

// Inicializar el gestor de idiomas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new i18nManager();
});
