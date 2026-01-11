/**
 * Werner Lichy Website - Main JavaScript
 * Production-ready code with optimized performance and clean architecture
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CONFIG = {
  LANGUAGE_KEY: 'lichy-website-language',
  MOBILE_BREAKPOINT: 768,
  ANIMATION_DELAYS: {
    HERO_BASE: 800,
    STAGGER: 50,
    RESIZE_THROTTLE: 250
  },
  PARALLAX: {
    SPEED: 1.2,
    TEXT_SPEED: 0.1,
    SCROLL_START: 0.9,
    SCROLL_END: 0.2
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(element, threshold = 0.9) {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  return rect.top <= windowHeight * threshold && rect.bottom >= 0
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Check if device is mobile
 */
function isMobileDevice() {
  return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Check if device is iOS
 */
function isIOSDevice() {
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent) || 
         (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
}

/**
 * Safe element selector with null check
 */
function safeQuerySelector(selector) {
  return document.querySelector(selector)
}

/**
 * Safe element selector all with null check
 */
function safeQuerySelectorAll(selector) {
  return document.querySelectorAll(selector)
}

// ============================================================================
// LANGUAGE MANAGEMENT
// ============================================================================

class LanguageManager {
  constructor() {
    this.currentLanguage = this.getSavedLanguage()
    this.translations = this.initializeTranslations()
  }

  getSavedLanguage() {
    // First check if user has a saved preference
    const savedLanguage = localStorage.getItem(CONFIG.LANGUAGE_KEY)
    if (savedLanguage === 'german' || savedLanguage === 'english') {
      return savedLanguage === 'english'
    }
    
    // If no saved preference, detect browser language
    const browserLang = navigator.language || navigator.userLanguage || 'en'
    const langCode = browserLang.toLowerCase().split('-')[0] // Get language code (e.g., 'de' from 'de-DE')
    
    // Default to German if browser language is German, otherwise English
    return langCode !== 'de'
  }

  saveLanguage(isEnglish) {
    localStorage.setItem(CONFIG.LANGUAGE_KEY, isEnglish ? 'english' : 'german')
    this.currentLanguage = isEnglish
  }

  initializeTranslations() {
    return {
      german: {
        navigation: ["Startseite", "Services", "Über uns", "Kontakt"],
        hero: {
          title: "Wir machen aus Ideen fertige Bauteile, alles aus einer Hand",
          subtitle: "Präzision aus Deutschland",
          button: "Unsere Services"
        },
        parallax: {
          text: "Seit über 40 Jahren verwandeln wir Ideen in präzise Bauteile, vom Prototyp bis zur Serienfertigung.",
          button: "Mehr über uns"
        },
        about: {
          title: "Über uns",
          paragraphs: [
            "Seit 1982 stehen wir für höchste Präzision, Innovation und Verlässlichkeit – heute in zweiter Generation und mit über vier Jahrzehnten Erfahrung.",
            "Aus einem reinen Modellbaubetrieb in Berlin-Reinickendorf gewachsen, bieten wir heute die komplette Prozesskette: von der Entwicklung und Modellfertigung über den Aluminiumguss bis hin zur CNC-Bearbeitung, Messtechnik und Montage – alles unter einem Dach.",
            "Unser inhabergeführtes Unternehmen arbeitet mit modernsten Maschinen und Fertigungstechniken und ist nach ISO 9001 zertifiziert. Wir sind stolz auf langjährige Partnerschaften mit namhaften Kunden aus der Automobilindustrie und dem Maschinenbau und entwickeln zugleich Lösungen für neue Branchen und Zukunftstechnologien wie 3D-Metall- und Kerndruck.",
            "Ob Prototyp, Kleinserie oder Spezialteil – wir finden Lösungen, wo andere aufgeben. Nachhaltigkeit, Teamgeist und die Leidenschaft für perfekte Ergebnisse treiben uns dabei jeden Tag an."
          ]
        },
        services: {
          title: "Unsere Services",
          subtitle: "Von Prototypen bis zur Serienfertigung liefern wir Präzisionsfertigung aus Berlin. Unsere hauseigenen Fähigkeiten, von Design und Guss bis zur Bearbeitung, Montage und Prüfung, gewährleisten gleichbleibende Qualität, kurze Lieferzeiten und vollständige Prozesskontrolle. Zuverlässig, innovativ und ISO 9001 zertifiziert.",
          products: {
            titles: ["Prototypenbau", "Aluminiumguss", "Kleinserien"],
            descriptions: [
              "Wir fertigen Prototypen auf Basis von 3D-CAD-Daten. Modellkonstruktion, Formerstellung, Guss, sowie mechanische Bearbeitung und Qualitätssicherung werden bei uns unter einem Dach durchgeführt.",
              "In unserer eigenen Gießerei betreiben wir Schmelzöfen für Aluminiumlegierungen. Mit unserem eigens entwickelten Gießverfahren erreichen wir ohne signifikanten Preisunterschied Wandstärken und Oberflächenstrukturen von druckgussähnlicher Qualität.",
              "Nahtlos im Anschluss an die Ergebnisse der Prototypenphase bieten wir die Produktion von Vor- und Kleinserien an. Auch hier wird mit seriennahen Werkstoffen gearbeitet und unter Verwendung der Datensätze und Werkzeuge der Prototypenphase, was für unsere Kunden einen weiteren Kostenvorteil bedeutet."
            ],
            buttons: "Mehr erfahren "
          },
          parallax2: {
            title: "Mehr als Produktion",
            text: "Unsere Leistungen greifen ineinander und bilden einen durchgängigen Fertigungsprozess, der den Anforderungen der Automobilindustrie entspricht.",
            button: "Zum gesamten Fertigungsprozess"
          }
        },
        contact: {
          title: "Kontakt",
          form: {
            labels: ["Name", "E-Mail <span class=\"required\">*</span>", "Nachricht <span class=\"required\">*</span>", "Ich stimme der Datenschutzerklärung zu <span class=\"required\">*</span>"],
            errors: ["Dieses Feld ist erforderlich", "Bitte geben Sie eine gültige E-Mail-Adresse ein.", "Bitte schreiben Sie eine kurze Nachricht.", "Bitte bestätigen Sie, dass Sie unsere Datenschutzerklärung gelesen haben."],
            button: "Nachricht senden",
            submissionError: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns an info@lichy-berlin.de",
            successMessage: "Vielen Dank für Ihre Nachricht. Wir werden uns bald bei Ihnen melden!"
          },
          info: {
            titles: ['<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg> ADRESSE', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg> E-MAIL', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg> TELEFON'],
            texts: ["Innungsstraße 60<br>13509 Berlin", "info@lichy-berlin.de", "030 / 414 16 12"]
          }
        },
        footer: {
          links: ["Startseite", "Services", "Über uns", "Kontakt"],
          copyright: "© 2025 Werner Lichy. Alle Rechte vorbehalten.",
          legal: ["Impressum", "Datenschutzerklärung"]
        },
        partners: {
          title: "Wir haben mit führenden Partnern aus der Automobil- und Ingenieurindustrie zusammengearbeitet."
        },
        language: {
          drawerTitle: "Sprache auswählen"
        }
      },
      english: {
        navigation: ["Home", "Services", "About", "Contact"],
        hero: {
          title: "We turn ideas into finished parts, all under one roof",
          subtitle: "Precision made in Germany",
          button: "Our Services"
        },
        parallax: {
          text: "For over 40 years, we've been your partner for prototypes, aluminum casting, and small-series production.",
          button: "More About Us"
        },
        about: {
          title: "About Us",
          paragraphs: [
            "Since 1982, we have stood for the highest precision, innovation, and reliability – today in the second generation with over four decades of experience.",
            "Grown from a pure model-making business in Berlin-Reinickendorf, we now offer the complete process chain: from development and model manufacturing through aluminum casting to CNC machining, measurement technology, and assembly – all under one roof.",
            "Our owner-managed company works with the most modern machines and manufacturing techniques and is ISO 9001 certified. We are proud of long-standing partnerships with renowned customers from the automotive industry and mechanical engineering and simultaneously develop solutions for new industries and future technologies such as 3D metal and core printing.",
            "Whether prototype, small series, or special part – we find solutions where others give up. Sustainability, team spirit, and the passion for perfect results drive us every day."
          ]
        },
        services: {
          title: "Our Services",
          subtitle: "From prototypes to serial production, we deliver precision manufacturing made in Berlin. Our in-house capabilities, from design and casting to machining, assembly, and testing, ensure consistent quality, short lead times, and full process control. Reliable, innovative, and ISO 9001 certified.",
          products: {
            titles: ["Prototype Development", "Aluminum Casting", "Small Series Production"],
            descriptions: [
              "We manufacture prototypes based on 3D CAD data. Model construction, mold creation, casting, as well as mechanical processing and quality assurance are all carried out under one roof.",
              "In our own foundry, we operate melting furnaces for aluminum alloys. With our specially developed casting process, we achieve wall thicknesses and surface structures of die-cast-like quality without significant price differences.",
              "Seamlessly following the results of the prototype phase, we offer the production of pre-series and small series. Here too, we work with production-grade materials and use the data sets and tools from the prototype phase, which means a further cost advantage for our customers."
            ],
            buttons: "Learn More "
          },
          parallax2: {
            title: "More than production",
            text: "Our services don't stand alone. They are part of a complete manufacturing workflow designed for automotive standards.",
            button: "Discover our manufacturing process"
          }
        },
        contact: {
          title: "Contact Us",
          form: {
            labels: ["Name", "Email <span class=\"required\">*</span>", "Message <span class=\"required\">*</span>", "I agree to the data protection policy <span class=\"required\">*</span>"],
            errors: ["This field is required", "Please enter a valid email address", "Please write a short message", "Please confirm that you've read our Privacy Policy"],
            button: "Send Message",
            submissionError: "Something went wrong. Please try again later or email us directly at info@lichy-berlin.de",
            successMessage: "Thank you for your message. We will get back to you soon!"
          },
          info: {
            titles: ['<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg> ADDRESS', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg> EMAIL', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg> PHONE'],
            texts: ["Innungsstraße 60<br>13509 Berlin", "info@lichy-berlin.de", "030 / 414 16 12"]
          }
        },
        footer: {
          links: ["Home", "Services", "About", "Contact"],
          copyright: "© 2025 Werner Lichy. All rights reserved.",
          legal: ["Legal Notice (Impressum)", "Privacy Policy"]
        },
        partners: {
          title: "We've worked with leading partners in the automotive and engineering industries."
        },
        language: {
          drawerTitle: "Select language"
        }
      }
    }
  }

  translateToLanguage(isEnglish) {
    const lang = isEnglish ? 'english' : 'german'
    const langCode = isEnglish ? 'en' : 'de'
    const t = this.translations[lang]
    
    // Update HTML lang attribute for accessibility and SEO
    document.documentElement.lang = langCode

    // Navigation
    this.updateElements('.nav-link', t.navigation)

    // Hero
    this.updateElement('.hero-title', t.hero.title)
    this.updateElement('.hero-subtitle', t.hero.subtitle)
    this.updateElement('.hero-cta .btn', t.hero.button)
    
    // Update hero title classes
    const heroTitle = safeQuerySelector('.hero-title')
    if (heroTitle) {
      heroTitle.classList.remove('german', 'english')
      heroTitle.classList.add(lang)
    }

    // Parallax
    this.updateElement('.parallax-1 .parallax-heading', t.parallax.text)
    this.updateElement('.parallax-1 .parallax-button .btn', t.parallax.button)

    // About
    this.updateElement('#about .section-title', t.about.title)
    this.updateElements('#about p', t.about.paragraphs)

    // Services
    this.updateElement('#products .section-title', t.services.title)
    this.updateElement('#products .section-subtitle', t.services.subtitle)
    this.updateElements('.product-content h3', t.services.products.titles)
    this.updateElements('.product-content p', t.services.products.descriptions)
    
    // Update service buttons with icons
    this.updateServiceButtons(t.services.products.buttons)

    // Parallax 2
    this.updateElement('.parallax-2 .parallax-heading', t.services.parallax2.text)
    this.updateElement('.parallax-2 .parallax-button .btn', t.services.parallax2.button)

    // Contact
    this.updateElement('#contact .section-title', t.contact.title)
    this.updateElements('.form-group label', t.contact.form.labels)
    this.updateElements('.error-message', t.contact.form.errors)
    this.updateElement('.btn-rounded', t.contact.form.button)
    
    // Update submission error message
    const submissionError = safeQuerySelector('#formSubmissionError p')
    if (submissionError) {
      submissionError.textContent = t.contact.form.submissionError
    }

    // Contact info
    this.updateElements('.info-item h3', t.contact.info.titles)
    this.updateElements('.info-item p', t.contact.info.texts)

    // Footer
    this.updateElements('.footer-links a', t.footer.links)
    this.updateElement('.footer-copyright p', t.footer.copyright)
    this.updateElements('.footer-legal-links a', t.footer.legal)

    // Partners
    this.updateElement('.partners-title', t.partners.title)

    // Language drawer title
    this.updateElement('#langDrawerTitle', t.language.drawerTitle)
  }

  updateElement(selector, content) {
    const element = safeQuerySelector(selector)
    if (element && content) {
      // Use innerHTML if content contains HTML tags, otherwise use textContent
      if (content.includes('<') && content.includes('>')) {
        element.innerHTML = content
      } else {
        element.textContent = content
      }
    }
  }

  updateElements(selector, contentArray) {
    const elements = safeQuerySelectorAll(selector)
    elements.forEach((element, index) => {
      if (contentArray[index]) {
        element.innerHTML = contentArray[index]
      }
    })
  }

  updateServiceButtons(buttonText) {
    const buttons = safeQuerySelectorAll('.product-content .btn-solid')
    buttons.forEach(button => {
      button.textContent = buttonText
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      icon.setAttribute('width', '24')
      icon.setAttribute('height', '24')
      icon.setAttribute('viewBox', '0 0 24 24')
      icon.setAttribute('fill', 'none')
      icon.setAttribute('stroke', 'currentColor')
      icon.setAttribute('stroke-width', '2')
      icon.setAttribute('stroke-linecap', 'round')
      icon.setAttribute('stroke-linejoin', 'round')
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path1.setAttribute('d', 'M5 12h14')
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path2.setAttribute('d', 'm12 5 7 7-7 7')
      icon.appendChild(path1)
      icon.appendChild(path2)
      button.appendChild(icon)
    })
  }
}

// ============================================================================
// ANIMATION MANAGER
// ============================================================================

class AnimationManager {
  constructor() {
    this.animateElements = safeQuerySelectorAll('.animate-on-scroll')
    this.scrollAnimateElements = safeQuerySelectorAll('.scroll-animate')
    this.heroElements = safeQuerySelectorAll('.hero-content .animate-on-scroll')
    this.init()
  }

  init() {
    // Skip all animations on mobile devices for better accessibility
    if (isMobileDevice()) {
      this.showAllElementsWithoutAnimation()
      return
    }
    
    this.initHeroAnimations()
    this.initScrollObserver() // Initialize observer first
    this.checkAnimations()
    this.bindScrollEvents()
  }

  initHeroAnimations() {
    // Skip animations on mobile or if user prefers reduced motion
    if (isMobileDevice() || prefersReducedMotion()) {
      this.showHeroElementsWithoutAnimation()
      return
    }

    this.hideHeroElements()
    setTimeout(() => {
      this.animateHeroElements()
      // Video-Animation auskommentiert - Video ist deaktiviert
      // this.animateHeroVideo()
    }, CONFIG.ANIMATION_DELAYS.HERO_BASE)
  }

  hideHeroElements() {
    this.heroElements.forEach(element => {
      element.style.opacity = '0'
      element.style.transform = 'translateY(30px)'
    })
  }

  showHeroElementsWithoutAnimation() {
    this.heroElements.forEach(element => {
      element.style.opacity = '1'
      element.style.transform = 'none'
    })
    
    // Video-Animation auskommentiert - Video ist deaktiviert
    // const heroVideo = safeQuerySelector('#heroVideo')
    //   if (heroVideo) {
    //   heroVideo.style.transform = 'translate(-50%, -50%) scale(1)'
    // }
  }

  animateHeroElements() {
    this.heroElements.forEach(element => {
      element.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out'
      element.style.opacity = '1'
      element.style.transform = 'translateY(0)'
    })
  }

  animateHeroVideo() {
    // Video-Animation auskommentiert - Video ist deaktiviert
    // const heroVideo = safeQuerySelector('#heroVideo')
    // if (heroVideo) {
    //   heroVideo.classList.add('zoom-in')
    // }
  }

  checkAnimations() {
    // Skip animations on mobile or if user prefers reduced motion
    if (isMobileDevice() || prefersReducedMotion()) {
      this.showAllElementsWithoutAnimation()
      return
    }

    this.animateScrollElements()
    this.animateScrollTiedElements()
  }

  showAllElementsWithoutAnimation() {
    // Show all animated elements immediately without animation
    [...this.animateElements, ...this.scrollAnimateElements].forEach(element => {
      element.classList.add('active')
      element.style.opacity = '1'
      element.style.transform = 'none'
      element.style.transition = 'none'
      element.style.animation = 'none'
      
      // Also ensure all child elements (images, text) are visible
      const children = element.querySelectorAll('*')
      children.forEach(child => {
        child.style.opacity = '1'
        child.style.transform = 'none'
        child.style.transition = 'none'
        child.style.animation = 'none'
      })
    })
    
    // Also handle hero elements
    this.heroElements.forEach(element => {
      element.style.opacity = '1'
      element.style.transform = 'none'
      element.style.transition = 'none'
    })
    
    // Ensure product images are visible
    const productImages = safeQuerySelectorAll('.product-image img, .scroll-animate img')
    productImages.forEach(img => {
      img.style.opacity = '1'
      img.style.visibility = 'visible'
      img.style.transform = 'scale(1)'
      img.style.transition = 'none'
    })
    
    // Ensure about section images are visible
    const aboutImages = safeQuerySelectorAll('.about-image img')
    aboutImages.forEach(img => {
      img.style.opacity = '1'
      img.style.visibility = 'visible'
      img.style.transform = 'none'
      img.style.transition = 'none'
    })
  }

  animateScrollElements() {
    // Use Intersection Observer for text elements too, for better performance
    if (!this.textObserver) {
      this.initTextObserver()
    }
    
    // Fallback for elements already in viewport
    requestAnimationFrame(() => {
      this.animateElements.forEach(element => {
        if (isElementInViewport(element, 0.01) && !element.classList.contains('active')) {
          const delay = parseInt(element.getAttribute('data-delay')) || 0
          if (delay > 0) {
            setTimeout(() => {
              element.classList.add('active')
            }, delay)
          } else {
            element.classList.add('active')
          }
        }
      })
    })
  }

  initTextObserver() {
    if (this.animateElements.length === 0) return
    
    const observerOptions = {
      root: null,
      rootMargin: '150px', // Trigger 150px before element enters viewport
      threshold: [0, 0.01, 0.1] // Multiple thresholds for better detection
    }

    this.textObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          const element = entry.target
          const delay = parseInt(element.getAttribute('data-delay')) || 0
          
          // Use requestAnimationFrame for smoother animation start
          if (delay > 0) {
            setTimeout(() => {
              requestAnimationFrame(() => {
                element.classList.add('active')
              })
            }, delay)
          } else {
            requestAnimationFrame(() => {
              element.classList.add('active')
            })
          }
          
          // Unobserve once animated to improve performance
          this.textObserver.unobserve(element)
        }
      })
    }, observerOptions)

    // Observe all animate-on-scroll elements
    this.animateElements.forEach(element => {
      // Check if element is already in viewport and animate immediately
      if (isElementInViewport(element, 0.01)) {
        const delay = parseInt(element.getAttribute('data-delay')) || 0
        if (delay > 0) {
          setTimeout(() => {
            requestAnimationFrame(() => {
              element.classList.add('active')
            })
          }, delay)
        } else {
          requestAnimationFrame(() => {
            element.classList.add('active')
          })
        }
      } else {
        this.textObserver.observe(element)
      }
    })
  }

  initScrollObserver() {
    // Use Intersection Observer API for better performance
    if (this.scrollAnimateElements.length === 0) return
    
    const observerOptions = {
      root: null,
      rootMargin: '150px', // Trigger 150px before element enters viewport for smoother animation
      threshold: [0, 0.01, 0.1] // Multiple thresholds for better detection
    }

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Trigger animation as soon as element starts entering viewport
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          // Use requestAnimationFrame for smoother animation start
          requestAnimationFrame(() => {
            entry.target.classList.add('active')
          })
          // Unobserve once animated to improve performance
          this.scrollObserver.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Observe all scroll-animate elements
    this.scrollAnimateElements.forEach(element => {
      // Check if element is already in viewport and animate immediately
      if (isElementInViewport(element, 0.01)) {
        requestAnimationFrame(() => {
          element.classList.add('active')
        })
      } else {
        this.scrollObserver.observe(element)
      }
    })
  }

  animateScrollTiedElements() {
    // Fallback for elements already in viewport (in case observer hasn't fired yet)
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      this.scrollAnimateElements.forEach(element => {
        if (isElementInViewport(element, 0.01) && !element.classList.contains('active')) {
          element.classList.add('active')
        }
      })
    })
  }

  bindScrollEvents() {
    // Use requestAnimationFrame for smoother animations
    let ticking = false
    
    const updateAnimations = () => {
      this.checkAnimations()
      ticking = false
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateAnimations)
        ticking = true
      }
    }, { passive: true }) // Add passive flag for better scroll performance
  }
}

