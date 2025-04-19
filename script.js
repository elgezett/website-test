document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  const lucide = window.lucide
  lucide.createIcons()

  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle")
  const nav = document.getElementById("nav")

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
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
  }

  // Language switcher
  const langToggle = document.getElementById("langToggle")
  const currentLang = document.querySelector(".current-lang")

  // Track current language state globally for use in other functions
  let isEnglish = false

  if (langToggle) {
    // Set initial language display
    currentLang.textContent = isEnglish ? "EN" : "DE"

    // Apply German language by default
    translateToGerman()

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

  // Add specific animation timing for hero elements
  const heroElements = document.querySelectorAll(".hero-content .animate-on-scroll")
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

  // Check animations on scroll
  window.addEventListener("scroll", checkAnimations)

  function checkAnimations() {
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

  // Enhanced parallax effect for all devices
  const parallaxSections = document.querySelectorAll(".parallax")

  // Apply parallax effect to all devices
  window.addEventListener("scroll", () => {
    parallaxSections.forEach((section) => {
      const distance = window.pageYOffset
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const windowHeight = window.innerHeight

      if (distance > sectionTop - windowHeight && distance < sectionTop + sectionHeight) {
        // Adjust parallax speed based on device width for better mobile experience
        const isMobile = window.innerWidth <= 768
        const parallaxSpeed = isMobile ? 0.15 : 0.3 // Slower on mobile for better effect

        const yPos = (distance - sectionTop) * parallaxSpeed
        section.style.backgroundPosition = `center ${yPos}px`
      }
    })
  })

  // Language translation functions
  function translateToGerman() {
    // Navigation
    document.querySelectorAll(".nav-link")[0].textContent = "STARTSEITE"
    document.querySelectorAll(".nav-link")[1].textContent = "ÜBER UNS"
    document.querySelectorAll(".nav-link")[2].textContent = "PRODUKTE"
    document.querySelectorAll(".nav-link")[3].textContent = "KONTAKT"

    // Hero
    document.querySelector(".hero-title").textContent = "PRÄZISIONSTECHNIK"
    document.querySelector(".hero-subtitle").textContent = "MADE IN GERMANY"

    // About
    document.querySelector("#about .section-title").textContent = "ÜBER UNS"
    const aboutParagraphs = document.querySelectorAll("#about p")
    aboutParagraphs[0].textContent =
      "Seit über 40 Jahren sind wir Ihr kompetenter Ansprechpartner für Prototypen, Aluminiumguss und die Fertigung von Kleinserien. Als familiengeführtes Unternehmen stehen bei uns Qualität, Verlässlichkeit und persönliche Betreuung im Mittelpunkt. Mit modernster Fertigungstechnik, einem hohen Maß an Flexibilität und einem erfahrenen Team aus hochqualifizierten Fachkräften setzen wir Ihre Projekte effizient und präzise um."
    aboutParagraphs[1].textContent =
      "Ob Einzelanfertigung oder Serienproduktion – wir begleiten Sie von der ersten Idee bis zum fertigen Bauteil und finden gemeinsam die beste Lösung für Ihre Anforderungen."

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
    document.querySelector(".hero-title").textContent = "PRECISION ENGINEERING"
    document.querySelector(".hero-subtitle").textContent = "MADE IN GERMANY"

    // About
    document.querySelector("#about .section-title").textContent = "ABOUT US"
    const aboutParagraphs = document.querySelectorAll("#about p")
    aboutParagraphs[0].textContent =
      "For over 40 years, we have been your competent partner for prototypes, aluminum casting, and small series production. As a family-run company, quality, reliability, and personal support are at the center of everything we do. With state-of-the-art manufacturing technology, a high degree of flexibility, and an experienced team of highly qualified professionals, we implement your projects efficiently and precisely."
    aboutParagraphs[1].textContent =
      "Whether individual production or series manufacturing – we accompany you from the initial idea to the finished component and together find the best solution for your requirements."

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
})
