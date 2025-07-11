// Detect iOS - moved to the top for better organization
const isIOS = (() => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
})()

// Add iOS class to body for CSS targeting
if (isIOS) {
  document.body.classList.add("ios")
}

// Initialize this at the beginning of the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  // Add iOS class to body for CSS targeting
  if (isIOS) {
    document.body.classList.add("ios")
  }

  // Initialize Lucide icons
  const lucide = window.lucide
  lucide.createIcons()

  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle")
  const nav = document.getElementById("nav")

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation() // Prevent click from bubbling to document
      nav.classList.toggle("active")
      document.body.classList.toggle("menu-open")
    })

    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll(".nav-link")

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active")
        document.body.classList.remove("menu-open")
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      // Check if menu is open and click is outside the nav
      if (nav.classList.contains("active") && !nav.contains(e.target) && e.target !== menuToggle) {
        nav.classList.remove("active")
        document.body.classList.remove("menu-open")
      }
    })

    // Prevent clicks inside the nav from closing the menu
    nav.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }

  // Language switcher
  const langToggle = document.getElementById("langToggle")
  const currentLang = document.querySelector(".current-lang")

  // Change the language state to default to English
  // Track current language state globally for use in other functions
  let isEnglish = true

  if (langToggle) {
    // Set initial language display
    currentLang.textContent = isEnglish ? "EN" : "DE"

    // Apply English language by default
    translateToEnglish()

    // Toggle language on click
    langToggle.addEventListener("click", () => {
      isEnglish = !isEnglish

      // Update language display
      currentLang.textContent = isEnglish ? "EN" : "DE"

      // Switch language content
      if (isEnglish) {
        translateToEnglish()
      } else {
        translateToGerman()
      }
    })
  }

  // Form validation
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      let isValid = true
      const requiredFields = contactForm.querySelectorAll("[required]")

      // Reset all error states
      const formGroups = contactForm.querySelectorAll(".form-group")
      formGroups.forEach((group) => {
        group.classList.remove("has-error")
      })

      // Check each required field
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.parentElement.classList.add("has-error")
          field.classList.add("error")
        } else {
          field.classList.remove("error")
        }
      })

      if (isValid) {
        // Show temporary message that sending is not available
        if (isEnglish) {
          alert(
            "Message sending is currently not available. Our contact form is being set up. Please contact us directly via email or phone.",
          )
        } else {
          alert(
            "Das Senden von Nachrichten ist derzeit nicht verfügbar. Unser Kontaktformular wird eingerichtet. Bitte kontaktieren Sie uns direkt per E-Mail oder Telefon.",
          )
        }

        // Reset the form
        contactForm.reset()
      }
    })

    // Add input event listeners to clear errors when user types
    const formInputs = contactForm.querySelectorAll(".form-input")
    formInputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (input.value.trim()) {
          input.parentElement.classList.remove("has-error")
          input.classList.remove("error")
        }
      })
    })
  }

  // Scroll animations
  const animateElements = document.querySelectorAll(".animate-on-scroll")
  const scrollAnimateElements = document.querySelectorAll(".scroll-animate")

  // Initial check for elements in viewport
  checkAnimations()

  // Find the animation code for hero elements and update it

  // Add specific animation timing for hero elements
  const heroElements = document.querySelectorAll(".hero-content .animate-on-scroll")
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (!prefersReducedMotion) {
    heroElements.forEach((element, index) => {
      // Make the base delay longer for more drama
      const baseDelay = 800
      const delay = element.getAttribute("data-delay") || index * 400 + baseDelay

      // Initially hide the elements
      element.style.opacity = "0"
      element.style.transform = "translateY(30px)"

      // Animate them in with a slower transition
      setTimeout(() => {
        element.style.transition = "opacity 1.5s ease-out, transform 1.5s ease-out"
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }, delay)
    })
  } else {
    // For reduced motion, just show the elements without animation
    heroElements.forEach((element) => {
      element.style.opacity = "1"
      element.style.transform = "none"
    })
  }

  function checkAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // If reduced motion is preferred, make all elements visible without animations
    if (prefersReducedMotion) {
      animateElements.forEach((element) => {
        element.classList.add("active")
        element.style.opacity = "1"
        element.style.transform = "none"
      })

      scrollAnimateElements.forEach((element) => {
        element.classList.add("active")
        element.style.opacity = "1"
        element.style.transform = "none"
      })

      return
    }

    // Basic animations with smoother transitions
    animateElements.forEach((element) => {
      if (isElementInViewport(element)) {
        const delay = element.getAttribute("data-delay") || 0
        setTimeout(() => {
          element.classList.add("active")
        }, delay)
      }
    })

    // Improved scroll-tied animations for products section
    scrollAnimateElements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate how far the element is in the viewport (0 to 1)
      // This creates a smoother transition zone
      const scrollStart = 0.9 // Start when element is 90% below viewport
      const scrollEnd = 0.2 // End when element is 20% below viewport top

      let scrollProgress =
        (windowHeight * scrollStart - elementPosition.top) / (windowHeight * (scrollStart - scrollEnd))

      // Clamp values between 0 and 1
      scrollProgress = Math.max(0, Math.min(scrollProgress, 1))

      // Apply easing function for smoother motion
      // This uses a cubic ease-out function
      const easedProgress = 1 - Math.pow(1 - scrollProgress, 3)

      if (scrollProgress > 0) {
        // Set opacity with slight delay compared to movement
        element.style.opacity = Math.min(1, easedProgress * 1.3)

        // Apply transform based on animation type with more dramatic off-screen starting positions
        const animationType = element.getAttribute("data-animation")
        if (animationType === "slide-right") {
          const translateX = -100 + easedProgress * 100 // Full width off-screen
          element.style.transform = `translateX(${translateX}%)`
        } else if (animationType === "slide-left") {
          const translateX = 100 - easedProgress * 100 // Full width off-screen
          element.style.transform = `translateX(${translateX}%)`
        }

        // When fully in viewport, add active class
        if (scrollProgress >= 0.95) {
          element.classList.add("active")
        }
      }
    })
  }

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect()
    // Start animation earlier - when element is 90% below the viewport
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 && rect.bottom >= 0
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        // Get header height for offset
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // COMPLETELY REVISED PARALLAX IMPLEMENTATION
  // This is a simpler, more reliable approach to parallax scrolling
  function initParallax() {
    const parallaxSections = document.querySelectorAll(".parallax")

    // Skip if no parallax sections or user prefers reduced motion
    if (parallaxSections.length === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    // Function to update parallax effect
    function updateParallax() {
      const scrollTop = window.pageYOffset

      parallaxSections.forEach((section) => {
        // Get section position relative to viewport
        const sectionTop = section.getBoundingClientRect().top + scrollTop
        const sectionHeight = section.offsetHeight
        const viewportHeight = window.innerHeight

        // Check if section is visible
        if (scrollTop + viewportHeight > sectionTop && scrollTop < sectionTop + sectionHeight) {
          // Calculate how far we've scrolled into the section
          const scrollIntoSection = scrollTop + viewportHeight - sectionTop
          const scrollPercentage = scrollIntoSection / (sectionHeight + viewportHeight)

          // Calculate parallax offset (adjust speed factor as needed)
          const parallaxSpeed = 1.2
          const offset = scrollPercentage * 100 * parallaxSpeed

          // Apply different positioning for each section
          if (section.classList.contains("parallax-1")) {
            section.style.backgroundPositionY = `calc(50% + ${offset}px)`
          } else if (section.classList.contains("parallax-2")) {
            section.style.backgroundPositionY = `calc(50% + ${offset}px)`
          }

          // Debug info - uncomment to see values
          // console.log(`Section: ${section.classList}, Offset: ${offset}px`)
        }
      })
    }

    // Initial update
    updateParallax()

    // Update on scroll with throttling for performance
    let ticking = false
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax()
          ticking = false
        })
        ticking = true
      }
    })

    // Update on resize
    window.addEventListener("resize", updateParallax)

    // Additional update after images might have loaded
    window.addEventListener("load", updateParallax)

    // Force multiple updates to ensure effect is applied
    setTimeout(updateParallax, 100)
    setTimeout(updateParallax, 500)
    setTimeout(updateParallax, 1000)
  }

  // Initialize parallax
  initParallax()

  // Check animations on scroll
  window.addEventListener("scroll", () => {
    checkAnimations()
  })

  // Language translation functions
  function translateToGerman() {
    // Navigation
    document.querySelectorAll(".nav-link")[0].textContent = "STARTSEITE"
    document.querySelectorAll(".nav-link")[1].textContent = "ÜBER UNS"
    document.querySelectorAll(".nav-link")[2].textContent = "PRODUKTE"
    document.querySelectorAll(".nav-link")[3].textContent = "KONTAKT"

    // Hero
    const heroTitle = document.querySelector(".hero-title")
    heroTitle.innerHTML = '<span class="first-part">PRÄZISIONS</span><span class="second-part">FERTIGUNG</span>'
    heroTitle.classList.remove("english")
    heroTitle.classList.add("german")
    document.querySelector(".hero-subtitle").textContent = "AUS BERLIN"

    // About
    document.querySelector("#about .section-title").textContent = "ÜBER UNS"
    const aboutParagraphs = document.querySelectorAll("#about p")
    aboutParagraphs[0].textContent =
      "Seit über 40 Jahren sind wir Ihr kompetenter Ansprechpartner für Prototypenbau, Modellbau, Aluminiumguss und die Fertigung von Kleinserien. Als familiengeführtes Unternehmen stehen bei uns Qualität, Verlässlichkeit und persönliche Betreuung im Mittelpunkt. Mit modernster CNC-Bearbeitung, einem hohen Maß an Flexibilität und einem erfahrenen Team aus hochqualifizierten Fachkräften setzen wir Ihre Projekte effizient und präzise um."
    aboutParagraphs[1].textContent =
      "Ob Einzelanfertigung oder Serienproduktion – wir begleiten Sie von der ersten Idee bis zum fertigen Bauteil und finden gemeinsam die beste Lösung für Ihre Anforderungen im Bereich Präzisionsfertigung und Aluminiumguss."

    // Products
    document.querySelector("#products .section-title").textContent = "UNSERE PRODUKTE"

    const productTitles = document.querySelectorAll(".product-content h3")
    productTitles[0].textContent = "PROTOTYPENBAU"
    productTitles[1].textContent = "ALUMINIUMGUSS"
    productTitles[2].textContent = "KLEINSERIEN"

    const productDescriptions = document.querySelectorAll(".product-content p")
    // Updated content for the Prototype section
    productDescriptions[0].textContent =
      "Wir fertigen Prototypen auf Basis von 3D-CAD-Daten. Modellkonstruktion, Formerstellung, Guss, sowie mechanische Bearbeitung und Qualitätssicherung werden bei uns unter einem Dach durchgeführt."
    productDescriptions[1].textContent =
      "In unserer eigenen Gießerei betreiben wir Schmelzöfen für Aluminiumlegierungen. Mit unserem eigens entwickelten Gießverfahren erreichen wir ohne signifikanten Preisunterschied Wandstärken und Oberflächenstrukturen von druckgussähnlicher Qualität."
    productDescriptions[2].textContent =
      "Nahtlos im Anschluss an die Ergebnisse der Prototypenphase bieten wir die Produktion von Vor- und Kleinserien an. Auch hier wird mit seriennahen Werkstoffen gearbeitet und unter Verwendung der Datensätze und Werkzeuge der Prototypenphase, was für unsere Kunden einen weiteren Kostenvorteil bedeutet."

    const learnMoreButtons = document.querySelectorAll(".product-content .btn-outline")
    learnMoreButtons.forEach((button) => {
      button.textContent = "MEHR ERFAHREN "
      // Re-add the icon
      const icon = document.createElement("i")
      icon.setAttribute("data-lucide", "arrow-right")
      button.appendChild(icon)
      lucide.createIcons()
    })

    // Contact
    document.querySelector("#contact .section-title").textContent = "KONTAKT"

    const formLabels = document.querySelectorAll(".form-group label")
    formLabels[0].innerHTML = "Name"
    formLabels[1].innerHTML = 'Nachname <span class="required">*</span>'
    formLabels[2].innerHTML = 'E-Mail <span class="required">*</span>'
    formLabels[3].innerHTML = 'Nachricht <span class="required">*</span>'
    formLabels[4].innerHTML = "Ich stimme der Datenschutzerklärung zu"

    const errorMessages = document.querySelectorAll(".error-message")
    errorMessages.forEach((message) => {
      message.textContent = "Dieses Feld ist erforderlich"
    })
    errorMessages[errorMessages.length - 1].textContent = "Sie müssen der Datenschutzerklärung zustimmen"

    document.querySelector(".btn-rounded").textContent = "Nachricht senden"

    // Contact info
    const infoTitles = document.querySelectorAll(".info-item h3")
    infoTitles[0].innerHTML = '<i data-lucide="map-pin"></i> ADRESSE'
    infoTitles[1].innerHTML = '<i data-lucide="mail"></i> E-MAIL'
    infoTitles[2].innerHTML = '<i data-lucide="phone"></i> TELEFON'
    lucide.createIcons()

    const infoTexts = document.querySelectorAll(".info-item p")
    infoTexts[0].innerHTML = "Innungsstraße 60<br>13509 Berlin"
    infoTexts[1].textContent = "info@lichy-berlin.de"
    infoTexts[2].textContent = "030 / 414 16 12"

    // Footer
    const footerLinks = document.querySelectorAll(".footer-links a")
    footerLinks[0].textContent = "STARTSEITE"
    footerLinks[1].textContent = "PRODUKTE"
    footerLinks[2].textContent = "KONTAKT"

    document.querySelector(".footer-copyright p").textContent = "© 2025 Werner Lichy. Alle Rechte vorbehalten."
    document.querySelectorAll(".footer-legal-links a")[0].textContent = "Impressum"
    document.querySelectorAll(".footer-legal-links a")[1].textContent = "Datenschutzerklärung"
  }

  function translateToEnglish() {
    // Navigation
    document.querySelectorAll(".nav-link")[0].textContent = "HOME"
    document.querySelectorAll(".nav-link")[1].textContent = "ABOUT"
    document.querySelectorAll(".nav-link")[2].textContent = "PRODUCTS"
    document.querySelectorAll(".nav-link")[3].textContent = "CONTACT"

    // Hero
    const heroTitle = document.querySelector(".hero-title")
    heroTitle.innerHTML = '<span class="first-part">Precision</span><span class="second-part">Engineering</span>'
    heroTitle.classList.remove("german")
    heroTitle.classList.add("english")
    document.querySelector(".hero-subtitle").textContent = "FROM BERLIN"

    // About
    document.querySelector("#about .section-title").textContent = "ABOUT US"
    const aboutParagraphs = document.querySelectorAll("#about p")
    aboutParagraphs[0].textContent =
      "For over 40 years, we have been your competent partner for prototype development, model making, aluminum casting, and small series production. As a family-run company, quality, reliability, and personal support are at the center of everything we do. With state-of-the-art CNC machining, a high degree of flexibility, and an experienced team of highly qualified professionals, we implement your projects efficiently and precisely."
    aboutParagraphs[1].textContent =
      "Whether individual production or series manufacturing – we accompany you from the initial idea to the finished component and together find the best solution for your requirements in precision engineering and aluminum casting."

    // Products
    document.querySelector("#products .section-title").textContent = "OUR PRODUCTS"

    const productTitles = document.querySelectorAll(".product-content h3")
    productTitles[0].textContent = "PROTOTYPE DEVELOPMENT"
    productTitles[1].textContent = "ALUMINUM CASTING"
    productTitles[2].textContent = "SMALL SERIES PRODUCTION"

    const productDescriptions = document.querySelectorAll(".product-content p")
    productDescriptions[0].textContent =
      "We manufacture prototypes based on 3D CAD data. Model construction, mold creation, casting, as well as mechanical processing and quality assurance are all carried out under one roof."
    productDescriptions[1].textContent =
      "In our own foundry, we operate melting furnaces for aluminum alloys. With our specially developed casting process, we achieve wall thicknesses and surface structures of die-cast-like quality without significant price differences."
    productDescriptions[2].textContent =
      "Seamlessly following the results of the prototype phase, we offer the production of pre-series and small series. Here too, we work with production-grade materials and use the data sets and tools from the prototype phase, which means a further cost advantage for our customers."

    const learnMoreButtons = document.querySelectorAll(".product-content .btn-outline")
    learnMoreButtons.forEach((button) => {
      button.textContent = "LEARN MORE "
      // Re-add the icon
      const icon = document.createElement("i")
      icon.setAttribute("data-lucide", "arrow-right")
      button.appendChild(icon)
      lucide.createIcons()
    })

    // Contact
    document.querySelector("#contact .section-title").textContent = "CONTACT US"

    const formLabels = document.querySelectorAll(".form-group label")
    formLabels[0].innerHTML = "Name"
    formLabels[1].innerHTML = 'Surname <span class="required">*</span>'
    formLabels[2].innerHTML = 'Email <span class="required">*</span>'
    formLabels[3].innerHTML = 'Message <span class="required">*</span>'
    formLabels[4].innerHTML = "I agree to the data protection policy"

    const errorMessages = document.querySelectorAll(".error-message")
    errorMessages.forEach((message) => {
      message.textContent = "This field is required"
    })
    errorMessages[errorMessages.length - 1].textContent = "You must agree to the data protection policy"

    document.querySelector(".btn-rounded").textContent = "Send Message"

    // Contact info
    const infoTitles = document.querySelectorAll(".info-item h3")
    infoTitles[0].innerHTML = '<i data-lucide="map-pin"></i> ADDRESS'
    infoTitles[1].innerHTML = '<i data-lucide="mail"></i> EMAIL'
    infoTitles[2].innerHTML = '<i data-lucide="phone"></i> PHONE'
    lucide.createIcons()

    const infoTexts = document.querySelectorAll(".info-item p")
    infoTexts[0].innerHTML = "Innungsstraße 60<br>13509 Berlin"
    infoTexts[1].textContent = "info@lichy-berlin.de"
    infoTexts[2].textContent = "030 / 414 16 12"

    // Footer
    const footerLinks = document.querySelectorAll(".footer-links a")
    footerLinks[0].textContent = "HOME"
    footerLinks[1].textContent = "PRODUCTS"
    footerLinks[2].textContent = "CONTACT"

    document.querySelector(".footer-copyright p").textContent = "© 2025 Werner Lichy. All rights reserved."
    document.querySelectorAll(".footer-legal-links a")[0].textContent = "Legal Notice (Impressum)"
    document.querySelectorAll(".footer-legal-links a")[1].textContent = "Privacy Policy"
  }

  // Add class to the hero title based on current language
  const heroTitle = document.querySelector(".hero-title")
  if (isEnglish) {
    heroTitle.classList.add("english")
  } else {
    heroTitle.classList.add("german")
  }
})