// ============================================================================
// PARALLAX MANAGER
// ============================================================================

class ParallaxManager {
  constructor() {
    this.parallaxSections = safeQuerySelectorAll('.parallax')
    this.aboutText = safeQuerySelector('.about-text')
    this.productTexts = safeQuerySelectorAll('.product-text-parallax')
    this.init()
  }

  init() {
    if (this.parallaxSections.length === 0 || prefersReducedMotion()) {
      return
    }

    this.initMainParallax()
    this.initTextParallax()
    this.handleMobileOptimization()
  }

  initMainParallax() {
    const updateParallax = throttle(() => {
      const scrollTop = window.pageYOffset

      this.parallaxSections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top + scrollTop
        const sectionHeight = section.offsetHeight
        const viewportHeight = window.innerHeight

        if (scrollTop + viewportHeight > sectionTop && scrollTop < sectionTop + sectionHeight) {
          const scrollIntoSection = scrollTop + viewportHeight - sectionTop
          const scrollPercentage = scrollIntoSection / (sectionHeight + viewportHeight)

          // Spürbarer, aber begrenzter Parallax‑Effekt in Pixeln
          const MAX_OFFSET = 120 // maximale Verschiebung in px nach oben/unten
          const rawOffset = (scrollPercentage - 0.5) * 2 * MAX_OFFSET * CONFIG.PARALLAX.SPEED
          const clampedOffset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, rawOffset))

          section.style.backgroundPositionY = `calc(50% + ${clampedOffset}px)`
        }
      })
    }, 16)

    updateParallax()
    window.addEventListener('scroll', updateParallax)
    window.addEventListener('resize', updateParallax)
    window.addEventListener('load', updateParallax)
  }

  initTextParallax() {
    const updateTextParallax = throttle(() => {
      this.updateAboutTextParallax()
      this.updateProductTextParallax()
    }, 16)

    window.addEventListener('scroll', updateTextParallax)
    updateTextParallax()
  }

  updateAboutTextParallax() {
    if (!this.aboutText) return

    const rect = this.aboutText.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      if (rect.top < windowHeight && rect.bottom > 0) {
      const yPos = -(rect.top * CONFIG.PARALLAX.TEXT_SPEED)
      this.aboutText.style.transform = `translateY(${yPos}px)`
      } else {
      this.aboutText.style.transform = 'translateY(0)'
    }
  }

  updateProductTextParallax() {
    this.productTexts.forEach(text => {
        const rect = text.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        if (rect.top < windowHeight && rect.bottom > 0) {
        const yPos = -(rect.top * CONFIG.PARALLAX.TEXT_SPEED)
          text.style.transform = `translateY(${yPos}px)`
        } else {
          text.style.transform = 'translateY(0)'
        }
      })
    }
    
  handleMobileOptimization() {
    const updateMobileParallax = throttle(() => {
      if (isMobileDevice()) {
        this.disableParallaxOnMobile()
        document.body.classList.add('mobile-device')
      } else {
        document.body.classList.remove('mobile-device')
      }
    }, CONFIG.ANIMATION_DELAYS.RESIZE_THROTTLE)

    updateMobileParallax()
    window.addEventListener('resize', updateMobileParallax)
  }

  disableParallaxOnMobile() {
    this.parallaxSections.forEach(element => {
        element.style.backgroundAttachment = 'scroll'
        element.style.backgroundPosition = 'center center'
        element.style.backgroundSize = 'cover'
        element.style.backgroundRepeat = 'no-repeat'
        element.style.transform = 'none'
        element.style.willChange = 'auto'
      })
      
    const animatedElements = safeQuerySelectorAll('.animate-on-scroll')
      animatedElements.forEach(element => {
        if (element.closest('.parallax')) {
          element.style.transform = 'none'
          element.style.willChange = 'auto'
        }
      })
  }
}

