/* ==========================================================================
   MDPL Immigration - Scripts partagés
   ========================================================================== */

(function() {
  'use strict';

  // ==========================================================================
  // Mobile nav toggle
  // ==========================================================================
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
    });
  }

  // ==========================================================================
  // Dropdown (desktop = hover handled in CSS, mobile = click to expand)
  // ==========================================================================
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('a');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      // Only intercept the click on mobile (where the dropdown is in vertical layout)
      if (window.innerWidth <= 860) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
      // On desktop, the link works normally (goes to the services overview page)
    });
  });

  // Close mobile nav when clicking a final link
  document.querySelectorAll('.site-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      // Don't close nav if it's a dropdown trigger on mobile
      const isDropdownTrigger = link.parentElement.classList.contains('nav-dropdown');
      if (isDropdownTrigger && window.innerWidth <= 860) return;
      if (siteNav) siteNav.classList.remove('open');
    });
  });

  // ==========================================================================
  // FAQ accordion
  // ==========================================================================
  document.querySelectorAll('.faq-question').forEach(button => {
    const item = button.closest('.faq-item');
    const answer = item ? item.querySelector('.faq-answer') : null;
    if (!answer) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', isOpen);
      const toggle = button.querySelector('.faq-toggle');
      if (toggle) toggle.textContent = isOpen ? '−' : '+';
      answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
    });
  });

  // ==========================================================================
  // Highlight active nav link based on current page
  // ==========================================================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav > a, .nav-dropdown > a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
      // If link is inside a dropdown menu, also mark the dropdown parent
      const dropdown = link.closest('.nav-dropdown');
      if (dropdown) dropdown.classList.add('active');
    }
  });

  // Also handle when a service page is open: highlight "Nos services" parent
  const serviceFiles = [
    'residence-permanente.html',
    'permis-etudes.html',
    'permis-travail.html',
    'visa-visiteur-ave.html',
    'parrainage-regroupement-familial.html',
    'travailleurs-etrangers-temporaires.html'
  ];
  if (serviceFiles.includes(currentPage)) {
    const servicesNav = document.querySelector('.nav-dropdown');
    if (servicesNav) servicesNav.classList.add('active');
  }

  // ==========================================================================
  // Contact form — Formspree AJAX
  // ==========================================================================
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var formStatus = document.getElementById('form-status');
    var sendBtn = document.getElementById('btn-send');

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      sendBtn.disabled = true;
      sendBtn.textContent = 'Envoi en cours…';
      if (formStatus) {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
      }

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
      .then(function(response) {
        if (response.ok) {
          contactForm.reset();
          if (formStatus) {
            formStatus.className = 'form-status form-status--success';
            formStatus.textContent = 'Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.';
          }
        } else {
          return response.json().then(function(data) {
            throw new Error(data.error || 'Erreur serveur');
          });
        }
      })
      .catch(function() {
        if (formStatus) {
          formStatus.className = 'form-status form-status--error';
          formStatus.innerHTML = 'Une erreur s\'est produite. Veuillez nous écrire directement à <a href="mailto:info@mdplimmigration.com">info@mdplimmigration.com</a>.';
        }
      })
      .finally(function() {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Envoyer le message';
      });
    });
  }

  // ==========================================================================
  // Blog search
  // ==========================================================================
  const searchInput = document.querySelector('.search-form input');
  const searchButton = document.querySelector('.search-form button');
  const searchTags = document.querySelectorAll('.search-tag');
  const searchResultsEl = document.getElementById('search-results');
  const articlesSection = document.getElementById('articles');

  if (searchInput && searchButton && searchResultsEl) {

    function escHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function normalizeStr(str) {
      return str.toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .trim();
    }

    function getArticlesData() {
      return Array.from(document.querySelectorAll('#articles article')).map(function(article) {
        const tagEl = article.querySelector('.article-tag');
        const titleEl = article.querySelector('.article-featured-title, .article-card-sm-title, .article-card-bottom-title');
        const excerptEl = article.querySelector('.article-featured-excerpt, .article-card-sm-excerpt, .article-card-bottom-excerpt');
        const kwEls = article.querySelectorAll('.kw');
        const linkEl = article.querySelector('a[href]');

        return {
          tag: tagEl ? tagEl.textContent.trim() : '',
          tagClass: tagEl ? tagEl.className : 'article-tag',
          title: titleEl ? titleEl.textContent.trim() : '',
          excerpt: excerptEl ? excerptEl.textContent.trim() : '',
          keywords: Array.from(kwEls).map(function(kw) { return kw.textContent.trim(); }),
          link: linkEl ? linkEl.getAttribute('href') : 'contact.html'
        };
      });
    }

    function matchesQuery(article, query) {
      var q = normalizeStr(query);
      var haystack = [article.tag, article.title, article.excerpt]
        .concat(article.keywords)
        .map(normalizeStr)
        .join(' ');
      return haystack.indexOf(q) !== -1;
    }

    function resetSearch() {
      searchInput.value = '';
      searchResultsEl.classList.add('hidden');
      searchResultsEl.innerHTML = '';
      if (articlesSection) articlesSection.style.display = '';
    }

    function runSearch(query) {
      query = query.trim();
      if (!query) {
        resetSearch();
        return;
      }

      var articles = getArticlesData();
      var matched = articles.filter(function(a) { return matchesQuery(a, query); });

      if (articlesSection) articlesSection.style.display = 'none';
      searchResultsEl.classList.remove('hidden');

      var count = matched.length;
      var html = '<div class="search-results-header">'
        + '<p class="search-results-title">Résultats de recherche</p>'
        + '<p class="search-results-info">'
        + count + ' article' + (count !== 1 ? 's' : '') + ' trouvé' + (count !== 1 ? 's' : '') + ' pour '
        + '<strong>« ' + escHtml(query) + ' »</strong>'
        + ' — <button type="button" id="search-clear" style="background:none;border:none;color:var(--gold);font-family:\'Jost\',sans-serif;font-size:0.85rem;font-weight:600;cursor:pointer;padding:0;text-decoration:underline;">Réinitialiser</button>'
        + '</p></div>';

      if (count === 0) {
        html += '<div class="search-empty">'
          + '<p class="search-empty-text">Aucun article ne correspond à <strong>« ' + escHtml(query) + ' »</strong>.<br>Essayez un autre mot-clé ou consultez toutes les catégories.</p>'
          + '</div>';
      } else {
        html += '<div class="search-results-list">';
        matched.forEach(function(a) {
          var kws = a.keywords.map(function(kw) {
            return '<span class="kw dark">' + escHtml(kw) + '</span>';
          }).join('');
          html += '<div class="search-result-item">'
            + '<span class="' + escHtml(a.tagClass) + '" style="display:inline-block;margin-bottom:0.6rem;">' + escHtml(a.tag) + '</span>'
            + '<p class="search-result-title">' + escHtml(a.title) + '</p>'
            + '<p class="search-result-desc">' + escHtml(a.excerpt) + '</p>'
            + '<div class="article-kw" style="margin-bottom:1rem;">' + kws + '</div>'
            + '<a href="' + escHtml(a.link) + '" class="search-result-link">Lire l\'article</a>'
            + '</div>';
        });
        html += '</div>';
      }

      searchResultsEl.innerHTML = html;

      var clearBtn = document.getElementById('search-clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', resetSearch);
      }
    }

    searchButton.addEventListener('click', function() {
      runSearch(searchInput.value);
    });

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        runSearch(searchInput.value);
      }
    });

    searchTags.forEach(function(tag) {
      tag.addEventListener('click', function() {
        searchInput.value = tag.textContent.trim();
        runSearch(searchInput.value);
        var searchSection = document.getElementById('site-search');
        if (searchSection) {
          searchSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Category cards: intercept click, fill search, scroll
    document.querySelectorAll('.cat-card[data-search]').forEach(function(card) {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        var q = card.getAttribute('data-search');
        searchInput.value = q;
        runSearch(q);
        var searchSection = document.getElementById('site-search');
        if (searchSection) {
          searchSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Handle ?q= URL parameter on page load
    var urlParams = new URLSearchParams(window.location.search);
    var qParam = urlParams.get('q');
    if (qParam) {
      searchInput.value = qParam;
      runSearch(qParam);
    }
  }

})();

/* ==========================================================================
   MDPL — i18n bilingue (FR / EN)
   ========================================================================== */
(function () {
  'use strict';

  // ── Traductions EN pour éléments data-i18n ────────────────────────────────
  var EN = {
    // --- Titres de pages ---
    'index.page.title':   'MDPL Immigration — Canadian Immigration Consulting Firm | Laval',
    'services.page.title':'Our Services — MDPL Immigration | Six Canadian Immigration Services',
    'history.page.title': 'Our Story — MDPL Immigration | Canadian Immigration Consulting Firm',
    'contact.page.title': 'Contact Us — MDPL Immigration | Laval, Quebec',
    'why.page.title':     'Why MDPL Immigration | Laval Immigration Consulting Firm',

    // --- INDEX : hero ---
    'index.hero.label':  'Canadian Immigration Consulting Firm',
    'index.hero.title':  'Your future<br />in Canada,',
    'index.hero.italic': 'guided with expertise.',
    'index.hero.desc':   'Since 2015, MDPL Immigration has guided individuals, families, and employers through their Canadian immigration processes with a human, strategic, and transparent approach.',
    'index.hero.btn1':   'Discover Our Services',
    'index.hero.btn2':   'Book an Appointment',

    // --- INDEX : notre histoire (aperçu) ---
    'index.about.eyebrow': 'Our Story',
    'index.about.title':   'A <em>human</em> and strategic approach to Canadian immigration',
    'index.about.lead':    'Founded in <strong>Laval in 2015</strong>, MDPL Immigration supports individuals, families, and employers in their Canadian immigration processes with an approach built on transparency, rigour, and human care.',
    'index.about.p1':      'Since our founding, we have handled more than 600 files related to various Canadian immigration programs: study permits, work permits, visitor visas, family sponsorships, family reunifications, permanent residence applications, and temporary foreign worker processes.',
    'index.about.p2':      'But behind every file, there is above all <strong>a human story</strong>. Some people want to reunite with their spouse after years of separation. Others want to provide a more stable future for their children or pursue their studies in Canada.',
    'index.about.link':    'Read Our Full Story',
    'index.caption':       'MDPL Immigration · Laval, Quebec',

    // --- INDEX : services ---
    'index.services.eyebrow': 'Our Services',
    'index.services.title':   'Services tailored to <em>every</em> immigration project',
    'index.services.lead':    'Whether you want to study, work, visit Canada, or reunite with loved ones, our firm guides you at every step of your Canadian immigration process.',
    'index.services.cta.p':   'Is your situation different or complex? We evaluate every file with care.',
    'index.services.cta.btn': 'Request an Assessment',

    // --- INDEX : pourquoi MDPL ---
    'index.why.eyebrow': 'Why MDPL Immigration',
    'index.why.title':   'A reputation built on <em>quality</em> and trust',
    'index.why.lead':    'Over the years, MDPL Immigration has developed a distinctive approach, founded on values that guide every decision and every file we handle.',
    'index.why1': '<strong>Clear communication</strong>We explain every step, every requirement, and every decision in accessible language, without administrative jargon.',
    'index.why2': '<strong>A human approach</strong>Behind every file is a story, a life project, and a family. We take this into account at every stage.',
    'index.why3': '<strong>Strategic preparation</strong>Every file is thoroughly analyzed to identify the best strategy before any submission to the authorities.',
    'index.why4': '<strong>Personalized support</strong>No situation is handled in a standardized way. We adapt our services to your reality.',
    'index.why.badge':   'By Your Side Since 2015',
    'index.why.link':    'Discover All Our Values',

    // --- INDEX : processus ---
    'index.process.eyebrow': 'Our Process',
    'index.process.title':   'How <em>your process</em> unfolds',
    'index.process.lead':    'From the first meeting to the final decision, we guide you at every step with method and transparency.',

    // --- INDEX : CTA ---
    'index.cta.title': 'Ready to start your <em>immigration project</em>?',
    'index.cta.desc':  'Book a consultation to discuss your situation and get an honest assessment of your options.',

    // --- Cartes services (partagées index + nos-services) ---
    'svc.s1.num':   'Service 01',
    'svc.s1.title': 'Permanent Residence',
    'svc.s1.desc.short': 'Express Entry, Quebec programs, provincial nominees. Assessment, strategy, and full follow-up through to the final IRCC decision.',
    'svc.s1.desc.long':  'Assessment of your eligibility for various federal and Quebec programs: Express Entry, PCP, PRTQ, PEQ, sponsorship leading to PR. Strategic file preparation and follow-up through to the final decision.',
    'svc.s2.num':   'Service 02',
    'svc.s2.title': 'Study Permit',
    'svc.s2.desc.short': 'CAQ for studies, federal study permit, proof of funds, study plan, extensions, and post-graduation work permit (PGWP).',
    'svc.s2.desc.long':  'Support for international students: CAQ for studies, acceptance letter, proof of funds, study plan, application submission, extensions, and post-graduation work permit (PGWP).',
    'svc.s3.num':   'Service 03',
    'svc.s3.title': 'Work Permit',
    'svc.s3.desc.short': 'Closed permits (with LMIA), open permits, francophone mobility, international mobility programs, spousal permits, and PGWP.',
    'svc.s3.desc.long':  'Open or closed work permits, francophone mobility, trade agreements, intra-company transfers, post-graduation permits, spousal permits. Analysis of your situation and selection of the most suitable program.',
    'svc.s4.num':   'Service 04',
    'svc.s4.title': 'Visitor Visa & eTA',
    'svc.s4.desc.short': 'Temporary resident visa (TRV), electronic travel authorization (eTA), super visa, and extensions of stay in Canada.',
    'svc.s4.desc.long':  'Temporary resident visa (TRV) applications, electronic travel authorization (eTA), extension of stay, super visa for parents and grandparents, restoration of status.',
    'svc.s5.num':   'Service 05',
    'svc.s5.title': 'Sponsorship & Family Reunification',
    'svc.s5.desc.short': 'Sponsorship of spouse, common-law partner, dependent children, parents, and grandparents. Sponsorship undertaking in Quebec.',
    'svc.s5.desc.long':  'Sponsorship of spouse, common-law partner, dependent children, parents, and grandparents. Thorough preparation of relationship proof and the complete file, including the Quebec sponsorship undertaking.',
    'svc.s6.num':   'Service 06',
    'svc.s6.title': 'Temporary Foreign Workers',
    'svc.s6.desc.short': 'For employers: Labour Market Impact Assessment (LMIA), compliance, international recruitment, and HR support for hiring foreign talent.',
    'svc.s6.desc.long':  'For employers: Labour Market Impact Assessment (LMIA), compliance, international recruitment, francophone mobility, and HR support for hiring foreign talent.',

    // --- Étapes processus (partagées) ---
    'proc.p1.title': 'Initial Consultation',
    'proc.p1.desc':  'In-depth analysis of your personal, professional, and family situation to identify possible options.',
    'proc.p2.title': 'Personalized Strategy',
    'proc.p2.desc':  'Development of a clear strategy tailored to your profile, including the most relevant program and expected timeline.',
    'proc.p3.title': 'File Preparation',
    'proc.p3.desc':  'Thorough preparation of all documents, forms, and evidence needed to support your application.',
    'proc.p4.title': 'Follow-up to Decision',
    'proc.p4.desc':  'Official submission, ongoing follow-up with the authorities, responses to additional requests, and support through to the outcome.',

    // --- NOS-SERVICES page ---
    'services.bc.current':      'Our Services',
    'services.hero.eyebrow':    'Our Services',
    'services.hero.title':      'Services tailored to <em>every</em> immigration project',
    'services.hero.subtitle':   'Whether you want to study, work, visit, settle, or sponsor.',
    'services.hero.desc':       'Our firm supports individuals, families, and employers in all Canadian immigration processes. From the initial consultation to file follow-up, we bring over 10 years of experience and an approach built on rigour, transparency, and respect.',
    'services.intro.lead':      'The Canadian immigration system includes dozens of different programs, each with its own criteria, timelines, and nuances. Choosing the right path from the start can make all the difference in the success of an immigration project.',
    'services.intro.p':         'At MDPL Immigration, we handle a wide variety of files, which gives us a comprehensive view of the system. For each client, we take the time to understand their life goals, assess possible options, and choose together the most suitable approach. Below is an overview of the six main service categories we offer.',
    'services.grid.eyebrow':    'Our Six Main Services',
    'services.grid.title':      'Explore <em>each service</em> in detail',
    'services.grid.lead':       'Click on each service to discover the programs we handle, the key elements of your file, and how we support you.',
    'services.cta.p':           "Is your situation different, complex, or doesn't fit any of these services? We evaluate every file individually.",
    'services.cta.btn':         'Request a Personalized Assessment',
    'services.process.eyebrow': 'Our Process',
    'services.process.title':   'How <em>your process</em> unfolds',
    'services.process.lead':    'Regardless of the chosen service, our approach remains the same: rigour, transparency, and support at every step.',
    'services.cta2.title':      'Ready to start your <em>immigration project</em>?',
    'services.cta2.desc':       'Book a consultation to discuss your situation and get an honest assessment of your options.',

    // --- NOTRE HISTOIRE page ---
    'history.bc.current':   'Our Story',
    'history.hero.eyebrow': 'Our Story',
    'history.hero.title':   'A <em>human</em> and strategic approach to Canadian immigration',
    'history.hero.subtitle':'MDPL Immigration, since 2015.',
    'history.hero.desc':    'Discover the story of a firm founded in Laval, now supporting clients from more than 40 countries in their immigration journey to Canada.',
    'history.lead':         'Founded in <strong>Laval in 2015</strong>, MDPL Immigration supports individuals, families, and employers in their Canadian immigration processes with an approach based on transparency, rigour, and human care.',
    'history.p1':           'Since our founding, we have handled more than <strong>600 files</strong> related to various Canadian immigration programs, including study permits, work permits, visitor visas, family sponsorships, family reunifications, permanent residence applications, and temporary foreign worker processes.',
    'history.pullquote1':   'But behind every file, there is above all a human story.',
    'history.p2':           'Some people want to reunite with their spouse after years of separation. Others want to provide a more stable future for their children, pursue their studies in Canada, or simply achieve a better quality of life. Many of our clients also come to us after experiencing refusals, significant delays, or particularly stressful situations.',
    'history.p3':           'We know that an immigration application can have a major impact on an entire family. An error, an incomplete document, or a poorly adapted strategy can have serious consequences. That is why we take the time to <strong>analyze every situation carefully</strong> before any submission to Canadian authorities.',
    'history.h2.1':         'Beyond administrative forms',
    'history.p4':           'At MDPL Immigration, we believe that good support goes well beyond administrative forms. We take the time to listen, understand your situation, and identify the best options based on your reality. Every file is prepared with care to offer a clear, complete, and professional presentation.',
    'history.p5':           'Our firm now supports clients from <strong>more than 40 countries</strong> and continues each year to help people who want to immigrate, study, work, or reunite with their family in Canada.',
    'history.h2.2':         'Constantly evolving expertise',
    'history.p6':           'We know that Canadian immigration can be complex and sometimes difficult to understand. Laws change, requirements increase, and procedures are constantly evolving. That is why we place great importance on <strong>continuing education</strong> and keeping our Canadian immigration knowledge up to date.',
    'history.h2.3':         'A reputation built over the years',
    'history.p7':           'Over the years, MDPL Immigration has developed a reputation based on:',
    'history.ul':           '<li>clear <strong>communication</strong>;</li><li>a <strong>human approach</strong>;</li><li>strategic <strong>file preparation</strong>;</li><li><strong>personalized support</strong>;</li><li><strong>respect</strong> for clients and their reality;</li><li>the <strong>quality</strong> of services provided.</li>',
    'history.p8':           'We believe that an informed client makes better decisions. That is why we favour transparency at every stage of the process. Our goal is to support you professionally while offering an accessible and human service.',
    'history.h2.4':         'Our mission, today as always',
    'history.p9':           'Today, MDPL Immigration continues to support clients around the world with the same mission as at its founding: <strong>helping every person move forward toward their Canadian life project with confidence and peace of mind</strong>.',
    'history.pullquote2':   'Because beyond the procedures and documents, every application represents a real project, significant sacrifices, and a future that deserves to be taken seriously.',
    'history.btn1':         'Contact Us',
    'history.btn2':         'Our Services',
    'history.caption':      'MDPL Immigration · Laval, Quebec',
    'history.cta.title':    'Entrust your project to a team <em>that takes the time</em>',
    'history.cta.desc':     'Book a consultation to discuss your situation. We will take the time to listen, understand, and present realistic options.',

    // --- CONTACT page ---
    'contact.bc.current':      'Contact Us',
    'contact.hero.eyebrow':    'Contact Us',
    'contact.hero.title':      "Let’s discuss <em>your project</em>",
    'contact.hero.subtitle':   'An initial consultation to assess your options.',
    'contact.hero.desc':       'Whether you are at the exploration stage or ready to begin your immigration process, our team is here to guide you. Reach us by phone, email, or use the form below to describe your situation.',
    'contact.info.eyebrow':    'Office Contact Information',
    'contact.info.title':      'Several ways to <em>reach us</em>',
    'contact.info.lead':       'We respond to all messages as soon as possible. For a faster response, we invite you to call or book an appointment online.',
    'contact.card1.label':     'Phone',
    'contact.card1.hours':     'Available Monday to Friday, 9 a.m. to 5 p.m. (Eastern Time).',
    'contact.card2.label':     'Email',
    'contact.card2.desc':      'For a written question or to send us documents.',
    'contact.card3.label':     'Address',
    'contact.card3.desc':      'By appointment only. Click the address to open Google Maps.',
    'contact.card4.label':     'Online Booking',
    'contact.card4.link':      'Book Now →',
    'contact.card4.desc':      'Choose your preferred time slot through our Setmore booking system.',
    'contact.form.eyebrow':    'Write to Us',
    'contact.form.title':      'Tell us about your <em>project</em>',
    'contact.form.desc':       'Fill out this form to describe your situation and immigration project. The more information you provide, the more precise and relevant our response will be.',
    'contact.detail.phone':    'Phone',
    'contact.detail.email':    'Email',
    'contact.detail.address':  'Address',
    'contact.detail.hours':    'Hours',
    'contact.detail.hours.val':'Monday to Friday · 9 a.m. to 5 p.m. (Eastern Time)',
    'contact.form.name.label': 'Full name',
    'contact.form.email.label':'Email',
    'contact.form.phone.label':'Phone',
    'contact.form.svc.label':  'Service of interest',
    'contact.form.msg.label':  'Your message',
    'contact.form.submit':     'Send Message',
    'contact.form.consent':    'By submitting this form, you agree that we may use your contact details to respond to your inquiry. Your information is never shared with third parties.',
    'contact.map.eyebrow':     'Find Us',
    'contact.map.title':       'In the heart of <em>Laval</em>',
    'contact.map.desc':        "Our office is located on Boulevard de l’Avenir, near Carrefour Laval and Montmorency metro station. On-site parking available.",

    // --- POURQUOI MDPL page ---
    'why.bc.current':       'Why MDPL',
    'why.hero.eyebrow':     'Why MDPL Immigration',
    'why.hero.title':       'A reputation built on <em>quality</em> and trust',
    'why.hero.subtitle':    '10 years by your side, more than 600 files handled.',
    'why.hero.desc':        'Since 2015, our firm has developed a distinctive approach to Canadian immigration. Discover the six values that guide every decision and every file we handle, and that explain why our clients entrust us with their life project.',
    'why.intro.lead':       'Choosing an immigration consultant means entrusting one of the most important projects of your life to a team you do not yet know. That is why we value transparency about what guides our firm every day.',
    'why.intro.p':          'Over the years, MDPL Immigration has built a reputation on six clear commitments. These values are not just words on a wall: they are the principles that concretely guide every consultation, every file, and every interaction with our clients.',
    'why.values.eyebrow':   'Our Six Commitments',
    'why.values.title':     'What sets us <em>apart</em>',
    'why.v1': '<strong>Clear communication</strong>We explain every step, every requirement, and every decision in accessible language, without administrative jargon.',
    'why.v2': '<strong>A human approach</strong>Behind every file is a story, a life project, and a family. We take this into account at every stage.',
    'why.v3': '<strong>Strategic preparation</strong>Every file is thoroughly analyzed to identify the best strategy before any submission to the authorities.',
    'why.v4': '<strong>Personalized support</strong>No situation is handled in a standardized way. We adapt our services to your reality.',
    'why.v5': '<strong>Respect for the client</strong>We give sincere attention to every person who trusts us, regardless of the complexity of the file.',
    'why.v6': '<strong>Continuing education</strong>Immigration laws and procedures are constantly evolving. We invest in continuously updating our knowledge.',
    'why.badge':            'By Your Side Since 2015',
    'why.h2.1':             '1. <em>Clear communication</em>, from start to finish',
    'why.p1.1':             'Canadian immigration is a technical field. Acronyms (IRCC, MIFI, LMIA, CSQ, PGWP, eTA, CRS), programs, and forms make up a language that most applicants do not know. And there is no reason they should.',
    'why.p1.2':             'Our role is to translate this administrative language into accessible explanations. When we explain a requirement, you must understand it. When we make a strategic decision, you must know why. When a timeline changes, you must be informed and know what it means for you.',
    'why.h2.2':             '2. A <em>human approach</em>, because every file is unique',
    'why.p2.1':             'We say it often: behind every file, there is a human story. A family separated by borders. A student dreaming of a better future. An employer who needs a specific talent to grow their business. A couple who finally wants to be together.',
    'why.p2.2':             'This human dimension never makes us forget the necessary technical rigour. On the contrary: it is precisely because these projects matter that we treat them with such seriousness.',
    'why.h2.3':             '3. <em>Strategic preparation</em> before every submission',
    'why.p3.1':             'An immigration application should never be filed on impulse. Before any submission to federal or provincial authorities, we take the time to analyze the profile from every angle, assess possible programs, and choose, with you, the most advantageous path.',
    'why.p3.2':             'This preparation may take time. But it avoids costly mistakes and preventable refusals. It also allows, in many cases, identifying options the applicant would not have considered.',
    'why.h2.4':             '4. <em>Personalized support</em>, not a standardized service',
    'why.p4.1':             'No two files are exactly alike. Two applicants in the same program, with similar profiles, may require very different strategies depending on their family situation, long-term goals, travel history, or financial capacity.',
    'why.p4.2':             'We therefore adapt our services to each reality. A student preparing their first permit does not have the same needs as an international executive transferred to Canada. A couple in family reunification does not experience the same thing as an employer in the middle of a recruitment campaign.',
    'why.h2.5':             '5. <em>Respect for the client</em>, regardless of file complexity',
    'why.p5.1':             'Some files are simple. Others are formidably complex: previous refusals, medical situations, criminal history, prolonged separation, difficult documents to obtain, etc. In all cases, we give the same attention, seriousness, and respect to every client.',
    'why.p5.2':             'We firmly believe that an immigration project deserves to be handled with dignity, even — and especially — when it goes off the beaten path.',
    'why.h2.6':             '6. <em>Continuing education</em>, because the rules change',
    'why.p6.1':             'Canadian immigration policies are constantly evolving. Annual caps, adjustments to language requirements, new exemption categories, PGWP modifications, provincial adjustments: failing to follow these changes risks advising a client based on outdated rules.',
    'why.p6.2':             'We invest in continuing education. We regularly consult official sources from IRCC, MIFI, and relevant provinces. We stay up to date on changes in immigration officer practices. This is what allows us to advise you accurately.',
    'why.pullquote':        'We believe an informed client makes better decisions. That is why we favour transparency at every stage of the process.',
    'why.btn1':             'Contact Us',
    'why.btn2':             'Book an Appointment',
    'why.cta.title':        'A team that takes your project <em>seriously</em>',
    'why.cta.desc':         'Book a consultation to discover how we can concretely support your immigration process.',

    // ── RÉSIDENCE PERMANENTE ────────────────────────────────────────────────
    'rp.page.title':   'Permanent Residence — MDPL Immigration | Express Entry, PEQ, PRTQ',
    'rp.bc.current':   'Permanent Residence',
    'rp.hero.eyebrow': 'Service 01 · Permanent Immigration',
    'rp.hero.title':   'Permanent Residence <em>in Canada</em>',
    'rp.hero.subtitle':'Building your life here, on solid foundations.',
    'rp.hero.desc':    'Permanent residence is much more than an administrative status. It is the opportunity to settle in Canada permanently, work anywhere in the country, access health care, and eventually envision Canadian citizenship. MDPL Immigration guides you in choosing and preparing the program best suited to your profile.',
    'rp.intro.lead':   'Becoming a Canadian permanent resident is a major step in a life project. Several pathways exist, each with its own criteria, timelines, and requirements. Choosing the right program from the start can make all the difference between a smooth process and a path full of obstacles.',
    'rp.intro.p1':     'At MDPL Immigration, we take the time to analyze your profile as a whole: education, work experience, languages, family situation, professional project, and desired settlement location. This analysis allows us to identify the programs you are eligible for and to choose, with you, the one offering the best chances of success.',
    'rp.intro.p2':     'We clearly explain what each program involves, the realistic timelines to expect, and what will be required of you throughout the process. No surprises. No unnecessary jargon.',
    'rp.programs.h2':  'The main programs <em>for permanent residence</em>',
    'rp.programs.p':   'Canada offers several pathways to obtain permanent residence, each suited to different profiles. Here are the programs we handle regularly.',
    'rp.f1.title':     'Express Entry',
    'rp.f1.desc':      'Federal system managing three economic programs: Federal Skilled Workers (FSW), Federal Skilled Trades (FST), and Canadian Experience Class (CEC). Profiles are ranked using the Comprehensive Ranking System (CRS).',
    'rp.f2.title':     'Provincial Nominee Programs (PNP)',
    'rp.f2.desc':      'Each Canadian province has its own selection streams (Ontario, British Columbia, Alberta, etc.). A provincial nomination provides a significant advantage in the federal process.',
    'rp.f3.title':     'Quebec Regular Skilled Worker Program (QSWP)',
    'rp.f3.desc':      'Managed through Arrima, this Quebec program leads to the Quebec Selection Certificate (CSQ), the first step toward federal permanent residence for candidates wishing to settle in Quebec.',
    'rp.f4.title':     'Quebec Experience Program (PEQ)',
    'rp.f4.desc':      'Accelerated stream for Quebec graduates and temporary workers who have gained qualified work experience in the province. French language knowledge required.',
    'rp.f5.title':     'Family Sponsorship Leading to PR',
    'rp.f5.desc':      'A Canadian citizen or permanent resident can sponsor their spouse, children, or parents. See our <a href="parrainage-regroupement-familial.html" style="color: var(--gold); font-weight: 600;">family sponsorship</a> page for full details.',
    'rp.f6.title':     'Humanitarian and Compassionate Applications',
    'rp.f6.desc':      'In certain exceptional situations, an application based on humanitarian and compassionate grounds can be submitted. These files require particularly thorough preparation.',
    'rp.howwe.h2':     'How <em>MDPL Immigration</em> can help you',
    'rp.howwe.p1':     'Choosing a permanent residence program without guidance is a bit like preparing a long journey without a map. Each program has its nuances, and a strategy that works for one person may be unsuitable for another.',
    'rp.howwe.p2':     'We guide you at every step:',
    'rp.howwe.ul':     '<li><strong>Eligibility assessment</strong>: complete analysis of your profile to identify the programs you are eligible for.</li><li><strong>Strategic program selection</strong>: we discuss the advantages, disadvantages, and timelines of each option.</li><li><strong>File preparation</strong>: thorough compilation of all documents (diplomas, experience, languages, civil status, etc.).</li><li><strong>Submission and follow-up</strong>: official submission to authorities, ongoing follow-up, and response to additional requests.</li><li><strong>Settlement preparation</strong>: once residence is obtained, we guide you on the settlement steps.</li>',
    'rp.infobox.title':'Good to know',
    'rp.infobox.p':    'Language requirements (English and/or French), educational assessments (ECA), and proof of work experience are almost always required for economic programs. Anticipating these steps, which can take several months, often saves valuable time in the overall process.',
    'rp.btn1':         'Request an Assessment',
    'rp.btn2':         'Book an Appointment',
    'rp.cta.title':    "Let's discuss your <em>permanent residence</em> project",
    'rp.cta.desc':     'Every journey is different. An initial consultation allows us to assess your options and build a realistic strategy for your profile.',

    // ── PERMIS ÉTUDES ───────────────────────────────────────────────────────
    'pe.page.title':   "Study Permit — MDPL Immigration | CAQ and Study Permit Canada",
    'pe.bc.current':   "Study Permit",
    'pe.hero.eyebrow': 'Service 02 · Studies in Canada',
    'pe.hero.title':   'Study Permit <em>in Canada</em>',
    'pe.hero.subtitle':'Building a coherent and solid study project.',
    'pe.hero.desc':    'Studying in Canada opens doors to real professional opportunities: post-graduation work permits, professional networks, and in many cases, a pathway to permanent residence. MDPL Immigration helps you build a complete, credible, and well-argued study file.',
    'pe.intro.lead':   'A study permit is not simply a form to fill out. It is a file where every piece matters: acceptance letter from a designated learning institution, proof of financial capacity, coherent study plan, and clearly explained intentions to return. An incomplete or poorly structured file leads to refusals, which are often avoidable.',
    'pe.intro.p1':     'Our firm assists students from around the world in preparing their study permit applications. We help you articulate a solid study project, choose the right documents, and anticipate the questions that IRCC officers will ask when reviewing your file.',
    'pe.quebec.h2':    'Studying in Quebec or elsewhere in Canada?',
    'pe.quebec.p1':    'To study in <strong>Quebec</strong>, two authorizations are required:',
    'pe.quebec.ul':    '<li>the <strong>Certificat d\'acceptation du Québec (CAQ) for studies</strong>, issued by the Quebec government;</li><li>the federal <strong>study permit</strong>, issued by Immigration, Refugees and Citizenship Canada (IRCC).</li>',
    'pe.quebec.p2':    'To study in other Canadian provinces, only the federal study permit is required (with, for some provinces, a provincial attestation letter).',
    'pe.keys.h2':      'The key elements <em>of your file</em>',
    'pe.f1.title':     'Acceptance Letter',
    'pe.f1.desc':      'From a designated learning institution (DLI). The choice of institution and program must be consistent with your previous background and professional goals.',
    'pe.f2.title':     'Proof of Financial Capacity',
    'pe.f2.desc':      'Demonstrating that you can pay tuition, living expenses, and support for any accompanying family members. Required amounts are regularly updated by IRCC.',
    'pe.f3.title':     'Study Plan and Intentions',
    'pe.f3.desc':      'A well-written explanatory letter is often decisive. It must demonstrate the coherence of the project, its career benefits, and your ties to your home country.',
    'pe.f4.title':     'Civil Documents and Background',
    'pe.f4.desc':      'Passport, academic records, certificates, language test results (IELTS, TEF, etc.), and sometimes a medical examination and police certificate depending on the country.',
    'pe.f5.title':     'CAQ for Studies (Quebec only)',
    'pe.f5.desc':      'Must be requested from the Ministry of Immigration, Francization and Integration (MIFI) before the federal application. We help you compile the complete file.',
    'pe.f6.title':     'Accompanying Spouse and Children',
    'pe.f6.desc':      'Your spouse may be eligible for an open work permit, and your children can attend public school. These applications can be submitted at the same time.',
    'pe.pgwp.h2':      'After studies: <em>the post-graduation work permit</em>',
    'pe.pgwp.p1':      'If you successfully complete an eligible program at a designated learning institution, you may be eligible for the <strong>post-graduation work permit (PGWP)</strong>. This open permit allows you to work for almost any employer in Canada, and is often a key step toward permanent residence.',
    'pe.pgwp.p2':      'We also assist students with:',
    'pe.pgwp.ul':      '<li><strong>extensions</strong> of study permits;</li><li><strong>changes of institution or program</strong>;</li><li>the <strong>transition</strong> from studies to work and then permanent residence.</li>',
    'pe.infobox.title':'Important',
    'pe.infobox.p':    'The rules around study permits and PGWP have undergone several adjustments in recent years. The choice of institution, program, and even province can have direct consequences on your future PGWP eligibility and permanent residence pathway. This analysis deserves careful consideration before you even register.',
    'pe.btn1':         'Assess My Study Project',
    'pe.btn2':         'Book an Appointment',
    'pe.cta.title':    "Let's prepare your <em>study project</em> together",
    'pe.cta.desc':     'A well-prepared study file significantly increases your chances of obtaining the permit. Let\'s discuss your project and the best strategy for you.',

    // ── PERMIS TRAVAIL ──────────────────────────────────────────────────────
    'pt.page.title':   'Work Permit — MDPL Immigration | LMIA, francophone mobility',
    'pt.bc.current':   'Work Permit',
    'pt.hero.eyebrow': 'Service 03 · Working in Canada',
    'pt.hero.title':   'Work Permit <em>in Canada</em>',
    'pt.hero.subtitle':'Choosing the pathway that will open the doors for you.',
    'pt.hero.desc':    'Working in Canada can be done in many ways: a closed permit tied to a specific employer, an open permit offering great flexibility, special programs for French speakers, intra-company transfers, and much more. The challenge is identifying the right pathway for your situation.',
    'pt.intro.lead':   "The Canadian work permit system is one of the most diverse in the world. For the right profile, dozens of pathways exist. For the wrong profile, it can seem locked. The key is identifying the category under which you can apply for a permit, with or without a Labour Market Impact Assessment (LMIA).",
    'pt.intro.p1':     'At MDPL Immigration, we analyze your professional profile, family situation, nationality, and qualifications to identify the option that suits you. We do not limit ourselves to the first obvious solution: often, there is a faster or more advantageous pathway than the one initially considered.',
    'pt.cat.h2':       'LMIA, LMIA-exempt, open: understanding the <em>categories</em>',
    'pt.cat.p1':       'There are two main families of work permits:',
    'pt.cat.ul':       '<li><strong>LMIA-required permits</strong>: the employer must obtain a favourable Labour Market Impact Assessment before the worker can apply for a permit. This demonstrates that no Canadian citizen or permanent resident was available for the position.</li><li><strong>LMIA-exempt permits</strong> (International Mobility Program): these permits are exempt from the LMIA for various reasons (trade agreement, Canadian interest, reciprocal agreement, etc.).</li>',
    'pt.cat.p2':       'And of course, some permits are called <strong>"open"</strong>: they allow working for most employers in Canada without being limited to a specific position.',
    'pt.programs.h2':  'The programs <em>we handle</em>',
    'pt.f1.title':     'LMIA-Required Permits',
    'pt.f1.desc':      'For specialized or non-specialized positions where the employer demonstrates local recruitment efforts. The firm also supports employers in the LMIA application.',
    'pt.f2.title':     'Francophone Mobility',
    'pt.f2.desc':      'A stream of the International Mobility Program allowing francophone workers to obtain a work permit without an LMIA, outside Quebec. An excellent option for qualified French speakers.',
    'pt.f3.title':     'CUSMA/USMCA (Canada-US-Mexico)',
    'pt.f3.desc':      'Formerly NAFTA. American and Mexican nationals can obtain a work permit without an LMIA for certain professionals, investors, and intra-company transferees.',
    'pt.f4.title':     'Intra-Company Transfers',
    'pt.f4.desc':      'For executive or specialized employees transferred to Canada by their foreign employer. No LMIA required under certain conditions.',
    'pt.f5.title':     'Post-Graduation Work Permit (PGWP)',
    'pt.f5.desc':      'Open permit for graduates of an eligible program at a designated learning institution. Duration varies based on the length of the program studied.',
    'pt.f6.title':     'Open Work Permit for Spouse',
    'pt.f6.desc':      'The spouse of a student or temporary worker in Canada can, in many cases, obtain an open permit for the same duration. Ideal for families settling together.',
    'pt.f7.title':     'International Experience Canada (IEC)',
    'pt.f7.desc':      'Youth program for nationals of signatory countries: working holiday, young professionals, co-op internship. An excellent entry point for those under 35.',
    'pt.f8.title':     'Extension and Change of Employer',
    'pt.f8.desc':      'Renewal of your current permit, addition of conditions, change to a new position or employer. We analyze the options based on your situation.',
    'pt.pr.h2':        'From work permit to <em>permanent residence</em>',
    'pt.pr.p1':        'For many of our clients, a work permit is not an end in itself. It is the first step in a larger project: building Canadian experience that can later be converted into permanent residence, notably through the Canadian Experience Class (CEC) or the Quebec Experience Program (PEQ).',
    'pt.pr.p2':        'From the start, we keep this objective in mind. We help you choose a pathway that maximizes your future chances, rather than simply solving the immediate question.',
    'pt.infobox.title':'Good to know',
    'pt.infobox.p':    'In Quebec, certain additional steps (such as the Quebec employer attestation) may be required depending on the type of permit. Rules also vary depending on whether the position is in Quebec or elsewhere in Canada.',
    'pt.btn1':         'Assess My Work Options',
    'pt.btn2':         'Book an Appointment',
    'pt.cta.title':    "Let's find your <em>pathway to working in Canada</em>",
    'pt.cta.desc':     'Several pathways exist. An initial consultation allows us to identify those accessible to you and the most advantageous strategy.',

    // ── VISA VISITEUR & AVE ─────────────────────────────────────────────────
    'vv.page.title':   'Visitor Visa & eTA — MDPL Immigration | Short Stay in Canada',
    'vv.bc.current':   'Visitor Visa & eTA',
    'vv.hero.eyebrow': 'Service 04 · Temporary Stay',
    'vv.hero.title':   'Visitor Visa <em>& eTA</em>',
    'vv.hero.subtitle':'Coming to Canada, for as long as needed.',
    'vv.hero.desc':    'Visiting a loved one, attending a family event, reuniting with a child after several years, or simply exploring Canada — every visit has its reason. And every application deserves to be taken seriously, because a refusal often leaves a lasting mark on future files.',
    'vv.intro.lead':   'Many people think a visitor visa application is "simple." In some cases, it is. In others — especially when the applicant has strong family ties in Canada or a history of visas — the smallest flaw can lead to a refusal. And a refusal leaves a trace that follows all subsequent applications.',
    'vv.intro.p1':     'Our firm helps you present a complete, credible, and well-argued application, anticipating the questions that the immigration officer will ask when examining your file.',
    'vv.types.h2':     'TRV, eTA, super visa: <em>what are we talking about?</em>',
    'vv.types.p':      'The Canadian system distinguishes several types of authorizations for a temporary stay:',
    'vv.f1.title':     'Temporary Resident Visa (TRV)',
    'vv.f1.desc':      'Mandatory document for nationals of countries whose citizens must obtain a visa to enter Canada. The vast majority of applications we handle concern this type of visa.',
    'vv.f2.title':     'Electronic Travel Authorization (eTA)',
    'vv.f2.desc':      'For nationals of visa-exempt countries travelling to Canada by air. Faster process, but it can be refused or subject to a request for additional information.',
    'vv.f3.title':     'Super Visa for Parents and Grandparents',
    'vv.f3.desc':      'Multiple-entry visa allowing parents and grandparents of Canadian citizens or permanent residents to stay longer in Canada per visit. Specific medical insurance is required.',
    'vv.f4.title':     'Extension of Stay',
    'vv.f4.desc':      'Application to extend your authorized stay in Canada. Must be filed before your current status expires to avoid losing your status.',
    'vv.f5.title':     'Multiple-Entry Visa',
    'vv.f5.desc':      'Allows multiple stays in Canada over a period of up to 10 years. Particularly useful for people who regularly visit family in Canada.',
    'vv.f6.title':     'Restoration of Status',
    'vv.f6.desc':      'If you have lost your status in Canada, you generally have 90 days to apply for restoration. A delicate process that must be prepared carefully.',
    'vv.refusal.h2':   'Why an application can be <em>refused</em>',
    'vv.refusal.p':    'The most common grounds for refusal relate to:',
    'vv.refusal.ul':   '<li><strong>insufficient ties</strong> to the home country (employment, family, assets);</li><li><strong>financial means</strong> deemed insufficient for the planned stay;</li><li>the <strong>purpose of the trip</strong> that did not convince the officer;</li><li><strong>inconsistencies</strong> or missing information in the file;</li><li>a <strong>travel history</strong> or previous file that raises questions.</li>',
    'vv.refusal.p2':   'A well-prepared application anticipates each of these points. Our role is to help you gather the right evidence, organize it, and above all, present it credibly.',
    'vv.special.h2':   'Special cases <em>we handle</em>',
    'vv.special.p':    'Some situations require particularly careful preparation:',
    'vv.special.ul':   '<li>application after a <strong>previous refusal</strong>;</li><li>visit to a <strong>spouse or child who is a Canadian resident</strong> awaiting sponsorship;</li><li>stay for <strong>medical treatment</strong>;</li><li>visit for a <strong>family event</strong> (wedding, funeral);</li><li>professionals on <strong>business travel</strong>.</li>',
    'vv.infobox.title':'Keep in mind',
    'vv.infobox.p':    'A refusal is not the end of the road. Many of our clients came to us after an initial refusal and obtained their visa with a well-prepared subsequent application. The key is to understand the grounds for the first refusal and address them concretely in the new application.',
    'vv.btn1':         'Request an Assessment',
    'vv.btn2':         'Book an Appointment',
    'vv.cta.title':    "Let's prepare your <em>visitor visa application</em>",
    'vv.cta.desc':     'Whether it is your first application or a new attempt after a refusal, we take the time to analyze your file and support you.',

    // ── PARRAINAGE FAMILIAL ─────────────────────────────────────────────────
    'pf.page.title':   'Family Sponsorship — MDPL Immigration | Spouse, Parents, Children',
    'pf.bc.current':   'Family Sponsorship',
    'pf.hero.eyebrow': 'Service 05 · Family Reunification',
    'pf.hero.title':   'Sponsorship <em>&amp; Family Reunification</em>',
    'pf.hero.subtitle':'Reuniting families is our raison d’être.',
    'pf.hero.desc':    'Family sponsorship is, for many, the most emotionally charged process. It is not just about obtaining a status, but about reuniting with a spouse, watching children grow up together, offering parents their final years near their loved ones. It is also a file where rigour makes all the difference.',
    'pf.intro.lead':   'The Canadian system allows Canadian citizens and permanent residents to sponsor certain family members to also obtain permanent residence. But behind this possibility lies a demanding legal framework: proof of relationship, financial capacity of the sponsor, a multi-year commitment, compliance with federal and — for Quebec — provincial requirements.',
    'pf.intro.p1':     'At MDPL Immigration, we have supported many couples separated by borders, parents wishing to reunite with their children, and families that finally wanted to come together. Each of these situations has its own reality, and each deserves a carefully prepared file.',
    'pf.who.h2':       'Who can be <em>sponsored?</em>',
    'pf.f1.title':     'Spouse, Common-Law Partner, Conjugal Partner',
    'pf.f1.desc':      'You can sponsor your spouse, common-law partner (cohabitation of at least 12 months), or conjugal partner in certain exceptional situations. Proof of the authenticity of the relationship is central.',
    'pf.f2.title':     'Dependent Children',
    'pf.f2.desc':      'Your biological or adopted children under 22 years of age who are single. Certain exceptions exist for children over 22 in a situation of dependency.',
    'pf.f3.title':     'Parents and Grandparents',
    'pf.f3.desc':      'Parents and Grandparents Program (PGP). Access to this program is capped each year by IRCC and often works through a draw of sponsorship intentions.',
    'pf.f4.title':     'Other Family Members',
    'pf.f4.desc':      'In certain specific situations (sibling, nephew, niece who is an orphan under 18, or in the absence of any other relative), sponsorship is possible. Conditions are strict.',
    'pf.inland.h2':    'Sponsorship from inside or <em>outside Canada?</em>',
    'pf.inland.p1':    'For spousal sponsorship, two pathways exist:',
    'pf.inland.ul':    '<li><strong>Outland sponsorship</strong>: the sponsored person is abroad or can travel during the process. More flexibility for international travel.</li><li><strong>Inland sponsorship</strong>: the sponsored person already lives in Canada with their sponsor and will remain during processing. Possibility of obtaining an open work permit while waiting.</li>',
    'pf.inland.p2':    'The choice between these two pathways is not trivial. It depends on your situation, travel plans, current status in Canada, and the expected processing time. We analyze your situation to recommend the most advantageous option.',
    'pf.undertaking.h2':'The sponsorship <em>undertaking</em>',
    'pf.undertaking.p1':'As a sponsor, you sign a formal undertaking with the government: you commit to meeting the essential needs of the sponsored person for a set period (variable depending on the relationship and province). In Quebec, an additional undertaking is signed with the Ministry of Immigration, Francization and Integration (MIFI).',
    'pf.undertaking.p2':'This undertaking is serious. It continues even in the event of separation or divorce. It is important to understand all its implications before committing — and this is one of the things we take the time to explain in consultation.',
    'pf.proof.h2':     'The proof of the <em>relationship</em>',
    'pf.proof.p1':     'For spousal sponsorship, the quality of the relationship proof is <strong>decisive</strong>. IRCC carefully examines the following elements:',
    'pf.proof.ul':     '<li>the history and <strong>evolution of the relationship</strong>;</li><li><strong>evidence of regular communication</strong>;</li><li><strong>evidence of shared intentions</strong> (finances, plans, travel);</li><li><strong>mutual knowledge</strong> of each family and social circle;</li><li><strong>photos, trips, shared events</strong>.</li>',
    'pf.proof.p2':     'A poorly built file, even for an authentic relationship, can be refused. This is precisely where our experience makes the difference: we know which elements to highlight and how to present them coherently.',
    'pf.infobox.title':'Specific to Quebec',
    'pf.infobox.p':    'If you are sponsoring someone who will settle in Quebec, two additional steps are required: the sponsorship undertaking with the MIFI and, in many cases, obtaining a Quebec Selection Certificate (CSQ). We handle all of these steps for you.',
    'pf.btn1':         'Assess a Sponsorship',
    'pf.btn2':         'Book an Appointment',
    'pf.cta.title':    'Reunite your family <em>in Canada</em>',
    'pf.cta.desc':     'Each sponsorship is unique. An initial consultation allows us to review your situation and build a solid file from the start.',

    // ── TRAVAILLEURS ÉTRANGERS TEMPORAIRES ──────────────────────────────────
    'te.page.title':   'Temporary Foreign Workers — MDPL Immigration | Employers',
    'te.bc.current':   'Temporary Foreign Workers',
    'te.hero.eyebrow': 'Service 06 · For Employers',
    'te.hero.title':   'Temporary <em>Foreign Workers</em>',
    'te.hero.subtitle':'Recruiting internationally, in full compliance.',
    'te.hero.desc':    'Hiring a foreign worker in Canada is not just a matter of labour needs. It is a process governed by precise rules, where every step — from the impact assessment to post-hiring compliance — can make the difference between a successful experience and a file that becomes complicated. MDPL Immigration supports employers at each of these steps.',
    'te.intro.lead':   'Canada offers several pathways to hire temporary foreign workers, primarily through two main programs: the <strong>Temporary Foreign Worker Program (TFWP)</strong>, which generally requires a Labour Market Impact Assessment (LMIA), and the <strong>International Mobility Program (IMP)</strong>, which allows hiring without an LMIA in certain cases.',
    'te.intro.p1':     'Our firm supports Quebec and Canadian employers in all of these processes: international recruitment, LMIA applications, compliance support, document management, and HR guidance. We help you avoid the most common pitfalls and build a solid file from the start.',
    'te.lmia.h2':      'The Labour Market Impact Assessment <em>(LMIA)</em>',
    'te.lmia.p1':      'The LMIA is an assessment conducted by Service Canada (or in partnership with MIFI in Quebec) that determines whether hiring a foreign worker will have a positive, neutral, or negative effect on the Canadian labour market. It is generally the first step — and one of the most demanding — in the process.',
    'te.lmia.p2':      'For an LMIA to be favourable, the employer must demonstrate that they made genuine efforts to recruit Canadians or permanent residents, that the offered salary matches market standards, and that working conditions comply with applicable laws.',
    'te.streams.h2':   'The main streams <em>of the TFWP</em>',
    'te.f1.title':     'High-Wage Positions Stream',
    'te.f1.desc':      'For positions offering a salary at or above the provincial median hourly wage. Recruitment requirements and a transition plan are generally required.',
    'te.f2.title':     'Low-Wage Positions Stream',
    'te.f2.desc':      'For positions below the median wage. Cap on the number of foreign workers per worksite and additional requirements regarding accommodation and transportation.',
    'te.f3.title':     'Agricultural Stream',
    'te.f3.desc':      'For Canadian agricultural producers. Includes notably the Seasonal Agricultural Worker Program (SAWP) and the general agricultural stream.',
    'te.f4.title':     'Global Talent Stream',
    'te.f4.desc':      'Accelerated stream for highly specialized positions (technology, innovation). Priority processing of LMIA applications and work permits.',
    'te.f5.title':     'In-Home Caregiver Stream',
    'te.f5.desc':      'For hiring in-home caregivers. Specific requirements regarding accommodation, hours, and employment conditions.',
    'te.f6.title':     'International Mobility (LMIA-exempt)',
    'te.f6.desc':      'LMIA-exempt permits: intra-company transfers, trade agreements (CUSMA, CETA), francophone mobility, Canadian interest. Generally reduced timelines and costs.',
    'te.compliance.h2':'<em>Compliance</em>: an ongoing obligation',
    'te.compliance.p1':'Once the worker is hired, employer obligations do not end. Service Canada can conduct <strong>inspections</strong> (with or without notice) to verify compliance with the commitments made in the LMIA application or exemption. Salaries, working conditions, safe environment, worker rights: everything is verifiable.',
    'te.compliance.p2':'Non-compliance can lead to serious consequences: monetary penalties, temporary ban from the program, publication of the employer name. We help our clients put the right practices in place to remain compliant at all times.',
    'te.howwe.h2':     'How <em>MDPL Immigration</em> supports employers',
    'te.howwe.p':      'Our approach for employers generally includes:',
    'te.howwe.ul':     '<li><strong>Strategic analysis</strong> of the need and selection of the most suitable stream;</li><li><strong>International recruitment support</strong> (job posting, candidate validation);</li><li><strong>Preparation and submission</strong> of the LMIA or exemption application;</li><li><strong>Support for the worker</strong> in their work permit application;</li><li><strong>Compliance support</strong> and internal audit;</li><li><strong>Preparation for a potential Service Canada inspection</strong>.</li>',
    'te.infobox.title':'Quebec Specifics',
    'te.infobox.p':    'When the position is in Quebec, the LMIA is evaluated jointly by Service Canada and the Ministry of Immigration, Francization and Integration (MIFI). Additional requirements may apply, notably regarding French language proficiency. We manage these joint processes for you.',
    'te.btn1':         'Discuss a Recruitment',
    'te.btn2':         'Book an Appointment',
    'te.cta.title':    'Recruit internationally, <em>with complete peace of mind</em>',
    'te.cta.desc':     'We support Quebec and Canadian employers in their international recruitment processes. Let\'s discuss your needs.',

    // ── OUTILS ─────────────────────────────────────────────────────────────
    'outils.page.title':   'Our Tools — MDPL Immigration | Free Calculators, Quiz & Simulators',
    'outils.bc.current':   'Our Tools',
    'outils.hero.eyebrow': 'Online Tools',
    'outils.hero.title':   'Tools to <em>better understand</em> your project',
    'outils.hero.subtitle':'Calculators, quiz, simulators: everything to guide you.',
    'outils.hero.desc':    'We offer free tools to estimate your eligibility, calculate your costs, assess your file risks, and guide you toward the right Canadian immigration program. These tools are educational and do not replace a personalized consultation — they give you a useful first reading of your situation.',
    'outils.intro.lead':   'Canadian immigration is a technical universe where every detail matters. Understanding quickly where you stand, what lies ahead, and how much it could cost makes all the difference in calmly planning your project. That is why we developed a suite of interactive tools, freely accessible, that synthesize the key information you need.',
    'outils.intro.p':      'These tools are based on rules published by <strong>Immigration, Refugees and Citizenship Canada (IRCC)</strong>, the <strong>Ministry of Immigration, Francization and Integration (MIFI)</strong> of Quebec, and our firm\'s practices since 2015. They are regularly updated to reflect program changes.',
    'outils.grid.eyebrow': 'Available Tools',
    'outils.grid.title':   'Explore our <em>toolbox</em>',
    'outils.grid.lead':    'Each tool takes only a few minutes. Results are indicative and strictly confidential — nothing is saved without your consent.',
    'outils.t1.title':     'Eligibility Calculator',
    'outils.t1.desc':      'Assess in a few clicks the Canadian immigration programs for which you may be eligible. Age, education, languages, experience: the calculator analyzes your profile and directs you toward the most relevant pathways.',
    'outils.t1.cta':       'Launch the Calculator',
    'outils.t2.title':     'Express Entry Calculator',
    'outils.t2.desc':      'Estimate your CRS (Comprehensive Ranking System) score out of 1200 points according to the official IRCC 2025-2026 grid. Detailed breakdown by category: age, education, languages, experience, spouse, transferability, and additional points.',
    'outils.t2.cta':       'Calculate My CRS Score',
    'outils.t3.title':     'Quiz: Which Program?',
    'outils.t3.desc':      'Six simple questions to identify the immigration program best suited to your life project. Studies, work, family reunification, temporary stay: find the pathway that fits you.',
    'outils.t3.cta':       'Start the Quiz',
    'outils.t4.title':     'Cost Calculator',
    'outils.t4.desc':      'Estimate the total budget for your immigration project: IRCC and MIFI government fees, biometrics, medical exams, document translation, language tests, and required proof of funds.',
    'outils.t4.cta':       'Calculate My Costs',
    'outils.t5.title':     'IRCC Processing Times',
    'outils.t5.desc':      'Check current processing times for each type of application: study permits, work permits, visitor visas, permanent residence, sponsorship. Official IRCC data.',
    'outils.t5.cta':       'View Processing Times',
    'outils.t6.title':     'Assess Refusal Risk',
    'outils.t6.desc':      'Before submitting your application, identify elements of your file that could raise questions with immigration officers. An honest self-assessment in 8 questions.',
    'outils.t6.cta':       'Assess My File',
    'outils.t7.title':     'Document Generator',
    'outils.t7.desc':      'Prepare standard immigration documents in minutes: invitation letter, study plan, checklists by application type. Editable templates aligned with current practices.',
    'outils.t7.cta':       'Create a Document',
    'outils.t8.title':     'Immigration Assistant',
    'outils.t8.desc':      'Ask questions to our interactive assistant. It answers common questions about permits, visas, sponsorships, and permanent residence, based on an up-to-date knowledge base.',
    'outils.t8.cta':       'Ask a Question',
    'outils.t9.title':     'Personalized Consultation',
    'outils.t9.desc':      'The tools above offer a first reading. For a personalized analysis and a complete strategy, a consultation with our firm remains the best next step. Speak with a regulated immigration consultant.',
    'outils.t9.cta':       'Book a Consultation',
    'outils.infobox.title':'About these tools',
    'outils.infobox.p':    'All our tools are designed for information and guidance purposes. They rely on general rules and do not account for all the nuances of your personal situation. For a complete and reliable analysis, a consultation with an authorized immigration representative (regulated consultant or lawyer) remains essential. Our tools store no personal information: everything you enter stays in your browser.',
    'outils.cta.title':    'Need a <em>personalized analysis</em>?',
    'outils.cta.desc':     'Our tools are an excellent starting point. For a tailored strategy suited to your specific situation, let\'s talk in a consultation.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    'faq.page.title':   'FAQ — MDPL Immigration | Canadian Immigration Questions',
    'faq.bc.current':   'FAQ',
    'faq.hero.eyebrow': 'Frequently Asked Questions',
    'faq.hero.title':   'Your <em>questions</em>, our answers',
    'faq.hero.subtitle':'To better understand our services and the immigration process.',
    'faq.hero.desc':    'We have gathered here the questions our clients ask most frequently during an initial consultation. If your question is not on this list, do not hesitate to contact us — we will be happy to answer during a personalized exchange.',
    'faq.footer.p':     'A question not on this list?',
    'faq.footer.btn':   'Ask Us Your Question',
    'faq.cta.title':    "Let's discuss <em>your situation</em>",
    'faq.cta.desc':     'Every file is unique. An initial consultation allows us to answer your questions precisely and present the options available to you.',

    // ── BLOG ────────────────────────────────────────────────────────────────
    'blog.page.title':   'Blog — MDPL Immigration | Canadian Immigration Advice & News',
    'blog.bc.current':   'Blog',
    'blog.hero.eyebrow': 'Immigration Information Resource',
    'blog.hero.title':   'The MDPL <em>Immigration Blog</em>',
    'blog.hero.subtitle':'Case by case.',
    'blog.hero.desc':    'Understanding Canadian immigration through real cases, practical analyses, and accessible explanations. This blog is designed to inform, raise awareness, and guide — not to replace personalized professional advice.',
    'blog.about.eyebrow':'Our Approach',
    'blog.about.title':  'Why this blog <em>exists</em>',
    'blog.about.p1':     'The MDPL Immigration blog was created to offer a clear, professional, and accessible information space on Canadian immigration processes.',
    'blog.about.p2':     'The articles published are inspired by concrete situations encountered in practice. The goal is to explain how certain immigration rules apply in reality, without claiming that every situation will produce the same result.',
    'blog.about.p3':     'Every file is unique. The examples presented serve to inform, raise awareness, and help readers better understand the possible issues.',
    'blog.pillar1.title':'Inform',
    'blog.pillar1.desc': 'Clear explanations on the most common immigration processes.',
    'blog.pillar2.title':'Simplify',
    'blog.pillar2.desc': 'Complex situations made accessible through concrete cases.',
    'blog.pillar3.title':'Prevent Errors',
    'blog.pillar3.desc': 'Identify and avoid common pitfalls in immigration files.',
    'blog.pillar4.title':'Guide',
    'blog.pillar4.desc': 'Direct readers to the right topics based on their situation.',
    'blog.cta.title':    'A question related to <em>your situation?</em>',

    // ── POLITIQUE CONFIDENTIALITÉ ───────────────────────────────────────────
    'privacy.page.title':   'Privacy Policy — MDPL Immigration',
    'privacy.bc.current':   'Privacy Policy',
    'privacy.hero.eyebrow': 'Legal Information',
    'privacy.hero.title':   'Privacy <em>Policy</em>',
    'privacy.hero.subtitle':'How we protect your personal information.',

    // ── CONDITIONS UTILISATION ──────────────────────────────────────────────
    'terms.page.title':   'Terms of Use — MDPL Immigration',
    'terms.bc.current':   'Terms of Use',
    'terms.hero.eyebrow': 'Legal Information',
    'terms.hero.title':   'Terms of <em>Use</em>',
    'terms.hero.subtitle':'The framework for using our site and tools.',

    // ── CALCULATEUR ÉLIGIBILITÉ ─────────────────────────────────────────────
    'calc.elig.page.title':   'Immigration Canada Eligibility Calculator 2026 — MDPL Immigration',
    'calc.elig.bc.current':   'Eligibility Calculator',
    'calc.elig.hero.eyebrow': 'Interactive Tool · Free Assessment',
    'calc.elig.hero.title':   'Eligibility <em>Calculator</em>',
    'calc.elig.hero.subtitle':'Discover in 3 minutes the programs suited to your profile.',
    'calc.elig.hero.desc':    'This calculator assesses your eligibility for the main Canadian immigration programs — Express Entry, Quebec Regular Skilled Worker Program, Quebec Experience Program, Provincial Nominee Programs — based on your age, level of education, language skills, and professional experience. The result is indicative and constitutes a first reading, not legal advice.',
    'calc.elig.cta.title':    'To go further, <em>let\'s talk</em>',

    // ── CALCULATEUR ENTRÉE EXPRESS ──────────────────────────────────────────
    'calc.ee.page.title':   'Express Entry (CRS) Calculator 2026 — Score out of 1200 pts | MDPL Immigration',
    'calc.ee.bc.current':   'Express Entry Calculator',
    'calc.ee.hero.eyebrow': 'Interactive Tool · IRCC 2025-2026 Grid',
    'calc.ee.hero.title':   'Express Entry <em>Calculator</em> — CRS Score',
    'calc.ee.hero.subtitle':'Estimate your score out of 1200 points in real time.',
    'calc.ee.hero.desc':    'This calculator applies the official IRCC Comprehensive Ranking System (CRS) grid, updated for 2025-2026. Enter your profile below and get your estimated score with a full breakdown by category. Update: job offer points were removed from the CRS on March 25, 2025, and are not included in this calculator.',

    // ── QUIZ ────────────────────────────────────────────────────────────────
    'quiz.page.title':   'Quiz: Which Canadian Immigration Program Is Right for You?',
    'quiz.bc.current':   'Program Quiz',
    'quiz.hero.eyebrow': 'Interactive Tool · 2 Minutes',
    'quiz.hero.title':   'Which <em>immigration</em> program is right for you?',
    'quiz.hero.subtitle':'Six simple questions to find your pathway.',
    'quiz.hero.desc':    'The Canadian immigration system includes dozens of different programs — studies, temporary work, permanent residence, family sponsorship, visitor visa. This quiz helps you quickly identify the program category that best matches your current situation and your life project in Canada.',
    'quiz.cta.title':    "Let's deepen your <em>orientation</em>",

    // ── CALCULATEUR COÛTS ───────────────────────────────────────────────────
    'calc.costs.page.title':   'Immigration Canada Cost Calculator — MDPL Immigration',
    'calc.costs.bc.current':   'Cost Calculator',
    'calc.costs.hero.eyebrow': 'Interactive Tool · Budget Estimate',
    'calc.costs.hero.title':   'Immigration <em>Cost Calculator</em>',
    'calc.costs.hero.subtitle':'Estimate your total budget in a few clicks.',
    'calc.costs.hero.desc':    'How much does a Canadian immigration project really cost? Beyond IRCC and MIFI government fees, you need to budget for biometrics, document translations, medical exams, language tests, and required proof of funds. This calculator combines all these expenses to give you a realistic budget estimate.',
    'calc.costs.cta.title':    'A realistic budget, <em>a serene project</em>',

    // ── DÉLAIS IRCC ─────────────────────────────────────────────────────────
    'delays.page.title':   'Canada Immigration Processing Times 2026 — IRCC | MDPL Immigration',
    'delays.bc.current':   'IRCC Processing Times',
    'delays.hero.eyebrow': 'Reference Tool · Processing Times',
    'delays.hero.title':   'Canada <em>Immigration Processing Times</em> 2026',
    'delays.hero.subtitle':'Current processing times for each type of application.',
    'delays.hero.desc':    'How long does it take to wait for a study permit, visitor visa, permanent residence, or sponsorship? Processing times vary enormously from one program to another, and change regularly based on IRCC office workload. This table summarizes typical observed timelines, as a complement to the official IRCC tool.',
    'delays.cta.title':    "Let's plan your project <em>with timelines in mind</em>",

    // ── GÉNÉRATEUR DOCUMENTS ────────────────────────────────────────────────
    'gen.page.title':   'Immigration Document Generator — MDPL Immigration',
    'gen.bc.current':   'Document Generator',
    'gen.hero.eyebrow': 'Interactive Tool · Custom Templates',
    'gen.hero.title':   'Immigration <em>Document Generator</em>',
    'gen.hero.subtitle':'Letters, study plans, checklists: prepare your documents in minutes.',
    'gen.hero.desc':    'Preparing an immigration file requires several customized documents: invitation letter for a visitor visa, study plan for a study permit, explanatory letter for a sensitive application, lists of required documents. This generator offers proven templates you can adapt, print, and submit with your application.',
    'gen.cta.title':    'Beyond the templates, <em>an expert review</em>',

    // ── ASSISTANT IMMIGRATION ───────────────────────────────────────────────
    'asst.page.title':   'Immigration Assistant — Frequently Asked Questions | MDPL Immigration',
    'asst.bc.current':   'Immigration Assistant',
    'asst.hero.eyebrow': 'Interactive Tool · Immediate Answers',
    'asst.hero.title':   'Immigration <em>Assistant</em>',
    'asst.hero.subtitle':'Ask your questions about permits, visas, and permanent residence.',
    'asst.hero.desc':    'This interactive assistant answers the most frequently asked questions from our clients about Canadian immigration: study permits, work permits, sponsorship, permanent residence, citizenship. Answers are based on current IRCC and MIFI rules and our firm\'s experience. For any complex personal situation, a consultation is recommended.',
    'asst.cta.title':    'For a <em>personalized answer</em>, let\'s talk',

    // ── RISQUE REFUS ────────────────────────────────────────────────────────
    'risk.page.title':   'Assess the Refusal Risk of Your Immigration Application — MDPL',
    'risk.bc.current':   'Refusal Risk',
    'risk.hero.eyebrow': 'Interactive Tool · Self-Assessment',
    'risk.hero.title':   'Is your application <em>at risk of refusal</em>?',
    'risk.hero.subtitle':'8 questions to evaluate the sensitive points of your file.',
    'risk.hero.desc':    'A refusal in immigration almost never comes out of nowhere. It is explained by one or more identifiable factors: previous refusals, insufficient funds, inconsistencies in the file, high-refusal countries, specific background. This self-assessment helps you identify these vulnerabilities before submitting your application — so you can correct them in time.',
    'risk.cta.title':    'An identified risk is <em>a manageable risk</em>',

    // ── CARNET DE VOYAGE ────────────────────────────────────────────────────
    'carnet.page.title': 'Travel Log — Permanent Resident | MDPL Immigration',
    'carnet.back.link':  '← Back to article',

    // ── ARTICLES ────────────────────────────────────────────────────────────
    'art.adoption.page.title': "Adoption, Guardianship and Immigration to Canada: When Emotional Bonds Are Not Enough | MDPL Immigration",
    'art.adoption.bc.current': 'Humanitarian Application',
    'art.adoption.hero.title': '"She\'s been my daughter for years" — <em>but for immigration, that\'s not always enough</em>',
    'art.adoption.hero.lead':  'In several Caribbean countries, raising a relative\'s child is an act of love, solidarity, and culture. But when the time comes to immigrate to Canada, IRCC does not judge feelings — it judges documents. And often, what families believe is sufficient is not.',

    'art.csq.page.title': "What is the CSQ? The Quebec Selection Certificate Explained | MDPL Immigration",
    'art.csq.bc.current': 'Quebec Immigration',
    'art.csq.hero.title': 'What is the CSQ? <em>The Quebec Selection Certificate Explained</em>',
    'art.csq.hero.lead':  'The CSQ is one of the most important documents in Quebec immigration — and one of the most misunderstood. Why Quebec requires it, when it is needed, and why you must keep it even after obtaining Canadian citizenship: here is everything you need to know.',

    'art.enfant.page.title': "Boarding Refusal: Canadian Citizen Child Blocked Without a Canadian Passport | MDPL Immigration",
    'art.enfant.bc.current': 'Dual Citizenship',
    'art.enfant.hero.title': 'Boarding refusal at the airport: <em>when Canadian citizenship blocks the journey</em>',
    'art.enfant.hero.lead':  'A child born abroad, a Canadian citizen mother, an eTA that seemed valid — and a brutal refusal at the airport. Here is what no one had told them about Canadian citizenship, passports, and IRCC\'s rules.',

    'art.docs.page.title': "Submitting Documents on Time in Canadian Immigration: Why It Matters | MDPL Immigration",
    'art.docs.bc.current': 'Canadian Immigration',
    'art.docs.hero.title': 'The importance of submitting documents <em>on time in Canadian immigration</em>',
    'art.docs.hero.lead':  'An eligible file can be refused simply because a document was not submitted on time. In immigration, the deadline is not a formality — it is a binding rule. Here is what you need to know, and what to do when circumstances make obtaining a document impossible.',

    'art.inspection.page.title': "ESDC LMIA Inspections: What Every Employer Must Know | MDPL Immigration",
    'art.inspection.bc.current': 'Temporary Foreign Workers',
    'art.inspection.hero.title': 'ESDC LMIA Inspections: <em>what every employer must know before receiving that letter</em>',
    'art.inspection.hero.lead':  'An ESDC inspection letter often arrives without warning — with a short response deadline, a considerable document list, and a review window that can cover up to six years of employment. This guide is based on a real case handled by our team.',

    'art.mono.page.title': "Monogamy or Polygamy: What You Need to Know Before Filing a Spousal Sponsorship | MDPL Immigration",
    'art.mono.bc.current': 'Family Sponsorship',
    'art.mono.hero.title': 'Monogamy or polygamy: <em>what you need to know before filing a sponsorship application</em>',
    'art.mono.hero.lead':  'In Canada, polygamy is not recognized for immigration purposes. A marital regime incorrectly recorded on a marriage certificate — even by error — can cause a spousal sponsorship to fail. Here is why, and how we resolved this problem in a real file.',

    'art.parr.page.title': "He Lives in Ontario, Works in Quebec: A Sponsorship File That Almost Became a Nightmare | MDPL Immigration",
    'art.parr.bc.current': 'Permanent Residence',
    'art.parr.hero.title': 'He lives in Ontario, works in Quebec: <em>a sponsorship file that almost became a nightmare</em>',
    'art.parr.hero.lead':  'In the Ottawa-Gatineau area, living in one province and working in another is a daily reality for thousands of people. But for an IRCC officer analyzing a sponsorship file on paper, the same scenario can look like an attempt to circumvent the system. Here is how this misunderstanding almost compromised a permanent residence application.',

    'art.pere.page.title': "Canadian Father, Child Born Abroad: When a Birth Certificate Is Not Enough | MDPL Immigration",
    'art.pere.bc.current': 'Permanent Residence',
    'art.pere.hero.title': 'He is the father, the child is Canadian — <em>but proof of the bond remains essential</em>',
    'art.pere.hero.lead':  'A Canadian citizen, a child born abroad, a birth certificate without the father\'s name. A situation more common than you might think — and with considerable legal consequences. Here is what families need to understand before starting the process with IRCC.',

    'art.registre.page.title': "Travel Log and Permanent Residence: An Essential Tool for Your Future Citizenship Application | MDPL Immigration",
    'art.registre.bc.current': 'Permanent Residence',
    'art.registre.hero.title': 'Travel log and <em>permanent residence</em>: an essential tool for your future citizenship application',
    'art.registre.hero.lead':  'As soon as you obtain permanent residence, a clock starts ticking. One day you will need to prove to IRCC exactly how many days you spent in Canada — with precise dates and supporting evidence. Your memory will not be enough. A travel log, kept from the start, can save you weeks of stress and protect your citizenship application.'
  };

  // ── Remplacement de nœuds texte (éléments partagés sans balises enfants) ──
  var TT = [
    // Bannière
    { fr: 'Tél.',                           en: 'Tel.' },
    { fr: 'Courriel',                             en: 'Email' },
    { fr: 'Lundi au vendredi, 9 h à 17 h',  en: 'Monday to Friday, 9 a.m. to 5 p.m.' },
    // Logo / footer logo
    { fr: 'Cabinet conseil en immigration',       en: 'Canadian Immigration Consulting' },
    // Nav
    { fr: 'Accueil',              en: 'Home' },
    { fr: 'Notre histoire',       en: 'Our Story' },
    { fr: 'Nos services',         en: 'Our Services' },
    { fr: 'Résidence permanente', en: 'Permanent Residence' },
    { fr: "Permis d’études", en: 'Study Permit' },
    { fr: 'Permis de travail',    en: 'Work Permit' },
    { fr: 'Parrainage familial',  en: 'Family Sponsorship' },
    { fr: 'Travailleurs étrangers', en: 'Foreign Workers' },
    { fr: 'Nos outils',           en: 'Our Tools' },
    { fr: "Calculateur d’éligibilité", en: 'Eligibility Calculator' },
    { fr: 'Calculateur Entrée Express', en: 'Express Entry Calculator' },
    { fr: 'Calculateur de coûts', en: 'Cost Calculator' },
    { fr: 'Suivi des délais IRCC', en: 'IRCC Processing Times' },
    { fr: 'Générateur de documents', en: 'Document Generator' },
    { fr: 'Assistant immigration', en: 'Immigration Assistant' },
    { fr: 'Pourquoi MDPL',        en: 'Why MDPL' },
    { fr: 'Blogue',               en: 'Blog' },
    { fr: 'Questions fréquentes', en: 'FAQ' },
    { fr: 'Nous contacter',       en: 'Contact Us' },
    { fr: 'Prendre RDV',          en: 'Book Now' },
    { fr: 'Prendre rendez-vous',  en: 'Book an Appointment' },
    // Footer
    { fr: "Fondé à Laval en 2015, MDPL Immigration accompagne particuliers, familles et employeurs dans leurs démarches d’immigration canadienne avec rigueur, transparence et bienveillance.",
      en: "Founded in Laval in 2015, MDPL Immigration supports individuals, families, and employers in their Canadian immigration processes with rigour, transparency, and care." },
    { fr: 'Coordonnées',     en: 'Contact' },
    { fr: 'Adresse',              en: 'Address' },
    { fr: 'Téléphone',  en: 'Phone' },
    { fr: 'Horaires',             en: 'Hours' },
    { fr: 'Tous droits réservés.', en: 'All rights reserved.' },
    { fr: 'Politique de confidentialité', en: 'Privacy Policy' },
    { fr: "Conditions d’utilisation", en: 'Terms of Use' },
    // Disclaimer
    { fr: 'Information importante', en: 'Important Notice' },
    { fr: "Les informations présentées sur ce site sont fournies à titre informatif uniquement et ne constituent pas un avis juridique. Chaque situation d’immigration est unique et dépend de plusieurs facteurs. Pour toute démarche concrète, une consultation personnalisée avec un représentant autorisé en immigration est nécessaire.",
      en: 'The information presented on this site is provided for informational purposes only and does not constitute legal advice. Each immigration situation is unique and depends on several factors. For any concrete steps, a personalized consultation with an authorized immigration representative is required.' },
    // Stats
    { fr: 'Année de fondation',  en: 'Year Founded' },
    { fr: 'Dossiers traités',    en: 'Cases Handled' },
    { fr: "Pays d’origine",       en: 'Countries of Origin' },
    { fr: "D’accompagnement",     en: 'Of Support' },
    // Boutons communs
    { fr: 'En savoir plus',            en: 'Learn More' },
    { fr: 'Découvrir nos services', en: 'Discover Our Services' },
    { fr: 'Découvrir toutes nos valeurs', en: 'Discover All Our Values' },
    { fr: 'Lire notre histoire complète', en: 'Read Our Full Story' },
    { fr: 'Demander une évaluation', en: 'Request an Assessment' },
    // CTA band commun
    { fr: 'Réservez une consultation pour discuter de votre situation et obtenir une évaluation honnête de vos options.',
      en: 'Book a consultation to discuss your situation and get an honest assessment of your options.' }
  ];

  // ── Cache FR pour éléments data-i18n ─────────────────────────────────────
  var frCache = {};

  function cacheAllFr() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!frCache[key]) {
        frCache[key] = (el.tagName === 'TITLE') ? el.textContent : el.innerHTML;
      }
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (!frCache['ph:' + key]) frCache['ph:' + key] = el.placeholder || '';
    });
  }

  // ── Marcheur de nœuds texte ───────────────────────────────────────────────
  var SHARED_SELECTORS = [
    '.top-banner', '.site-nav', '.site-footer',
    '.disclaimer-section', '.cta-band', '.stats-bar', '.breadcrumb'
  ];

  function walkNodes(root, cb) {
    if (!root) return;
    var node = root.firstChild;
    while (node) {
      var next = node.nextSibling;
      if (node.nodeType === 3) {
        cb(node);
      } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        walkNodes(node, cb);
      }
      node = next;
    }
  }

  function applyTextTrans(from, to) {
    SHARED_SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (container) {
        walkNodes(container, function (tn) {
          var t = tn.textContent;
          for (var i = 0; i < TT.length; i++) {
            var pair = TT[i];
            if (t.indexOf(pair[from]) !== -1) {
              tn.textContent = t.replace(pair[from], pair[to]);
              break;
            }
          }
        });
      });
    });
  }

  // ── Application d'une langue ──────────────────────────────────────────────
  function applyLang(lang) {
    var prev = document.documentElement.lang || 'fr';
    document.documentElement.lang = lang;

    // Nœuds texte partagés
    if (prev !== lang) {
      applyTextTrans(prev === 'fr' ? 'fr' : 'en', lang === 'en' ? 'en' : 'fr');
    }

    // Éléments data-i18n
    if (lang === 'en') {
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (EN[key] !== undefined) {
          if (el.tagName === 'TITLE') { el.textContent = EN[key]; document.title = EN[key]; }
          else el.innerHTML = EN[key];
        }
      });
      document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-ph');
        if (EN[key] !== undefined) el.placeholder = EN[key];
      });
    } else {
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (frCache[key] !== undefined) {
          if (el.tagName === 'TITLE') { el.textContent = frCache[key]; document.title = frCache[key]; }
          else el.innerHTML = frCache[key];
        }
      });
      document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-ph');
        if (frCache['ph:' + key] !== undefined) el.placeholder = frCache['ph:' + key];
      });
    }

    // Mise à jour aria-label du bouton
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');

    localStorage.setItem('mdpl-lang', lang);
  }

  // ── Injection du bouton dans la bannière ──────────────────────────────────
  function injectButton() {
    var inner = document.querySelector('.top-banner-inner');
    if (!inner || document.getElementById('lang-toggle')) return;
    var sep = document.createElement('span');
    sep.className = 'top-banner-sep';
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '|';
    var btn = document.createElement('button');
    btn.className = 'lang-toggle';
    btn.id = 'lang-toggle';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'Switch to English');
    btn.innerHTML = '<span class="lang-opt" data-lang="fr">FR</span><span class="lang-sep" aria-hidden="true">|</span><span class="lang-opt" data-lang="en">EN</span>';
    inner.appendChild(sep);
    inner.appendChild(btn);

    btn.addEventListener('click', function () {
      var current = document.documentElement.lang || 'fr';
      applyLang(current === 'fr' ? 'en' : 'fr');
    });
  }

  // ── Initialisation ────────────────────────────────────────────────────────
  cacheAllFr();
  injectButton();

  var stored = localStorage.getItem('mdpl-lang') || 'fr';
  if (stored === 'en') {
    applyLang('en');
  } else {
    document.documentElement.lang = 'fr';
  }

}());
