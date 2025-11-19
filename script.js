// Detectar idioma del navegador
function detectLanguage() {
    const saved = localStorage.getItem('currentLang');
    if (saved) return saved;
    
    const browserLang = navigator.language || navigator.userLanguage;
    const lang = browserLang.startsWith('en') ? 'en' : 'es';
    
    localStorage.setItem('currentLang', lang);
    return lang;
}

// Cambiar idioma
function setLanguage(lang) {
    localStorage.setItem('currentLang', lang);
    updateLanguage(lang);
}

// Actualizar todos los textos
function updateLanguage(lang) {
    document.querySelectorAll('.lang').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
                el.value = text;
            } else if (el.tagName === 'A' && el.classList.contains('cta-button')) {
                el.textContent = text;
            } else {
                el.textContent = text;
            }
        }
    });
    
    // Actualizar botones activos
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === lang.toUpperCase());
    });
    
    // Actualizar lang del HTML
    document.documentElement.lang = lang;
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 0) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// Intersection Observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.app-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

const contactSection = document.querySelector('.contact-section');
if (contactSection) {
    contactSection.style.opacity = '0';
    contactSection.style.transform = 'translateY(20px)';
    contactSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(contactSection);
}

// Form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const formStatus = document.getElementById('formStatus');
    const currentLang = localStorage.getItem('currentLang') || 'es';
    
    const successMsg = currentLang === 'en' ? 'Message sent successfully!' : 'Mensaje enviado correctamente!';
    const errorMsg = currentLang === 'en' ? 'Error sending message' : 'Error al enviar el mensaje';
    
    try {
        const response = await fetch('https://formspree.io/f/xyzzywyb', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                name: name,
                email: email,
                message: message,
                _to: 'carnifis@gmail.com',
            })
        });

        if (response.ok) {
            formStatus.textContent = successMsg;
            formStatus.style.color = '#10b981';
            document.getElementById('contactForm').reset();
            
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        } else {
            formStatus.textContent = errorMsg;
            formStatus.style.color = '#ef4444';
        }
    } catch (error) {
        formStatus.textContent = errorMsg;
        formStatus.style.color = '#ef4444';
    }
});

// Inicializar idioma al cargar
document.addEventListener('DOMContentLoaded', () => {
    const lang = detectLanguage();
    updateLanguage(lang);
});