// ============================================================================
// FORM MANAGER
// ============================================================================

class FormManager {
  constructor() {
    this.form = safeQuerySelector('#contactForm')
    this.submissionError = safeQuerySelector('#formSubmissionError')
    this.languageManager = null
    this.init()
  }

  setLanguageManager(languageManager) {
    this.languageManager = languageManager
  }

  init() {
    if (!this.form) return

    this.bindFormEvents()
    this.bindInputEvents()
  }

  bindFormEvents() {
    this.form.addEventListener('submit', (e) => {
      this.hideSubmissionError()
      
      if (!this.validateForm()) {
        e.preventDefault()
      } else {
        // Form is valid, let it submit naturally
        // The server-side script will handle the response
        this.handleFormSubmission(e)
      }
    })
  }

  bindInputEvents() {
    const formInputs = safeQuerySelectorAll('.form-input')
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          this.clearFieldError(input)
        }
      })
    })

    // Special handling for email validation
    const emailInput = safeQuerySelector('#email')
    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim() && !this.isValidEmail(emailInput.value)) {
          this.setFieldError(emailInput, 1) // Use email-specific error message
        }
      })
    }

    // Special handling for message validation
    const messageInput = safeQuerySelector('#message')
    if (messageInput) {
      messageInput.addEventListener('blur', () => {
        if (messageInput.value.trim() && messageInput.value.trim().length < 10) {
          this.setFieldError(messageInput, 2) // Use message-specific error message
        }
      })
    }

    // Special handling for consent checkbox
    const consentCheckbox = safeQuerySelector('#consent')
    if (consentCheckbox) {
      consentCheckbox.addEventListener('change', () => {
        if (consentCheckbox.checked) {
          this.clearFieldError(consentCheckbox)
        }
      })
    }
  }

  validateForm() {
    let isValid = true
    const formGroups = safeQuerySelectorAll('.form-group')

    // Reset all error states
    formGroups.forEach(group => group.classList.remove('has-error'))

    // Validate name field
    const nameInput = safeQuerySelector('#name')
    if (!nameInput.value.trim()) {
      isValid = false
      this.setFieldError(nameInput, 0) // Use name-specific error message
    }

    // Validate email field
    const emailInput = safeQuerySelector('#email')
    if (!emailInput.value.trim()) {
      isValid = false
      this.setFieldError(emailInput, 0) // Use generic required error
    } else if (!this.isValidEmail(emailInput.value)) {
      isValid = false
      this.setFieldError(emailInput, 1) // Use email-specific error message
    }

    // Validate message field
    const messageInput = safeQuerySelector('#message')
    if (!messageInput.value.trim()) {
      isValid = false
      this.setFieldError(messageInput, 0) // Use generic required error
    } else if (messageInput.value.trim().length < 10) {
      isValid = false
      this.setFieldError(messageInput, 2) // Use message-specific error message
    }

    // Validate consent checkbox
    const consentCheckbox = safeQuerySelector('#consent')
    if (!consentCheckbox.checked) {
      isValid = false
      this.setFieldError(consentCheckbox, 3) // Use consent-specific error message
    }

    return isValid
  }

  isValidEmail(email) {
    // Basic email validation - simple syntax check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  setFieldError(field, errorIndex = 0) {
    field.parentElement.classList.add('has-error')
    field.classList.add('error')
    
    // Update error message if language manager is available
    if (this.languageManager) {
      const errorMessage = field.parentElement.querySelector('.error-message')
      if (errorMessage) {
        const lang = this.languageManager.currentLanguage ? 'english' : 'german'
        const errors = this.languageManager.translations[lang].contact.form.errors
        if (errors[errorIndex]) {
          errorMessage.textContent = errors[errorIndex]
        }
      }
    }
  }

  clearFieldError(field) {
    field.parentElement.classList.remove('has-error')
    field.classList.remove('error')
  }

  handleFormSubmission(e) {
    // Hide any previous submission errors
    this.hideSubmissionError()
    
    // Prevent default form submission
    e.preventDefault()
    
    // Show loading state
    const submitButton = this.form.querySelector('button[type="submit"]')
    const originalButtonText = submitButton.textContent
    submitButton.textContent = 'Sending...'
    submitButton.disabled = true
    
    // Prepare form data
    const formData = new FormData(this.form)
    
    // Submit via fetch API
    fetch('send-mail.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Show success message
        this.showSuccessMessage(data.message)
        // Reset form
        this.form.reset()
      } else {
        // Show error message
        this.showSubmissionError(data.message)
      }
    })
    .catch(error => {
      console.error('Form submission error:', error)
      this.showSubmissionError('Something went wrong. Please try again later or email us directly at info@lichy-berlin.de')
    })
    .finally(() => {
      // Restore button state
      submitButton.textContent = originalButtonText
      submitButton.disabled = false
    })
  }

  showSubmissionError(customMessage = null) {
    if (this.submissionError) {
      const errorParagraph = this.submissionError.querySelector('p')
      if (errorParagraph) {
        if (customMessage) {
          errorParagraph.textContent = customMessage
        } else if (this.languageManager) {
          const lang = this.languageManager.currentLanguage ? 'english' : 'german'
          const errorText = this.languageManager.translations[lang].contact.form.submissionError
          errorParagraph.textContent = errorText
        }
      }
      
      this.submissionError.style.display = 'block'
    }
  }

  showSuccessMessage(message) {
    if (this.submissionError) {
      // Temporarily change styling for success message
      this.submissionError.style.backgroundColor = '#d4edda'
      this.submissionError.style.borderColor = '#c3e6cb'
      this.submissionError.style.color = '#155724'
      
      const errorParagraph = this.submissionError.querySelector('p')
      if (errorParagraph) {
        // Use custom message or fallback to translated message
        if (message) {
          errorParagraph.textContent = message
        } else if (this.languageManager) {
          const lang = this.languageManager.currentLanguage ? 'english' : 'german'
          const successText = this.languageManager.translations[lang].contact.form.successMessage
          errorParagraph.textContent = successText
        }
      }
      
      this.submissionError.style.display = 'block'
      
      // Reset styling after 5 seconds
      setTimeout(() => {
        this.submissionError.style.backgroundColor = '#f8d7da'
        this.submissionError.style.borderColor = '#f5c6cb'
        this.submissionError.style.color = '#721c24'
        this.hideSubmissionError()
      }, 5000)
    }
  }

  hideSubmissionError() {
    if (this.submissionError) {
      this.submissionError.style.display = 'none'
    }
  }
}

// ============================================================================
// NAVIGATION MANAGER
// ============================================================================

class NavigationManager {
  constructor() {
    this.menuToggle = safeQuerySelector('#menuToggle')
    this.nav = safeQuerySelector('#nav')
    this.navLinks = safeQuerySelectorAll('.nav-link')
    this.init()
  }

  init() {
    if (!this.menuToggle || !this.nav) return

    // Set initial ARIA attributes
    this.menuToggle.setAttribute('aria-expanded', 'false')
    this.menuToggle.setAttribute('aria-controls', 'nav')
    if (!this.menuToggle.getAttribute('aria-label')) {
      this.menuToggle.setAttribute('aria-label', 'Toggle navigation menu')
    }

    this.bindMenuEvents()
    this.bindNavLinkEvents()
    this.bindOutsideClickEvents()
  }

  bindMenuEvents() {
    // Click event
    this.menuToggle.addEventListener('click', (e) => {
      e.stopPropagation()
      this.toggleMenu()
    })

    // Keyboard event for accessibility (Enter and Space)
    this.menuToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        this.toggleMenu()
      }
      // Close menu on Escape
      if (e.key === 'Escape' && this.nav.classList.contains('active')) {
        this.closeMenu()
        this.menuToggle.focus()
      }
    })

    this.nav.addEventListener('click', (e) => {
      e.stopPropagation()
    })
  }

  bindNavLinkEvents() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu()
      })
      
      // Close menu on Escape key
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.nav.classList.contains('active')) {
          this.closeMenu()
          this.menuToggle.focus()
        }
      })
    })
  }

  bindOutsideClickEvents() {
    document.addEventListener('click', (e) => {
      if (this.nav.classList.contains('active') && 
          !this.nav.contains(e.target) && 
          e.target !== this.menuToggle) {
        this.closeMenu()
      }
    })
  }

  toggleMenu() {
    const isExpanded = this.nav.classList.contains('active')
    this.nav.classList.toggle('active')
    document.body.classList.toggle('menu-open')
    
    // Close language drawer if open (mobile only)
    if (!isExpanded && window.innerWidth <= 768) {
      const langDrawer = safeQuerySelector('#langDrawer')
      if (langDrawer && langDrawer.classList.contains('active')) {
        langDrawer.classList.remove('active')
        document.body.style.overflow = ''
      }
    }
    
    // Update ARIA attributes
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', !isExpanded)
    }
  }

  closeMenu() {
    this.nav.classList.remove('active')
    document.body.classList.remove('menu-open')
    
    // Update ARIA attributes
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'false')
    }
  }
}

// ============================================================================
// SMOOTH SCROLL MANAGER
// ============================================================================

class SmoothScrollManager {
  constructor() {
    this.init()
  }

  init() {
    const anchorLinks = safeQuerySelectorAll('a[href^="#"]')
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        this.handleAnchorClick(e, anchor)
      })
    })

    // Adjust initial scroll position if page is loaded with a hash (e.g., from another page)
    this.handleInitialHash()
  }

  handleAnchorClick(e, anchor) {
    e.preventDefault()

    const targetId = anchor.getAttribute('href')
    if (targetId === '#') return

    // Handle cross-page links (e.g., /#contact)
    if (targetId.includes('#')) {
      const [page, hash] = targetId.split('#')
      if (page && page !== window.location.pathname.split('/').pop()) {
        // Navigate to different page
        window.location.href = targetId
        return
      }
      // Update targetId to just the hash
      const targetElement = safeQuerySelector('#' + hash)
      if (!targetElement) return
      
      const headerHeight = safeQuerySelector('.header')?.offsetHeight || 0
      const elementHeight = targetElement.offsetHeight
      const viewportHeight = window.innerHeight
      
      // Center the element in viewport
      const targetPosition = targetElement.getBoundingClientRect().top + 
                            window.pageYOffset - headerHeight - 
                            (viewportHeight / 2) + (elementHeight / 2)

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      })
      return
    }

    const targetElement = safeQuerySelector(targetId)
    if (!targetElement) return

    const headerHeight = safeQuerySelector('.header')?.offsetHeight || 0
    const elementHeight = targetElement.offsetHeight
    const viewportHeight = window.innerHeight
    
    // Center the element in viewport
    const targetPosition = targetElement.getBoundingClientRect().top + 
                          window.pageYOffset - headerHeight - 
                          (viewportHeight / 2) + (elementHeight / 2)

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth'
    })
  }

  handleInitialHash() {
    const hash = window.location.hash
    if (!hash || hash === '#') return

    // Small timeout to ensure layout is ready
    setTimeout(() => {
      const targetElement = safeQuerySelector(hash)
      if (!targetElement) return

      const headerHeight = safeQuerySelector('.header')?.offsetHeight || 0
      const elementHeight = targetElement.offsetHeight
      const viewportHeight = window.innerHeight

      // Use offsetTop so calculation is independent of any default browser hash jump
      const elementTop = targetElement.offsetTop

      const targetPosition = elementTop - headerHeight -
                            (viewportHeight / 2) + (elementHeight / 2)

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'auto'
      })
    }, 50)
  }
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

class WernerLichyApp {
  constructor() {
    this.languageManager = new LanguageManager()
    this.animationManager = new AnimationManager()
    this.parallaxManager = new ParallaxManager()
    this.formManager = new FormManager()
    this.navigationManager = new NavigationManager()
    this.smoothScrollManager = new SmoothScrollManager()
    
    this.init()
  }

  init() {
    this.setupDeviceClasses()
    this.initializeIcons()
    this.setupLanguageToggle()
    this.setupFormManager()
    this.setupPageTransition()
  }

  setupDeviceClasses() {
    if (isIOSDevice()) {
      document.body.classList.add('ios')
    }
  }

  initializeIcons() {
  }

  setupLanguageToggle() {
    const langToggle = safeQuerySelector('#langToggle')
    const currentLang = safeQuerySelector('.current-lang')
    const langDropdown = safeQuerySelector('#langDropdown')
    const langOptions = safeQuerySelectorAll('.lang-option')
    const langDrawer = safeQuerySelector('#langDrawer')
    const langDrawerClose = safeQuerySelector('#langDrawerClose')
    const langDrawerOptions = safeQuerySelectorAll('.lang-drawer-option')

    if (!langToggle || !currentLang) return

    // Check if mobile
    const isMobile = () => window.innerWidth <= CONFIG.MOBILE_BREAKPOINT

    // Update active language option
    const updateActiveOption = (isEnglish) => {
      // Update dropdown options
      langOptions.forEach(option => {
        option.classList.remove('active')
        if ((isEnglish && option.dataset.lang === 'english') ||
            (!isEnglish && option.dataset.lang === 'german')) {
          option.classList.add('active')
        }
      })
      
      // Update drawer options
      langDrawerOptions.forEach(option => {
        option.classList.remove('active')
        if ((isEnglish && option.dataset.lang === 'english') ||
            (!isEnglish && option.dataset.lang === 'german')) {
          option.classList.add('active')
        }
      })
    }

    // Open/close drawer
    const openDrawer = () => {
      if (langDrawer) {
        // Close navigation menu if open
        if (this.navigationManager && this.navigationManager.nav && this.navigationManager.nav.classList.contains('active')) {
          this.navigationManager.closeMenu()
        }
        
        langDrawer.classList.add('active')
        document.body.style.overflow = 'hidden'
        // Icons are now static SVGs, no initialization needed
      }
    }

    const closeDrawer = () => {
      if (langDrawer) {
        langDrawer.classList.remove('active')
        document.body.style.overflow = ''
      }
    }

    // Set initial language display
    const isEnglish = this.languageManager.currentLanguage
    currentLang.textContent = isEnglish ? 'EN' : 'DE'
    updateActiveOption(isEnglish)

    // Apply saved language preference
    this.languageManager.translateToLanguage(isEnglish)

    // Handle language toggle click
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation()
      
      if (isMobile()) {
        // Open drawer on mobile
        openDrawer()
      } else {
        // Toggle dropdown on desktop
        if (langDropdown) {
          const isExpanded = langToggle.getAttribute('aria-expanded') === 'true'
          langToggle.setAttribute('aria-expanded', !isExpanded)
          langDropdown.classList.toggle('show')
        }
      }
    })

    // Close drawer when clicking overlay or close button
    if (langDrawer) {
      const overlay = langDrawer.querySelector('.lang-drawer-overlay')
      if (overlay) {
        overlay.addEventListener('click', closeDrawer)
      }
      
      if (langDrawerClose) {
        langDrawerClose.addEventListener('click', closeDrawer)
      }
    }

    // Close dropdown when clicking outside (desktop only)
    if (langDropdown) {
      document.addEventListener('click', (e) => {
        if (!isMobile() && 
            !langToggle.contains(e.target) && 
            !langDropdown.contains(e.target)) {
          langToggle.setAttribute('aria-expanded', 'false')
          langDropdown.classList.remove('show')
        }
      })
    }

    // Handle language selection
    const handleLanguageSelection = (selectedLang) => {
      this.languageManager.saveLanguage(selectedLang)
      currentLang.textContent = selectedLang ? 'EN' : 'DE'
      updateActiveOption(selectedLang)
      this.languageManager.translateToLanguage(selectedLang)
      
      // Close drawer/dropdown
      if (isMobile()) {
        closeDrawer()
      } else {
        if (langDropdown) {
          langToggle.setAttribute('aria-expanded', 'false')
          langDropdown.classList.remove('show')
        }
      }
      
      // Announce language change to screen readers
      const liveRegion = safeQuerySelector('#aria-live-region')
      if (liveRegion) {
        liveRegion.textContent = `Language changed to ${selectedLang ? 'English' : 'German'}`
        setTimeout(() => {
          liveRegion.textContent = ''
        }, 1000)
      }
    }

    // Handle language selection from dropdown (desktop)
    langOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation()
        const selectedLang = option.dataset.lang === 'english'
        handleLanguageSelection(selectedLang)
      })
    })

    // Handle language selection from drawer (mobile)
    langDrawerOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation()
        const selectedLang = option.dataset.lang === 'english'
        handleLanguageSelection(selectedLang)
      })
    })
    
    // Keyboard support for language toggle
    langToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        langToggle.click()
      } else if (e.key === 'Escape') {
        if (isMobile() && langDrawer && langDrawer.classList.contains('active')) {
          closeDrawer()
        } else if (langDropdown) {
          langToggle.setAttribute('aria-expanded', 'false')
          langDropdown.classList.remove('show')
        }
      }
    })

    // Keyboard support for drawer close button
    if (langDrawerClose) {
      langDrawerClose.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          closeDrawer()
        } else if (e.key === 'Escape') {
          closeDrawer()
        }
      })
    }

    // Keyboard navigation in dropdown (desktop)
    langOptions.forEach((option, index) => {
      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          option.click()
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          const nextOption = langOptions[index + 1] || langOptions[0]
          nextOption.focus()
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          const prevOption = langOptions[index - 1] || langOptions[langOptions.length - 1]
          prevOption.focus()
        } else if (e.key === 'Escape') {
          langToggle.setAttribute('aria-expanded', 'false')
          langDropdown.classList.remove('show')
          langToggle.focus()
        }
      })
    })

    // Keyboard navigation in drawer (mobile)
    langDrawerOptions.forEach((option, index) => {
      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          option.click()
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          const nextOption = langDrawerOptions[index + 1] || langDrawerOptions[0]
          nextOption.focus()
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          const prevOption = langDrawerOptions[index - 1] || langDrawerOptions[langDrawerOptions.length - 1]
          prevOption.focus()
        } else if (e.key === 'Escape') {
          closeDrawer()
          langToggle.focus()
        }
      })
    })

    // Icons are now static SVGs, no initialization needed
  }

  setupFormManager() {
    this.formManager.setLanguageManager(this.languageManager)
  }

  setupPageTransition() {
    document.body.classList.add('page-transition')
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  new WernerLichyApp()
})