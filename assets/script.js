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

    // --- Éléments communs à toutes les pages ---
    'common.disclaimer.title': 'Important Information',
    'common.disclaimer.p1':    'The information presented on this site is provided for information purposes only and does not constitute legal advice. Every immigration situation is unique and depends on several factors. For any concrete action, a personalized consultation with an authorized immigration representative is necessary.',

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
    'history.disclaimer.title': 'Important Information',
    'history.disclaimer.p1':    'The information presented on this site is provided for information purposes only and does not constitute legal advice. Every immigration situation is unique and depends on several factors. For any concrete action, a personalized consultation with an authorized immigration representative is necessary.',

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

    // ── OUTILS ──────────────────────────────────────────────────────────────
    'outils.page.title':      'Our Tools — MDPL Immigration | Free Calculators and Immigration Tools',
    'outils.bc.current':      'Our Tools',
    'outils.hero.eyebrow':    'Our Online Tools',
    'outils.hero.title':      'Tools to <em>better understand</em> your project',
    'outils.hero.subtitle':   'Calculators, quizzes, simulators: everything to guide you.',
    'outils.hero.desc':       'We provide you with free tools to estimate your eligibility, calculate your costs, evaluate the risks in your file, and guide you toward the right Canadian immigration program. These tools are educational and do not replace a personalized consultation — they give you a useful first read of your situation.',
    'outils.intro.lead':      'Canadian immigration is a technical universe where every detail matters. Understanding quickly where you stand, what awaits you, and what it might cost makes all the difference in planning your project with peace of mind. That is why we developed a suite of interactive tools, freely accessible, that synthesize the main information you need.',
    'outils.intro.p1':        'These tools are based on rules published by <strong>Immigration, Refugees and Citizenship Canada (IRCC)</strong>, the <strong>Ministry of Immigration, Francization and Integration (MIFI)</strong> of Quebec, and the practices of our firm since 2015. They are updated regularly to reflect changes in programs.',
    'outils.tools.eyebrow':   'Available Tools',
    'outils.tools.title':     'Explore our <em>toolbox</em>',
    'outils.tools.lead':      'Each tool takes just a few minutes. Results are indicative and remain strictly confidential — nothing is saved without your consent.',
    'outils.tool1.title':     'Eligibility Calculator',
    'outils.tool1.desc':      'Evaluate in a few clicks the Canadian immigration programs you may be eligible for. Age, education, languages, experience: the calculator analyzes your profile and points you toward the most relevant pathways.',
    'outils.tool1.cta':       'Launch the Calculator',
    'outils.tool2.title':     'Express Entry Calculator',
    'outils.tool2.desc':      'Estimate your CRS score (Comprehensive Ranking System) out of 1200 points according to IRCC\'s official 2025-2026 grid. Detailed breakdown by category: age, education, languages, experience, spouse, transferability, and bonus points.',
    'outils.tool2.cta':       'Calculate My CRS Score',
    'outils.tool3.title':     'Quiz: Which program?',
    'outils.tool3.desc':      'Six simple questions to identify the immigration program best suited to your life project. Studies, work, family reunification, temporary stay: find the pathway that matches you.',
    'outils.tool3.cta':       'Start the Quiz',
    'outils.tool4.title':     'Cost Calculator',
    'outils.tool4.desc':      'Estimate the total budget of your immigration project: IRCC and MIFI government fees, biometrics, medical exams, document translation, language tests, and proof of funds.',
    'outils.tool4.cta':       'Calculate My Costs',
    'outils.tool5.title':     'IRCC Processing Times',
    'outils.tool5.desc':      'Consult current processing times for each type of application: study permits, work permits, visitor visas, permanent residence, sponsorship. Official IRCC data.',
    'outils.tool5.cta':       'View Processing Times',
    'outils.tool6.title':     'Evaluate Refusal Risk',
    'outils.tool6.desc':      'Before submitting your application, identify elements in your file that could raise questions with immigration officers. An honest self-assessment in 8 questions.',
    'outils.tool6.cta':       'Evaluate My File',
    'outils.tool7.title':     'Document Generator',
    'outils.tool7.desc':      'Prepare in minutes the standard documents for your file: invitation letter, study plan, checklists by application type. Editable templates compliant with common practices.',
    'outils.tool7.cta':       'Create a Document',
    'outils.tool8.title':     'Immigration Assistant',
    'outils.tool8.desc':      'Ask questions to our interactive assistant. It answers common questions about permits, visas, sponsorships, and permanent residence, based on an updated knowledge base.',
    'outils.tool8.cta':       'Ask a Question',
    'outils.tool9.title':     'Personalized Consultation',
    'outils.tool9.desc':      'The tools above offer a first read. For a personalized analysis and complete strategy, a consultation with our firm remains the best next step. Speak with a regulated immigration consultant.',
    'outils.tool9.cta':       'Book a Consultation',
    'outils.infobox.title':   'About These Tools',
    'outils.infobox.p1':      'All our tools are designed for information and guidance purposes. They rely on general rules and do not account for all the subtleties of your personal situation. For complete and reliable analysis, consultation with an authorized immigration representative (regulated consultant or lawyer) remains essential. Our tools store no personal information: everything you enter stays in your browser.',
    'outils.cta.title':       'Need <em>personalized analysis</em>?',
    'outils.cta.p1':          'Our tools are an excellent starting point. For a custom strategy tailored to your specific situation, let\'s discuss it in a consultation.',
    'outils.disclaimer.title':'Important Information',
    'outils.disclaimer.p1':   'The information presented on this site is provided for information purposes only and does not constitute legal advice. Every immigration situation is unique and depends on several factors. For any concrete action, a personalized consultation with an authorized immigration representative is necessary.',

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
    'calc.elig.intro.p1':     'Fill in the fields below. All information stays in your browser — nothing is sent or saved. The calculator applies the scoring grids published by <strong>IRCC</strong> and <strong>MIFI</strong>, as well as our experience with over 600 files since 2015.',
    'calc.elig.exp.h2.1':     'How does <em>this calculator</em> work?',
    'calc.elig.exp.p1':       'Our calculator is inspired by the <strong>Comprehensive Ranking System (CRS)</strong> used by IRCC in the Express Entry system, as well as Quebec\'s scoring grids for the PRTQ. It evaluates six major dimensions:',
    'calc.elig.exp.h2.2':     'FEER <em>Levels</em>, in a nutshell',
    'calc.elig.exp.p2':       'Since 2022, IRCC has used the <strong>FEER</strong> (Formation, Education, Experience, Responsibility) system to classify professions in the <strong>National Occupational Classification (NOC)</strong>. FEER levels 0, 1, 2, and 3 are generally eligible for federal economic programs. FEER 4 and 5 correspond to lower-skilled positions and open different programs (often provincial or for temporary foreign workers).',
    'calc.elig.infobox.title':'Limitations of this tool',
    'calc.elig.infobox.p1':   'This calculator provides an estimate. It does not replace personalized analysis by an authorized representative. Several additional factors can influence your actual eligibility: job offer, sibling in Canada, specific provincial PCP program, humanitarian considerations, background, etc. For reliable advice, book an appointment with our firm.',
    'calc.elig.cta.p1':       'An initial consultation allows us to examine your file in depth, identify the nuances this calculator doesn\'t capture, and build a realistic strategy.',

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
    'art.registre.hero.lead':  'As soon as you obtain permanent residence, a clock starts ticking. One day you will need to prove to IRCC exactly how many days you spent in Canada — with precise dates and supporting evidence. Your memory will not be enough. A travel log, kept from the start, can save you weeks of stress and protect your citizenship application.',

    // ── FAQ — 12 questions/réponses ─────────────────────────────────────────
    'faq.q1':  'How does a first consultation with MDPL Immigration work? <span class="faq-toggle">+</span>',
    'faq.a1':  '<p>The initial consultation allows us to assess your personal, professional, and family situation to identify possible immigration options. We take the time to listen to your project, answer your questions, and present the steps best suited to your reality.</p><p>This meeting is essential to build a realistic and personalized strategy. It can take place in person at our Laval office, or remotely by video conference for clients located abroad.</p>',

    'faq.q2':  'What types of files do you handle? <span class="faq-toggle">+</span>',
    'faq.a2':  '<p>Our firm handles a wide variety of files: study permits, work permits, visitor visas, electronic travel authorizations (eTA), family sponsorships, family reunifications, permanent residence applications (federal and Quebec programs), as well as temporary foreign worker processes (including LMIAs) for employers.</p><p>We assist both individuals and families as well as employers. If your situation is particular or complex, we evaluate it carefully to determine the best possible path.</p>',

    'faq.q3':  'How long does an immigration application take? <span class="faq-toggle">+</span>',
    'faq.a3':  '<p>Processing times vary enormously depending on the type of application, the country of residence, the program chosen, and the workload of the immigration authorities. A visitor visa application may take a few weeks, while a family sponsorship or permanent residence application can take several months or even more than a year.</p><p>IRCC regularly publishes reference processing times on its official website. During the initial consultation, we provide you with realistic timelines for your situation, taking into account the latest official updates.</p>',

    'faq.q4':  'Is it mandatory to use an immigration consultant? <span class="faq-toggle">+</span>',
    'faq.a4':  '<p>No, it is never mandatory to use an immigration consultant. Anyone can prepare and submit their application to the Canadian authorities themselves.</p><p>That said, the Canadian immigration system is complex and constantly evolving. A poorly prepared application can lead to a refusal, additional delays, or even consequences on future applications. Using an authorized representative provides a professional analysis of your file, a tailored strategy, and rigorous follow-up through to the decision.</p>',

    'faq.q5':  'What happens if my previous application was refused? <span class="faq-toggle">+</span>',
    'faq.a5':  '<p>A refusal is not necessarily the end of the road. Many of our clients came to us after one or more refusals and ultimately obtained their visa, permit, or permanent residence with a well-prepared new application.</p><p>The key is to precisely understand the grounds for refusal and address them concretely. During the consultation, we analyze the refusal letter, identify the weak points of the previous file, and propose a corrective strategy. In some cases, an appeal or judicial review may also be considered.</p>',

    'faq.q6':  'Do you accept clients from abroad? <span class="faq-toggle">+</span>',
    'faq.a6':  '<p>Yes, absolutely. Our firm supports clients from more than 40 countries. We offer remote consultations by video conference and all communications can be done by email or phone.</p><p>The vast majority of immigration processes can be completed without you needing to travel to Canada before obtaining your status. We manage the file preparation, online submission, and follow-up with the authorities remotely.</p>',

    'faq.q7':  'What documents should I prepare for the initial consultation? <span class="faq-toggle">+</span>',
    'faq.a7':  '<p>To get the most out of your initial consultation, we recommend preparing:</p><p>· a copy of your passport (identification page);<br />· your diplomas, transcripts, and professional certificates;<br />· your language test results if applicable (IELTS, TEF, etc.);<br />· the history of your trips, Canadian visas and permits (including refusals);<br />· a description of your family situation and your immigration project.</p><p>If you do not have all of these documents, that is fine: we can make an initial assessment with what you have. We will then tell you what will need to be completed.</p>',

    'faq.q8':  'What is the difference between an immigration consultant and a lawyer? <span class="faq-toggle">+</span>',
    'faq.a8':  '<p>In Canada, only regulated immigration consultants (members of the CICC) and lawyers in good standing with their provincial bar are authorized to represent clients before immigration authorities for compensation.</p><p>Immigration consultants specialize in immigration law and assist with administrative processes. Lawyers can additionally represent clients before the courts in legal proceedings (appeals, judicial review). For the vast majority of common immigration processes, support from a regulated consultant is entirely appropriate.</p>',

    'faq.q9':  'Can my spouse and children accompany me? <span class="faq-toggle">+</span>',
    'faq.a9':  '<p>In most cases, yes. For permanent residence, you generally include your spouse and dependent children in the same application. For temporary permits (studies, work), your spouse can often obtain an open work permit and your children can attend public school in Canada.</p><p>Conditions and processes vary depending on the program. During the consultation, we assess the options available for your entire family so that no one is left behind in your project.</p>',

    'faq.q10': 'What are your fees? <span class="faq-toggle">+</span>',
    'faq.a10': '<p>Our fees vary depending on the nature and complexity of the file. A visitor visa, spousal sponsorship, or economic permanent residence application do not involve the same workload.</p><p>During the initial consultation, we assess your file and present you with a clear mandate including the applicable fees. We want every client to know exactly what they are paying for and what is included, with no hidden costs.</p><p>These fees are in addition to mandatory government fees (IRCC, MIFI, biometrics, etc.), which we also inform you of in advance.</p>',

    'faq.q11': 'Does Quebec have different immigration rules than the rest of Canada? <span class="faq-toggle">+</span>',
    'faq.a11': '<p>Yes. Quebec has signed an agreement with the federal government that gives it particular authority over the selection of economic immigrants. This means that to settle in Quebec as a skilled worker, you generally need to first obtain a Quebec Selection Certificate (CSQ) before federal permanent residence.</p><p>Quebec also has its own requirements for the study permit (CAQ for studies), sponsorship (Quebec sponsorship undertaking), and the recruitment of foreign workers (Quebec component of the LMIA). Our firm is familiar with these specificities and regularly supports clients through the joint Quebec-federal processes.</p>',

    'faq.q12': 'Can you guarantee the approval of my file? <span class="faq-toggle">+</span>',
    'faq.a12': '<p>No immigration consultant or lawyer can guarantee the approval of a file. The final decision always rests with the immigration authorities (IRCC, MIFI, Service Canada).</p><p>Beware of guarantees: they are contrary to professional ethics and are often a warning sign. What we guarantee is rigorous, transparent, and professional work that maximizes the chances of success while remaining honest about the issues and risks of each file.</p>',

    'faq.footer.q': 'A question not on this list?',

    // ── POLITIQUE DE CONFIDENTIALITÉ ────────────────────────────────────────
    'privacy.updated':  '<em>Last updated: January 2025</em>',
    'privacy.h2.1':     '1. <em>Our Commitment</em>',
    'privacy.p1':       'MDPL Immigration places the utmost importance on the privacy of its clients and website visitors. This document explains what information we collect, for what purposes, how it is protected, and what your rights are.',
    'privacy.h2.2':     '2. <em>Information Collected</em>',
    'privacy.p2':       'On this site, we collect only the information you voluntarily provide to us: through the contact form, by email, or by phone. No personal information is collected without your knowledge when simply browsing the site. Our interactive tools (calculators, quiz) operate entirely within your browser: no data entered is transmitted to our servers.',
    'privacy.h2.3':     '3. <em>Use of Information</em>',
    'privacy.p3':       'The information you provide us is used exclusively to: respond to your information requests, schedule a consultation appointment, process your immigration file if you become a client, and occasionally inform you of legislative changes that may affect you. We never sell, rent, or share your personal information with third parties for commercial purposes.',
    'privacy.h2.4':     '4. <em>Professional Confidentiality</em>',
    'privacy.p4':       'As authorized immigration representatives, we are subject to a strict duty of professional confidentiality. Every client file is handled in the strictest confidence, in accordance with the rules of the College of Immigration and Citizenship Consultants (CICC) and the Privacy Act.',
    'privacy.h2.5':     '5. <em>Retention and Security</em>',
    'privacy.p5':       'Client information is stored in secure systems for the duration required by legal and professional obligations. Beyond that, it is destroyed according to applicable standards. Access to files is strictly limited to authorized members of our firm.',
    'privacy.h2.6':     '6. <em>Your Rights</em>',
    'privacy.p6':       'In accordance with Quebec and Canadian personal information protection legislation (notably Quebec\'s Law 25), you have the right to access your information, correct it, and request its removal within the limits provided by law. To exercise these rights, contact us at <a href="mailto:info@mdplimmigration.com" style="color: var(--gold); text-decoration: underline;">info@mdplimmigration.com</a>.',
    'privacy.h2.7':     '7. <em>Cookies and Analytics</em>',
    'privacy.p7':       'Our site does not use advertising tracking cookies. Technical cookies may be used for the proper functioning of the site. We do not use any third-party tracking tools for profiling purposes.',
    'privacy.h2.8':     '8. <em>Changes</em>',
    'privacy.p8':       'This policy may be updated. The date of the last revision appears at the top of this page. For any questions, do not hesitate to contact us.',

    // ── CONDITIONS D'UTILISATION ────────────────────────────────────────────
    'terms.updated': '<em>Last updated: January 2025</em>',
    'terms.h2.1':    '1. <em>Acceptance of Terms</em>',
    'terms.p1':      'By accessing the site mdplimmigration.com and using its contents or tools, you acknowledge having read these terms and agree to comply with them. If you do not accept these terms, we ask that you not use this site.',
    'terms.h2.2':    '2. <em>Nature of Published Information</em>',
    'terms.p2':      'The MDPL Immigration site has an informational purpose. The content presented — articles, service pages, interactive tools, FAQ — is written for general information purposes. It <strong>does not constitute legal advice</strong> and creates <strong>no client-representative relationship</strong> between you and our firm.',
    'terms.h2.3':    '3. <em>Use of Tools</em>',
    'terms.p3':      'The calculators, quizzes, simulators, and other interactive tools available on this site are provided for guidance purposes. Their results are indicative and do not account for all the nuances of an individual immigration file. No important decision should be made solely based on the results of these tools. For an analysis tailored to your situation, a personalized consultation with an authorized representative is necessary.',
    'terms.h2.4':    '4. <em>Intellectual Property</em>',
    'terms.p4':      'All site content — texts, images, logos, code, design — is protected by intellectual property laws and belongs to MDPL Immigration, unless otherwise noted. Any reproduction, distribution, or commercial use without prior written authorization is prohibited. Short quotations for informational or research purposes are permitted, provided the source is credited.',
    'terms.h2.5':    '5. <em>External Links</em>',
    'terms.p5':      'The site may contain links to third-party sites — notably IRCC, MIFI, and Service Canada. These links are provided for your convenience. MDPL Immigration is not responsible for the content, availability, or privacy policies of these external sites.',
    'terms.h2.6':    '6. <em>Limitation of Liability</em>',
    'terms.p6':      'MDPL Immigration strives to keep the site information accurate and up to date. However, immigration rules change frequently: fees, timelines, criteria, and programs can change without notice. MDPL Immigration cannot be held responsible for decisions made by a user based solely on information consulted on this site.',
    'terms.h2.7':    '7. <em>Professional Framework</em>',
    'terms.p7':      'MDPL Immigration is a firm of regulated immigration consultants. All immigration service delivery is governed by the rules of the College of Immigration and Citizenship Consultants (CICC). A client-representative relationship is established only upon the signing of a written mandate, following an initial consultation.',
    'terms.h2.8':    '8. <em>Changes to Terms</em>',
    'terms.p8':      'MDPL Immigration reserves the right to modify these terms of use at any time. The date of the last update appears at the top of this page. It is your responsibility to consult this page regularly.',
    'terms.h2.9':    '9. <em>Applicable Law</em>',
    'terms.p9':      'These terms are governed by the laws in force in Quebec and Canada. Any dispute relating to the use of the site falls under the exclusive jurisdiction of the courts of the judicial district of Laval, Quebec.',
    'terms.h2.10':   '10. <em>Contact</em>',
    'terms.p10':     'For any questions regarding these terms, contact us at <a href="mailto:info@mdplimmigration.com" style="color: var(--gold); text-decoration: underline;">info@mdplimmigration.com</a> or at 450 977-0066.',

    // ── BLOG — sections ─────────────────────────────────────────────────────
    'blog.about.caption': 'MDPL Immigration, Laval, Quebec',
    'blog.cats.eyebrow':  'Browse by Topic',
    'blog.cats.title':    'Blog Categories',
    'blog.cats.lead':     'Select a category to view the corresponding articles.',
    'blog.cat1.num':      'Category 01',
    'blog.cat1.title':    'Permanent Residence Applications',
    'blog.cat1.desc':     'Process, criteria, timelines, and common errors in Canadian PR files.',
    'blog.cat2.num':      'Category 02',
    'blog.cat2.title':    'Dual Citizenship',
    'blog.cat2.desc':     'Issues, rights, and legal considerations for citizens with dual citizenship.',
    'blog.cat3.num':      'Category 03',
    'blog.cat3.title':    'Refugee Protection',
    'blog.cat3.desc':     'Refugee protection, procedures before the Refugee Protection Division.',
    'blog.cat4.num':      'Category 04',
    'blog.cat4.title':    'Immigration Detention',
    'blog.cat4.desc':     'Immigration detention, detention reviews, and the rights of detained persons.',
    'blog.cat5.num':      'Category 05',
    'blog.cat5.title':    'Common Errors',
    'blog.cat5.desc':     'Common errors in immigration files and their possible consequences.',
    'blog.cat6.num':      'Category 06',
    'blog.cat6.title':    'Humanitarian Applications',
    'blog.cat6.desc':     'Humanitarian and compassionate considerations in immigration files.',
    'blog.cats.link':     'View Articles',
    'blog.search.label':  'Search',
    'blog.search.placeholder': 'e.g. CSQ, work permit, passport...',
    'blog.search.btn':    'Search',
    'blog.search.tag1':   'CSQ',
    'blog.search.tag2':   'Status',
    'blog.search.tag3':   'Work permit',
    'blog.search.tag4':   'Sponsorship',
    'blog.search.tag5':   'Detention',
    'blog.search.tag6':   'IRCC',
    'blog.search.tag7':   'Citizenship',
    'blog.search.tag8':   'Humanitarian',
    'blog.arts.eyebrow':  'Recent Publications',
    'blog.arts.title':    'Articles from the <em>blog</em>',
    'blog.arts.lead':     'Each article presents a practical situation. Click to read the full article.',
    'blog.arts.link':     'Read Article',
    'blog.art1.tag':      'Dual Citizenship',
    'blog.art1.title':    'Boarding refusal: when Canadian citizenship blocks the journey',
    'blog.art1.excerpt':  'A child born abroad, an eTA that seemed valid, and a brutal refusal at the airport. What no one had told them about Canadian citizenship, passports, and IRCC\'s rules.',
    'blog.art1.kw1':      'Canadian passport',
    'blog.art1.kw2':      'Boarding refusal',
    'blog.art1.kw3':      'eTA invalid',
    'blog.art1.kw4':      'Citizenship certificate',
    'blog.art2.tag':      'Permanent Residence',
    'blog.art2.title':    'Travel log and permanent residence: an essential tool for your citizenship application',
    'blog.art2.excerpt':  '1,095 days to prove to IRCC with exact dates. Your memory won\'t be enough — download our free log and start today.',
    'blog.art2.kw1':      'Travel log PR',
    'blog.art2.kw2':      '1,095 days citizenship',
    'blog.art3.tag':      'Quebec Immigration',
    'blog.art3.title':    'What is the CSQ? The Quebec Selection Certificate explained',
    'blog.art3.excerpt':  'MIFI, IRCC, sponsorship, document loss: everything you need to know about the CSQ and why you must keep it for life.',
    'blog.art3.kw1':      'CSQ',
    'blog.art3.kw2':      'MIFI',
    'blog.art3.kw3':      'Quebec immigration',
    'blog.art4.tag':      'Permanent Residence',
    'blog.art4.title':    'He lives in Ontario, works in Quebec: a sponsorship file that almost became a nightmare',
    'blog.art4.excerpt':  'Ottawa–Gatineau, intention of residence, CSQ wrongly required. How a misinterpretation by an officer almost compromised a permanent residence application.',
    'blog.art4.kw1':      'Joint sponsorship',
    'blog.art4.kw2':      'Ottawa Gatineau',
    'blog.art4.kw3':      'IRPA section 40',
    'blog.art5.tag':      'Permanent Residence',
    'blog.art5.title':    'He is the father, the child is Canadian — but proof of the bond remains essential',
    'blog.art5.excerpt':  'Birth certificate without the father\'s name, mandatory DNA test, delays of a year or more. What families need to know about Canadian citizenship by descent.',
    'blog.art5.kw1':      'Citizenship by descent',
    'blog.art5.kw2':      'DNA test IRCC',
    'blog.art6.tag':      'Child Sponsorship',
    'blog.art6.title':    '"She\'s been my daughter for years": adoption, guardianship and immigration to Canada from the Caribbean',
    'blog.art6.excerpt':  'Customary guardianship, unofficial adoption, child entrusted to family: why IRCC refuses these bonds and how to regularize the situation to immigrate to Canada.',
    'blog.art6.kw1':      'Adoption guardianship Canada',
    'blog.art6.kw2':      'Child sponsorship Caribbean',
    'blog.art7.tag':      'Temporary Foreign Workers',
    'blog.art7.title':    'ESDC LMIA inspections: what every employer must know before receiving that letter',
    'blog.art7.excerpt':  'An ESDC letter often arrives without warning. What you declared in the LMIA, your salary practices, and employment conditions will be scrutinized. What every TFWP employer must absolutely prepare.',
    'blog.art7.kw1':      'ESDC inspection',
    'blog.art7.kw2':      'LMIA employer',
    'blog.art7.kw3':      'TFWP compliance',
    'blog.art8.tag':      'Family Sponsorship',
    'blog.art8.title':    'Monogamy or polygamy: what you need to know before filing a spousal sponsorship',
    'blog.art8.excerpt':  'A polygamous regime recorded on a marriage certificate — even by error — can lead directly to a refusal. Real case, official correction required, and Quebec rules: what to verify before filing.',
    'blog.art8.kw1':      'Polygamy sponsorship',
    'blog.art8.kw2':      'Marriage certificate IRCC',
    'blog.art8.kw3':      'Matrimonial regime',
    'blog.arts.cta':      'See All Articles',
    'blog.faq.eyebrow':   'Frequently Asked Questions',
    'blog.faq.title':     'Frequently asked questions about <em>Canadian immigration</em>',
    'blog.faq.lead':      'This section brings together the main questions related to Canadian immigration processes. Its goal is to provide clear and accessible answers to help better understand the different stages of the process.',
    'blog.faq.q1':        'Can I immigrate to Canada easily? <span class="faq-toggle">+</span>',
    'blog.faq.a1':        '<p>Immigration to Canada cannot be considered a simple or automatic process. It depends on several factors, including your profile, education level, professional experience, and personal situation. Each program has specific criteria that must be met. A good understanding of these requirements is essential to assess your chances and guide your approach strategically.</p>',
    'blog.faq.q2':        'What are the steps to immigrate to Canada? <span class="faq-toggle">+</span>',
    'blog.faq.a2':        '<p>Immigration procedures vary depending on the program chosen, but they generally follow a similar structure: initial profile assessment, preparation of required documents, submission of the application, and follow-up with competent authorities. Each step must be completed with rigour to avoid delays or refusals.</p>',
    'blog.faq.q3':        'How long does an immigration application take? <span class="faq-toggle">+</span>',
    'blog.faq.a3':        '<p>Processing times vary depending on the program selected and the complexity of the file. Some processes can be relatively quick, while others require several months or more. A well-structured approach can help optimize timelines.</p>',
    'blog.faq.q4':        'What are common mistakes to avoid? <span class="faq-toggle">+</span>',
    'blog.faq.a4':        '<p>Several errors can compromise an immigration application: incomplete file, poor choice of program, insufficient understanding of eligibility criteria. These situations can lead to refusals or additional delays.</p>',
    'blog.faq.q5':        'Do I need an immigration consultant? <span class="faq-toggle">+</span>',
    'blog.faq.a5':        '<p>Using an immigration consultant is not mandatory, but it can represent a significant advantage in certain situations. A professional can help you better understand your options, structure your file, and avoid common mistakes.</p>',
    'blog.faq.q6':        'What is the purpose of this blog? <span class="faq-toggle">+</span>',
    'blog.faq.a6':        '<p>This blog was designed as an information space to make immigration processes more accessible. The content is based on real situations and aims to explain the different stages of the process clearly. It\'s a starting point for seriously learning about immigration to Canada.</p>',
    'blog.cta.title':     'A question related to <em>your situation?</em>',
    'blog.cta.desc':      'Blog articles are informative, but they do not replace a personalized assessment. Let\'s discuss your file in a consultation.',
    'blog.cta.btn1':      'Book an Appointment',
    'blog.cta.btn2':      'Contact Us',
    'blog.disclaimer.title': 'Important Notice',
    'blog.disclaimer.text':  'The information presented on this site is provided for informational purposes only and does not constitute legal advice. Each immigration situation is unique and depends on several factors. For any concrete steps, a personalized consultation with an authorized immigration representative is required.',

    // Article intro paragraphs (Group 5b - 9 articles)
    'art.adoption.intro.p1': 'She\'s called her mom since she was two years old. She taught her to walk, to read, to grow. She spent difficult nights with her, illnesses, school days. She loved her as if she had been born from her.',
    'art.csq.intro.p1': 'You\'re filing an immigration application for Quebec. Very quickly, an acronym comes up in every conversation, in every form: the CSQ. But what exactly is it? What is it for? When must you apply for it? And especially — why do so many people find themselves searching for it years after settling, when they thought they would never need it again?',
    'art.enfant.intro.p1': '"Your daughter is a Canadian citizen. She cannot board the plane without a Canadian passport."',
    'art.inspection.intro.p1': 'Recently, one of our employer clients received a letter from Service Canada / ESDC informing them that they were subject to an inspection pursuant to sections 209.3 and 209.4 of the Immigration and Refugee Protection Regulations (IRPR). Time to respond: approximately three weeks. Documents requested: considerable.',
    'art.parr.intro.p1': 'Filing an immigration form truthfully. Providing all requested documents. Following each step to the letter. And yet, finding yourself in a situation where an officer questions your place of residence, your intention, even your honesty.',
    'art.pere.intro.p1': 'He is a Canadian citizen. He knows he is the father. The child was born abroad, where his partner lived. And yet, on the official birth certificate of that country, his name does not appear.',

    // Article: adoption COMPLETE BODY TRANSLATION (58 items)
    'art.adoption.p2': 'Yet, the day she files her immigration application to Canada, she learns that this child — whom she considers hers for years — cannot simply be included in her file.',
    'art.adoption.p3': 'This is not a rare situation. We encounter it regularly in our family immigration practice. And each time, it reminds us how brutal the gap between human reality and legal reality can be.',
    'art.adoption.pullquote': 'In Canadian immigration, it is not the years of love that count on paper. It is legal documents. And they are not always where you expect to find them.',
    'art.adoption.h2.1': 'A cultural reality deeply rooted in several Caribbean countries',
    'art.adoption.p4': 'In many Caribbean countries — namely Haiti, Dominican Republic, Guadeloupe, Martinique, Trinidad, Jamaica, and several English-speaking islands — there is a firmly established tradition: that of caring for a child when their biological parents can no longer do so.',
    'art.adoption.p5': 'This reality can take several forms:',
    'art.adoption.p6': 'In these cultures, it is completely normal, even expected, to consider and present this child as your own child. It is not a lie — it is an emotional, daily, deep reality.',
    'art.adoption.p7': 'These families deserve to be recognized in their humanity. And it is precisely because we understand them that we must tell them the truth about what Canadian immigration truly requires.',
    'art.adoption.h2.2': 'The shock of immigration: when legal reality catches up',
    'art.adoption.p8': 'The critical moment almost always arrives at the same time: when the family files their immigration application and the officer asks for documents proving the link with the child.',
    'art.adoption.p9': 'Several families then produce a document signed by a notary: a guardianship, a custody document, or a parental power of attorney. They think it is sufficient. In many cases, it is not.',
    'art.adoption.p10': 'What families often do not know at the time of filing:',
    'art.adoption.alert.title': 'What several families discover too late',
    'art.adoption.p11': 'The document signed by the notary is not enough. Guardianship is not adoption. And love, however real it may be, does not replace an adoption judgment pronounced by a competent court. These realities often come as a shock at the time of filing — when they could have been anticipated years earlier.',
    'art.adoption.h2.3': 'Guardianship and adoption: two very different realities in Canadian law',
    'art.adoption.p12': 'It is essential to understand the fundamental distinction between these two concepts, as it is at the heart of most of the problems we encounter in these files.',
    'art.adoption.h3.1': 'What guardianship provides',
    'art.adoption.p13': 'Guardianship is a legal arrangement — sometimes notarized, sometimes judicial — that entrusts a person with the responsibility of caring for a child daily. It may include custody rights, medical decision-making authority, or school representation.',
    'art.adoption.p14': 'But guardianship does not break the legal bonds with biological parents. It does not create a new filiation bond. It does not make you the legal parent of the child in the sense of family law.',
    'art.adoption.h3.2': 'What legal adoption entails',
    'art.adoption.p15': 'Legal adoption, by contrast, creates a new permanent and definitive filiation bond. It extinguishes bonds with biological parents (with exceptions) and gives the adoptee all the rights and responsibilities of a parent. This is the bond that IRCC recognizes in family immigration applications.',
    'art.adoption.h2.4': 'Why IRCC is so strict on files involving children',
    'art.adoption.p16': 'This rigor is not arbitrary. It responds to important legal and ethical imperatives that Canada takes very seriously.',
    'art.adoption.h3.3': 'Child protection above all',
    'art.adoption.p17': 'IRCC analyzes files involving children with particular attention because the stakes are immense. Canadian authorities must notably prevent child trafficking and unauthorized movements for exploitation purposes; avoid false adoptions set up solely to facilitate immigration; protect the rights of biological parents who may not have consented to their child\'s departure; and respect international conventions on child protection, notably the Hague Convention.',
    'art.adoption.p18': 'These concerns are legitimate. They protect vulnerable children everywhere in the world. And they explain why the rules make no exception, even in cases where the family\'s intention is sincere and well-meaning.',
    'art.adoption.h3.4': 'The limits of notarial documents',
    'art.adoption.p19': 'A document signed by a notary has legal value in the country where it is executed. But it does not automatically create a filial relationship recognized by Canada. IRCC assesses whether the document in question corresponds to a legal adoption recognized by local laws and in line with international standards — not simply whether an official signature appears on it.',
    'art.adoption.p20': 'In several Caribbean countries, there is significant gray area: notarial documents that appear to confer parental rights, but which do not correspond to adoption in the Canadian legal sense. It is precisely in this gray area that most problematic cases are found.',
    'art.adoption.h2.5': 'Customary and informal adoption: a cultural reality not recognized in immigration',
    'art.adoption.p21': 'In several regions of the Caribbean, there is a form of customary adoption — a family arrangement recognized socially and culturally, but which does not involve formal judicial proceedings. The child is "given" to a relative, integrated into a new family, raised as theirs.',
    'art.adoption.p22': 'This practice is deeply human. It often represents the best possible solution in difficult contexts. But it is not recognized by IRCC as legal adoption under Canadian law.',
    'art.adoption.p23': 'For Canada, a valid adoption must be pronounced by a court or competent judicial authority in the country of origin; conform to local legislation on adoption; respect the principles of the Hague Convention on child protection, where applicable; and be accompanied by official documents recognized by the country of origin.',
    'art.adoption.h2.6': 'What is possible to do depending on countries',
    'art.adoption.p24': 'The situation is not necessarily without recourse. But options vary considerably depending on the country, the child\'s situation, the child\'s age, and the nature of the existing bond.',
    'art.adoption.h3.5': 'Possible avenues to explore',
    'art.adoption.p25': 'In some situations, solutions may exist — but they require time, rigor, and professional guidance:',
    'art.adoption.conditions.title': 'Options to explore depending on the situation',
    'art.adoption.h3.6': 'The particular case of Haiti',
    'art.adoption.p26': 'Adoption in Haiti deserves particular mention. Following the 2010 earthquake and the institutional upheavals that followed, Haiti\'s adoption system experienced major disruptions. Procedures are complex, delays can be very long, and files must be handled with extreme rigor to be recognized by IRCC.',
    'art.adoption.p27': 'If you have a link with a child in Haiti or another Caribbean country and you are considering Canadian immigration, it is imperative to obtain specialized legal advice before undertaking anything.',
    'art.adoption.h3.7': 'The particular case of the Dominican Republic',
    'art.adoption.p28': 'In the Dominican Republic, adoption procedures exist, but they are lengthy and subject to strict conditions. Foreign nationals wishing to adopt must meet specific criteria, and the process can take several years. Again, a thorough legal analysis is essential.',
    'art.adoption.h2.7': 'Common family mistakes in these cases',
    'art.adoption.p29': 'After years of guidance in similar situations, here are the mistakes we observe most often:',
    'art.adoption.h3.8': 'Waiting too long before regularizing',
    'art.adoption.p30': 'Most families care for the child for years without ever undertaking legal adoption proceedings. When it comes time to immigrate, it is often too late to start a process that can take two to five years. The sooner the process is undertaken, the better the chances of success.',
    'art.adoption.h3.9': 'Believing that a notary is enough',
    'art.adoption.p31': 'A notarial document is an official document, and many families think this is enough to prove their link with the child. But a notary confirms facts and signatures — it does not create a new legal filiation bond. Only a court can do that.',
    'art.adoption.h3.10': 'Underestimating timelines',
    'art.adoption.p32': 'Even when steps are taken, families systematically underestimate the time needed. Administrative delays in countries of origin, IRCC delays, requests for additional documents — it all adds up. An international adoption process can easily take 3 to 5 years.',
    'art.adoption.h3.11': 'Confusing emotional bonds and legal bonds',
    'art.adoption.p33': 'This is the fundamental confusion. Love, daily presence, shared years — all of this is real and precious. But in immigration, authorities can only assess what is documented and legally recognized. This reality is not a judgment on the quality of the relationship — it is simply the framework within which the system must function to protect all children.',
    'art.adoption.h2.8': 'What you need to know: anticipation, rigor, and guidance',
    'art.adoption.p34': 'If you recognize yourself in any of the situations described in this article, here are the essential points to remember:',
    'art.adoption.info.title': 'A message to affected families',
    'art.adoption.p35': 'We know these situations are painful. We know that the child you love is truly yours in your heart and in your daily life. We are not questioning that.',
    'art.adoption.p36': 'But precisely because we understand what this child means to you, we encourage you to act early, to get rigorous advice, and not to wait until the filing moment to discover obstacles. The best way to protect this child and your family is to understand the rules and anticipate them.',

    // Article: CSQ COMPLETE BODY TRANSLATION (51 items)
    'art.csq.p1': 'You are filing an immigration application for Quebec. Very quickly, an acronym comes up in every conversation, in every form: the CSQ. But what exactly is it? What is it for? When must you apply for it? And especially — why do so many people find themselves searching for it years after settling, when they thought they would never need it again?',
    'art.csq.p2': 'In our daily practice in Quebec immigration, the CSQ is at the heart of many questions and some frequent misunderstandings. People who do not know they must apply for it. Families surprised to receive a request for it in the middle of processing. Canadian citizens for ten years who must find this document for an unexpected administrative procedure.',
    'art.csq.p3': 'This article aims to answer clearly all these questions — without unnecessary jargon, with language accessible to anyone beginning or considering immigration to Quebec.',
    'art.csq.p4': 'The CSQ is not just an administrative formality. It is official confirmation that Quebec has chosen you. And this choice remains written in your file for a very long time.',
    'art.csq.h2.1': 'What is the Quebec Selection Certificate (CSQ)?',
    'art.csq.p5': 'This document confirms one essential thing: the Quebec government has evaluated your file and decided to select you to establish yourself in the province.',
    'art.csq.p6': 'Some people believe that the CSQ gives them legal status in Canada. This is not the case. The CSQ is a provincial selection — you must then obtain permanent residence from IRCC to have the right to settle legally in the country. Confusing the two can lead to very delicate situations.',
    'art.csq.alert.title': 'A frequent confusion with serious consequences',
    'art.csq.h2.2': 'Why does Quebec select its immigrants? The unique role of MIFI',
    'art.csq.p7': 'To understand the CSQ, you must first understand why Quebec has this selection power — a particularity that other Canadian provinces do not have in the same way.',
    'art.csq.h3.1': 'The role of MIFI',
    'art.csq.p8': 'MIFI evaluates applications according to Quebec criteria: level of French, academic training, professional experience, job offer in Quebec, connection with the province, capacity for economic and social integration. It is responsible for managing Quebec\'s economic immigration programs, issuing CSQs, and supporting immigrants in their integration once established.',
    'art.csq.h3.2': 'The role of IRCC',
    'art.csq.h2.3': 'In which immigration programs is the CSQ required?',
    'art.csq.p9': 'The CSQ is not required in all Canadian immigration programs. It concerns specifically people who wish to establish themselves in Quebec. But even among them, the time when the CSQ is requested varies depending on the program chosen.',
    'art.csq.h3.3': 'Economic programs: the CSQ is obtained first',
    'art.csq.p10': 'In economic immigration programs related to Quebec, the CSQ is generally the first concrete step in the process. The person must first submit an application to MIFI, obtain their CSQ, then use this document to submit their permanent residence application to IRCC.',
    'art.csq.p11': 'The main programs concerned are:',
    'art.csq.p12': 'In these cases, the typical pathway looks like this:',
    'art.csq.h3.4': 'The Quebec Experience Program (PEQ): simplified access',
    'art.csq.p13': 'The PEQ deserves particular attention as it is often the fastest path to permanent residence in Quebec for those already established there. It is aimed at temporary workers and graduates of Quebec programs who master French and have recent work experience in Quebec. The CSQ process is integrated into this program, which allows generally shorter delays than other economic pathways.',
    'art.csq.h2.4': 'CSQ and family sponsorship in Quebec: what many people do not know',
    'art.csq.p14': 'This is where most of the surprises are found — and the questions we answer very regularly in our practice.',
    'art.csq.h3.5': 'How sponsorship works in Quebec',
    'art.csq.p15': 'When a permanent resident or Canadian citizen living in Quebec wishes to sponsor a family member, here is what typically happens:',
    'art.csq.p16': 'Many families sponsoring a relative in Quebec think the process is entirely at the federal level, as for other provinces. When they receive a request from IRCC regarding the CSQ several months after submitting their file, they often think there is a problem or error in their file.',
    'art.csq.p17': 'This is not the case. This request is part of the normal process for all sponsorship files in Quebec. It is simply the moment when the provincial process is inserted into the federal process.',
    'art.csq.info.title': 'Why this CSQ request surprises so many families',
    'art.csq.h2.5': 'Why should you keep your CSQ after permanent residence? A document that lasts a lifetime',
    'art.csq.p18': 'It is natural to think that once settled, once your status is obtained, all these old immigration documents are no longer useful. Some put them away in a forgotten drawer. Others lose them during a move. Still others deliberately throw them away, believing they have definitively turned the page.',
    'art.csq.p19': 'But administrative reality is different. Several situations can arise years later — and bring this document to the forefront unexpectedly.',
    'art.csq.h2.6': 'Situations where the CSQ is still requested years later',
    'art.csq.p20': 'Over the years, here are the concrete situations where clients have contacted us after losing their CSQ — or never finding it again:',
    'art.csq.h3.6': 'Educational institutions',
    'art.csq.h3.7': 'Integration assistance programs',
    'art.csq.p21': 'Certain government or para-government programs to assist immigrants — integration services, French language courses, employment assistance — may request a copy of the CSQ to confirm your eligibility or document your migration journey.',
    'art.csq.h3.8': 'Judicial or administrative procedures',
    'art.csq.p22': 'In some legal or administrative contexts — divorce, succession, file review, social assistance or benefit requests — historical documents related to immigration may be required to trace your official journey. The CSQ is part of this.',
    'art.csq.h3.9': 'Requests for personal information',
    'art.csq.p23': 'If you ever request access to your own immigration files or if you need to document your migration trajectory for any reason, the CSQ is an essential documentary piece.',
    'art.csq.h3.10': 'The CSQ after Canadian citizenship',
    'art.csq.p24': 'Even people who have become Canadian citizens many years ago may find themselves in a situation where this document is requested of them. Citizenship erases several obligations related to immigration, but it does not erase the administrative history related to your file. This document existed, it is part of your official journey, and certain institutions may need to refer to it.',
    'art.csq.p25': 'Several of our clients contact us years after their citizenship to tell us that an organization is asking them for a copy of their old CSQ. This is not a rare situation. That is why we say from the beginning: keep this document.',
    'art.csq.h2.7': 'Common mistakes concerning the CSQ',
    'art.csq.p26': 'After years of guidance in Quebec immigration files, here are the mistakes we observe most often related to the CSQ:',
    'art.csq.h3.11': 'Believing that the CSQ is a legal status',
    'art.csq.p27': 'The CSQ confers no legal status to reside or work in Canada. It is only a provincial selection. Without permanent residence issued by IRCC, you do not have the right to establish yourself legally in the country based solely on your CSQ. This confusion can lead to precarious status or unauthorized work situations.',
    'art.csq.h3.12': 'Not responding to the CSQ request in a sponsorship file',
    'art.csq.p28': 'As explained above, family sponsorship applications in Quebec involve a CSQ step during processing. Some sponsors, surprised or uncertain, delay responding to this invitation from IRCC — or do not understand the steps to take with MIFI. This delay can significantly slow down overall processing, or even result in file closure in some cases.',
    'art.csq.h3.13': 'Throwing away or losing the CSQ after obtaining permanent residence',
    'art.csq.p29': 'Many people make the mistake of throwing away their old immigration documents once their status is obtained. The CSQ is one that should absolutely not be lost. As we have seen, it can be requested years later in various and often unexpected contexts.',
    'art.csq.h3.14': 'Not keeping a digital copy',
    'art.csq.p30': 'In addition to the paper copy, it is strongly recommended to digitize the CSQ and keep it in a secure space — an online storage service, an external hard drive, or a secure shared folder with a trusted person. A physical document can deteriorate, burn, or be lost during a move. A digital copy is simple insurance to set up.',
    'art.csq.h3.15': 'Confusing the roles of MIFI and IRCC',
    'art.csq.h2.8': 'Have you lost your CSQ? Here are the steps to obtain a copy',
    'art.csq.p31': 'If you have lost your Quebec Selection Certificate, the situation is not without recourse — but it requires procedures and patience.',
    'art.csq.h2.9': 'The importance of keeping all your old immigration documents',
    'art.csq.p32': 'The advice applies beyond the CSQ alone. All of your old immigration documents deserve careful preservation, for similar reasons:',
    'art.csq.h2.10': 'What you need to know about the CSQ',
    'art.csq.h3.16': 'Have you got questions about your CSQ or your Quebec immigration file? Let\'s talk.',
    'art.csq.p34': 'CSQ request, sponsorship in Quebec, copy recovery, procedures with MIFI or IRCC — every situation is different and deserves personalized analysis. At MDPL Immigration, we support our clients through all stages of Quebec immigration.',
    'art.csq.p35': 'Founded in Laval in 2015, MDPL Immigration supports individuals, families, and employers in their Canadian and Quebec immigration procedures. This article is provided for informational purposes only and does not constitute legal advice. Immigration programs and their requirements may evolve. For any concrete steps, consult an authorized immigration representative.',
    'art.csq.info.title': 'A document that follows you for life',
    'art.csq.p33': 'The CSQ is not just another document. It officially marks your entry into the Quebec immigration process. And even when this process has been over for a long time, this document continues to exist in your administrative history — and can resurface at any moment. The best decision you can make is to keep it right now, in multiple copies, in different places.',

    // Article: enfant COMPLETE BODY TRANSLATION (58 items)
    'art.enfant.p1': 'That is the sentence this mother heard at the check-in counter, the day of departure to Canada. A sentence she did not see coming. Everything seemed in order: the tickets, the luggage, the documents. Everything, except one thing she had no idea about.',
    'art.enfant.p2': 'This case is not isolated. Every year, families of Canadian citizens living abroad find themselves in identical situations — stuck at an airport, with no immediate solution, no quick recourse, sometimes thousands of kilometers from the nearest accessible Canadian embassy.',
    'art.enfant.p3': 'This article explains exactly what happened, why, and what every Canadian citizen parent must absolutely know before traveling to Canada with a child born abroad.',
    'art.enfant.h2.1': 'A child born abroad: Canadian citizen <em>without knowing it</em>',
    'art.enfant.p4': 'Our client is a Canadian citizen. She has been living abroad for several years, in a French overseas department. Her daughter was born in that territory — outside Canada, but to a Canadian mother.',
    'art.enfant.p5': 'In Canadian law, a child born abroad to a Canadian citizen parent automatically has the right to Canadian citizenship by descent, in most cases covered by the Citizenship Act. This right exists from birth — but it only becomes effective for travel purposes once officially recognized by IRCC.',
    'art.enfant.p6': 'For several years, before undertaking these procedures, the mother traveled with her daughter without problems. The child used:',
    'art.enfant.p7': 'Everything worked. Flights to Canada proceeded normally. The mother had no reason to think that something was going to change.',
    'art.enfant.p8': 'Canadian citizenship by descent exists from birth — but its consequences on travel rights only become binding once officially recognized by IRCC.',
    'art.enfant.h2.2': 'Recognition of citizenship: <em>good news with heavy consequences</em>',
    'art.enfant.p9': 'One day, the mother decided to do things properly. She started the process to officially have her daughter\'s Canadian citizenship recognized with Immigration, Refugees and Citizenship Canada (IRCC). The file was submitted, processed, and citizenship was officially recognized. A Canadian citizenship certificate was issued.',
    'art.enfant.p10': 'For the mother, it was a logical step, positive, almost administrative. She did not realize that this procedure would radically change her daughter\'s travel conditions.',
    'art.enfant.h3.1': 'What no one clearly explained to her',
    'art.enfant.p11': 'From the moment Canadian citizenship is officially recognized by IRCC, the child\'s status changes in all government systems. The child is no longer treated as a foreign national visiting Canada — she is a full Canadian citizen.',
    'art.enfant.p12': 'And for Canadian citizens, the rules for traveling to Canada are absolute:',
    'art.enfant.alert.title': 'Fundamental rule — IRCC',
    'art.enfant.p13': 'Every Canadian citizen must absolutely enter Canada with a valid Canadian passport. No other document replaces this passport to board an international flight destined for Canada.',
    'art.enfant.p14': 'The mother believed her daughter\'s eTA was still valid. It was technically — but it had become unusable from the moment the child was registered as a Canadian citizen.',
    'art.enfant.h2.3': 'Why the eTA becomes invalid after recognition <em>of Canadian citizenship</em>',
    'art.enfant.p15': 'An Electronic Travel Authorization (eTA) is a document reserved for foreign nationals from visa-exempt countries who wish to transit through Canada or travel there by plane. It is linked to the applicant\'s foreign passport and their status as a non-Canadian citizen.',
    'art.enfant.p16': 'As soon as a person obtains Canadian citizenship — whether born in Canada, naturalized, or recognized by descent — they are no longer eligible for an eTA. The airline control systems and Canada Border Services Agency (CBSA) systems are linked to IRCC records. They automatically detect this change in status.',
    'art.enfant.p17': 'Concretely, here is what happens:',
    'art.enfant.p18': 'Requesting a new eTA in an emergency is also not a solution. The system refuses the application as soon as it detects the person\'s Canadian citizenship. There is no legal workaround to this rule.',
    'art.enfant.h2.4': 'The shock at the airport: <em>boarding refusal</em>',
    'art.enfant.p19': 'On departure day, the mother and daughter present themselves at the airport as usual. The tickets are booked, the suitcases are ready, the eTA is there on the French passport. Nothing suggests a problem.',
    'art.enfant.p20': 'But at check-in, the airline agent consults the system. A few seconds later, the answer comes:',
    'art.enfant.p21': '"Your daughter is registered as a Canadian citizen. She cannot board without a valid Canadian passport."',
    'art.enfant.p22': 'The mother pulls out the Canadian citizenship certificate. She explains the situation. The agent is sorry, but his response is firm:',
    'art.enfant.p23': 'The citizenship certificate does not allow you to board a plane to Canada. Only a valid Canadian passport is accepted.',
    'art.enfant.p24': 'This official document, issued by IRCC itself, which proves beyond any doubt that the child is a Canadian citizen, is worth nothing at the check-in counter of an international airline.',
    'art.enfant.h3.2': 'Why the citizenship certificate is not enough',
    'art.enfant.p25': 'The citizenship certificate is a Canadian civil status document. It proves nationality, but it is not a travel document. Airlines are not authorized to accept this document in place of a valid passport to transport a passenger to Canada. This rule is imposed by the Government of Canada as part of the Passenger Safety program administered by Transport Canada.',
    'art.enfant.p26': 'In summary:',
    'art.enfant.h2.5': 'Living in a French overseas department: <em>uncommon procedures</em>',
    'art.enfant.p27': 'The situation of this family was even more complex. They did not live in metropolitan France, nor in a major city with easy access to Canadian consular services. They lived in an overseas French department — a geographically isolated territory, without direct Canadian consular representation.',
    'art.enfant.p28': 'For Canadian citizens living in these territories, undertaking procedures with a Canadian embassy or consulate often involves:',
    'art.enfant.h2.6': 'Solutions and lessons: what we learned from this case',
    'art.enfant.h3.3': 'Planning ahead: the essential step',
    'art.enfant.h3.4': 'Requesting a Canadian passport: the timeline everyone should know',
    'art.enfant.h3.5': 'Special travel authorization: when a passport is not ready in time',
    'art.enfant.h2.7': 'Common misunderstandings about Canadian citizenship and travel',
    'art.enfant.p29': 'Based on our experience with cases like this, here are the most common misunderstandings about Canadian citizenship and travel:',
    'art.enfant.h3.6': 'Misunderstanding #1: The citizenship certificate is a travel document',
    'art.enfant.h3.7': 'Misunderstanding #2: The eTA remains valid after obtaining Canadian citizenship',
    'art.enfant.h3.8': 'Misunderstanding #3: Getting a Canadian passport is just a formality that can be done on the way',
    'art.enfant.h2.8': 'What every parent should absolutely know',
    'art.enfant.p30': 'If you are a Canadian citizen living abroad with a child born in that country, here is what you must never forget:',
    'art.enfant.info.title': 'A simple rule that saves time and prevents heartbreak',
    'art.enfant.p31': 'As soon as your child\'s Canadian citizenship is recognized, a Canadian passport becomes essential for travel. Do not wait. Plan ahead. Contact the nearest Canadian embassy or consulate now, even if you think you won\'t need it for several months. The processing time is always longer than expected, and surprises at the airport cost far more than the cost of a passport obtained calmly, in advance.',

    // Article: docs COMPLETE BODY TRANSLATION (38 items)
    'art.docs.intro.p1': 'An eligible file can be refused simply because a document was not submitted on time. In immigration, the deadline is not a formality — it is a binding rule. Here is what you need to know, and what to do when circumstances make obtaining a document impossible.',
    'art.docs.p1': 'In Canadian immigration, deadlines are absolute. A single document submitted one day too late can cause an entire file to be closed, a visa to be denied, or a refusal to be issued. No exceptions, no grace periods, no second chances.',
    'art.docs.p2': 'This is not just theory. We have seen it happen dozens of times in our practice. Eligible people, documents that exist and are legitimate, but submitted after the deadline. And a refusal that could have been avoided with a few days of foresight.',
    'art.docs.p3': 'This article explains why document deadlines are so strict in Canadian immigration, what happens when they are missed, and what solutions exist — or do not exist — when circumstances make it impossible to meet them.',
    'art.docs.h2.1': 'Why document deadlines are non-negotiable in Canadian immigration',
    'art.docs.p4': 'To understand this absolute rule, you must first understand how immigration files are processed.',
    'art.docs.p5': 'When you submit an immigration application to Canada — whether it is for a work permit, study permit, permanent residence, or sponsorship — your file is assigned to an officer. That officer has a timeline to complete the assessment. The processing times you see published by IRCC (six months, one year, etc.) are built around this principle.',
    'art.docs.p6': 'The officer must review your file, verify your eligibility, conduct background checks, assess your documents, and issue a decision — all within a defined period. If they do not, your file can be returned or closed.',
    'art.docs.p7': 'Document deadlines are part of this rigid framework. When IRCC sets a deadline for submitting a document, it means the officer needs that document by that date to complete the assessment on schedule. A document submitted after the deadline may arrive after the officer has already drawn conclusions or closed the file.',
    'art.docs.h2.2': 'The consequences of a missed deadline',
    'art.docs.p8': 'Missing a document submission deadline can have several consequences:',
    'art.docs.alert.title': 'Missing deadlines: the consequences',
    'art.docs.p9': 'Your file may be closed without a final decision. You may receive a procedural refusal because the requested documents were not provided. IRCC may issue a refusal based on incomplete information. You lose your processing fees. You may need to file a new application from scratch.',
    'art.docs.p10': 'In some cases, there is a possibility to appeal or request reconsideration. But this is not guaranteed, and the appeal process is long, expensive, and not always successful.',
    'art.docs.h2.3': 'What counts as "on time"?',
    'art.docs.p11': 'When IRCC sets a deadline — for example, "Please provide the documents by June 15, 2025" — what exactly does "on time" mean?',
    'art.docs.p12': 'In most cases, IRCC considers a document received "on time" if it arrives in their system by the deadline date. This includes:',
    'art.docs.p13': 'There is no grace period. June 16 is too late, even if your document is in transit.',
    'art.docs.h2.4': 'Circumstances where documents cannot be obtained in time',
    'art.docs.p14': 'Sometimes, despite all your efforts, you cannot obtain a required document by the deadline. This can happen for many legitimate reasons:',
    'art.docs.h3.1': 'Administrative delays in the country of origin',
    'art.docs.p15': 'Obtaining a police certificate, birth certificate, or divorce decree can take weeks or months, depending on the country. Some countries have slow administrative systems or are affected by geopolitical events. By the time you have the document, the IRCC deadline may have already passed.',
    'art.docs.h3.2': 'Lost or inaccessible documents',
    'art.docs.p16': 'Original documents may be in a country you cannot access. A divorce decree may be held by an ex-spouse who refuses to provide it. A police certificate may require you to return to your country of origin for processing — a journey that takes time and money.',
    'art.docs.h3.3': 'Medical or personal circumstances',
    'art.docs.p17': 'You may be unable to obtain a required medical exam by the deadline due to illness, injury, or lack of access to approved doctors in your area. A required notarization may be impossible if you are isolated or in quarantine.',
    'art.docs.h2.5': 'What you can do if you cannot meet a deadline',
    'art.docs.p18': 'If you realize you cannot obtain a document by the deadline, do not simply ignore the request. Here are your options:',
    'art.docs.h3.4': 'Contact IRCC immediately and explain your situation',
    'art.docs.p19': 'Write to the officer assigned to your file (if you know their name) or contact the office processing your application. Explain why you cannot obtain the document on time. Include specific reasons: delays from administrative authorities, the need to travel, medical circumstances, etc. Provide evidence of your efforts to obtain the document (correspondence with authorities, confirmation letters from organizations, etc.).',
    'art.docs.p20': 'This will not guarantee an extension, but it shows good faith and gives the officer context to potentially grant a brief extension or assess your file with the documents you do have.',
    'art.docs.p21': 'Request an extension of the deadline. While IRCC rarely grants extensions, they sometimes do if the circumstances are compelling. Your request must be in writing and explain specifically why you need more time.',
    'art.docs.p22': 'Submit what you have, even if incomplete. If you cannot obtain the original document, submit a certified copy, a notarized statement, or other supporting evidence. Explain in writing why the full document is unavailable. The officer may proceed with what you have provided and issue a conditional approval or request additional clarification later.',
    'art.docs.p23': 'Know that after the deadline passes, IRCC can close your file or issue a refusal based on incomplete information. If this happens, you may have the option to request a reconsideration or file a new application.',
    'art.docs.h2.6': 'The documents that cause the most problems',
    'art.docs.p24': 'Based on our experience, these documents are the most frequently submitted late — or not submitted at all:',
    'art.docs.p25': 'Police certificates from countries with slow administrative systems (India, Pakistan, Philippines, some African nations). Medical exams (especially for applicants in remote areas). Notarized or certified documents. Language test results. Proof of funds (bank statements, investment documents). Original diplomas or educational credentials.',
    'art.docs.h2.7': 'Prevention: what you should do from day one',
    'art.docs.p26': 'The best strategy is prevention. From the moment you receive a document request from IRCC:',
    'art.docs.p27': '1. Read the deadline carefully. 2. Note it in your calendar with a reminder at least two weeks before. 3. Gather all documents you have immediately. 4. Identify which documents you still need. 5. Contact the relevant authorities now, do not wait. 6. Track the status of each document. 7. Have a backup plan for each document (e.g., if the original is delayed, what certified copy or alternative can you submit?).',
    'art.docs.info.title': 'Deadlines in immigration are not suggestions',
    'art.docs.p28': 'Canadian immigration deadlines are not flexible. They exist to structure the process and ensure fairness. But they are also absolute. When IRCC sets a deadline, treat it as binding. Do not assume there will be grace. Do not assume you can submit late. Do not assume the officer will be lenient. The safest approach is always to submit documents well before the deadline, with time to spare for unexpected delays or complications.',

    // Article: inspection COMPLETE BODY TRANSLATION (48 items)
    'art.inspection.intro.p1': 'Recently, one of our employer clients received a letter from Service Canada / ESDC informing them that they were subject to an inspection under Articles 209.3 and 209.4 of the Immigration and Refugee Protection Regulations (IRPR). Time to respond: approximately three weeks. Documents requested: considerable.',
    'art.inspection.p1': 'An ESDC inspection is not a suggestion. It is a formal investigation by the Canadian federal government into an employer\'s labour practices, work environment, and compliance with immigration regulations. The consequences of failing an inspection can be severe: fines, loss of authorization to hire foreign workers, reputational damage, and sometimes criminal charges.',
    'art.inspection.p2': 'Yet many employers do not know what to expect when they receive this letter. Some panic. Some ignore it. Some think they can handle it alone. Few understand how serious it is, or what the actual process looks like.',
    'art.inspection.p3': 'This article explains what an ESDC inspection is, why employers are targeted, what the process looks like, what can go wrong, and what you should do if you receive an inspection letter.',
    'art.inspection.h2.1': 'What is an ESDC inspection?',
    'art.inspection.p4': 'Employment and Social Development Canada (ESDC) is the federal agency responsible for administering labour market programs in Canada, including the Temporary Foreign Worker Program (TFWP) and the International Mobility Program (IMP). They are also responsible for enforcing compliance with labour-related regulations.',
    'art.inspection.p5': 'An ESDC inspection is a formal investigation conducted under the authority of the Immigration and Refugee Protection Act and its Regulations. The inspectors are authorized to demand documents, conduct interviews, and assess whether an employer has complied with the rules governing the hiring and employment of foreign workers.',
    'art.inspection.h2.2': 'Why do employers get inspected?',
    'art.inspection.p6': 'ESDC does not inspect every employer randomly. Inspections are typically triggered by:',
    'art.inspection.h3.1': 'Complaints from employees or third parties',
    'art.inspection.p7': 'A foreign worker files a complaint about unpaid wages, unsafe conditions, or violations of the employment contract. A competitor reports suspected violations. A union or advocacy organization flags irregularities.',
    'art.inspection.h3.2': 'Red flags in the application file',
    'art.inspection.p8': 'The employer\'s original Labour Market Impact Assessment (LMIA) application contained inconsistencies or raised questions. Job duties, wages, or work conditions seemed out of line with the employer\'s business profile.',
    'art.inspection.h3.3': 'Routine compliance audits',
    'art.inspection.p9': 'ESDC periodically selects employers to audit compliance in a given region or sector. It is not necessarily because of suspected violations — it is a regulatory checkup.',
    'art.inspection.h3.4': 'Change of ownership or significant operational changes',
    'art.inspection.p10': 'If a company changes ownership or structure significantly while employing foreign workers, ESDC may inspect to ensure continuity of compliance.',
    'art.inspection.h2.3': 'What happens during an inspection?',
    'art.inspection.p11': 'When you receive an inspection notice, ESDC is asking you to produce documents and records. The inspection can be conducted in different ways:',
    'art.inspection.h3.5': 'Desk audit (document review only)',
    'art.inspection.p12': 'The employer submits requested documents by mail or email. ESDC reviews them at their office without visiting the workplace. This is the most common type.',
    'art.inspection.h3.6': 'On-site inspection',
    'art.inspection.p13': 'An ESDC inspector visits the workplace to verify conditions, interview workers, and review documents on-site. This is more intrusive and signals a higher level of concern.',
    'art.inspection.h3.7': 'Hybrid inspection',
    'art.inspection.p14': 'Documents are submitted first, then an on-site visit may follow based on what the desk audit reveals.',
    'art.inspection.h2.4': 'What documents does ESDC typically request?',
    'art.inspection.p15': 'The documents requested vary, but commonly include:',
    'art.inspection.p16': 'Employment contracts with foreign workers. Proof of wages paid (pay stubs, bank transfers, payroll records). Work schedules and hours worked. Records of breaks and time off. Workplace safety documentation. Training records. Accommodation details (if applicable). Communications with employees. Performance evaluations. Any complaints or incidents reported.',
    'art.inspection.h2.5': 'Common violations that lead to inspection failures',
    'art.inspection.p17': 'Based on our experience advising employers, these are the most common violations that trigger inspection failures:',
    'art.inspection.h3.8': 'Wage violations',
    'art.inspection.p18': 'Paying workers less than promised in their contract. Deducting excessive fees (housing, tools, clothing, etc.) Failing to pay overtime at required rates. Paying in cash without documented evidence.',
    'art.inspection.h3.9': 'Working condition violations',
    'art.inspection.p19': 'Requiring work hours that exceed what was promised. Unsafe or substandard working conditions. Inadequate breaks or time off. Conditions that differ significantly from what was described in the LMIA.',
    'art.inspection.h2.6': 'What happens if you fail an inspection?',
    'art.inspection.p20': 'If ESDC determines you have violated regulations, the consequences can be serious:',
    'art.inspection.p21': 'You lose your authorization to hire temporary foreign workers (immediate suspension). You may be fined up to $50,000 per violation. You may be banned from the program for a period of time (typically 1-5 years). Criminal charges may be laid in serious cases (human trafficking, labour exploitation). Your company\'s reputation suffers. Current foreign workers may have their status reviewed or revoked.',
    'art.inspection.alert.title': 'An inspection failure is not just an administrative inconvenience',
    'art.inspection.h2.7': 'How to prepare for an inspection',
    'art.inspection.p22': 'If you receive an inspection notice, here is what you should do:',
    'art.inspection.p23': '1. Do not panic, but take it seriously. 2. Do not ignore the notice or fail to meet the deadline. 3. Gather all requested documents immediately. 4. Hire a lawyer or immigration consultant experienced in labour law and TFWP compliance. 5. Review your records for any obvious discrepancies or violations. 6. Prepare honest answers to expected questions. 7. Ensure all documentation is complete and organized. 8. Do not destroy or alter any documents.',
    'art.inspection.h2.8': 'Common mistakes employers make during inspections',
    'art.inspection.p24': 'We have seen employers make critical errors that turned a minor violation into a serious problem:',
    'art.inspection.h3.10': 'Submitting incomplete or disorganized documentation',
    'art.inspection.p25': 'ESDC cannot assess compliance if the documents are missing or unclear. Incomplete submissions suggest the employer is hiding something.',
    'art.inspection.p26': 'Providing inconsistent explanations for discrepancies. One response says the worker worked 40 hours per week; another document shows 50. The inconsistency raises suspicion.',
    'art.inspection.p27': 'Trying to hide or downplay violations. If ESDC discovers you intentionally withheld information, the consequences are much worse.',
    'art.inspection.p28': 'Not bringing legal representation to an on-site inspection. Anything you say can be used against you. A lawyer protects your rights.',
    'art.inspection.h2.9': 'Can you appeal an inspection decision?',
    'art.inspection.p29': 'If you receive an unfavorable decision from ESDC, you have limited recourse. There is no formal appeal process within ESDC itself. However, you may:',
    'art.inspection.p30': 'Request a reconsideration of the decision if new evidence emerges. Challenge the decision through judicial review in Federal Court (expensive and complex). File a complaint with your Member of Parliament or a provincial labour board if you believe the inspection was conducted improperly.',
    'art.inspection.h2.10': 'Prevention: how to stay compliant',
    'art.inspection.p31': 'The best strategy is to avoid inspection failures in the first place:',
    'art.inspection.p32': '1. Be meticulous about matching employment contracts to actual working conditions. 2. Pay workers exactly as promised, on time, in documented form. 3. Maintain accurate, detailed records of hours worked, wages paid, and conditions provided. 4. Ensure workplace safety and conditions are excellent. 5. Train supervisors on compliance requirements. 6. Respond quickly to any worker complaints. 7. Conduct internal audits before ESDC does. 8. Keep a lawyer on retainer for questions.',
    'art.inspection.info.title': 'An inspection is a serious matter, but not unsolvable',
    'art.inspection.p33': 'If you receive an ESDC inspection notice, treat it as a legal matter requiring professional help. Do not assume you will pass, but do not assume you will fail either. Many inspection outcomes depend on how you respond, what documentation you provide, and whether you have professional representation. The time to prepare is when you receive the letter, not months later.',
    'art.inspection.h2.11': 'Getting help with an ESDC inspection',
    'art.inspection.p34': 'If you are facing an inspection, do not handle it alone. Immigration lawyers and consultants experienced in TFWP compliance can help you prepare, respond, and navigate the process. The cost of professional help is far less than the cost of a failed inspection.',

    // Article: monogamie COMPLETE BODY TRANSLATION (31 items)
    'art.mono.intro.p1': 'In Canada, polygamy is not recognized for immigration purposes. A marital status incorrectly recorded on a marriage certificate — even by error — can cause a spousal sponsorship to fail. Here is why, and how we resolved this problem in a real file.',
    'art.mono.p1': 'One of our clients had been in a stable relationship for years. They decided to sponsor their spouse for permanent residence in Canada. Everything seemed straightforward. The relationship was genuine. The paperwork was in order. And then, one question stopped everything cold: "Is your spouse currently in a monogamous relationship with you, or in a polygamous union?"',
    'art.mono.p2': 'This is not a hypothetical question. It is a mandatory requirement in Canadian immigration law. And the answer can make or break a sponsorship application.',
    'art.mono.p3': 'This article explains why monogamy matters in Canadian immigration, what happens when it is not confirmed, and what you need to know before filing a spousal sponsorship application.',
    'art.mono.h2.1': 'Why does Canada require monogamy for spousal sponsorship?',
    'art.mono.p4': 'Canadian law does not recognize polygamous unions. This is not a statement about the validity of a person\'s cultural or religious practices. It is a statement about what the Canadian legal system will and will not accept for the purposes of immigration.',
    'art.mono.p5': 'When a person sponsors a spouse for permanent residence, they are claiming a legal relationship that carries specific rights and responsibilities under Canadian law. The sponsored person will have access to family benefits, inheritance rights, medical decision-making authority, and other legal statuses that are tied to marriage as understood in Canadian law — as a monogamous union between two people.',
    'art.mono.p6': 'If a person is in a polygamous union in their country of origin, and they claim to be in a monogamous marriage with one spouse for the purposes of Canadian immigration, they are presenting contradictory information to the government. IRCC cannot approve a sponsorship where the legal status of the marriage is unclear or where the marriage certificate may not reflect the true marital situation.',
    'art.mono.h2.2': 'What counts as a polygamous union?',
    'art.mono.p7': 'A polygamous union is a marriage in which one person is married to multiple spouses simultaneously — either legally recognized by their country of origin, or in practice with the knowledge and acceptance of all parties.',
    'art.mono.p8': 'This can take several forms:',
    'art.mono.p9': '1. A legally recognized polygamous marriage under the laws of a country that permits multiple simultaneous spouses. 2. A customary or religious marriage where multiple spouses are recognized and acknowledged. 3. A marriage where the spouse is aware of and accepts multiple concurrent marriages.',
    'art.mono.p10': 'What matters is the legal or practical reality at the time of the sponsorship application, not the past. If a person was in a polygamous union ten years ago but is now monogamously married, their current status is what matters.',
    'art.mono.h2.3': 'The problem: when a marriage certificate does not reflect reality',
    'art.mono.p11': 'In some countries, a marriage certificate may not accurately reflect the true marital situation. A person may have:',
    'art.mono.p12': '1. A marriage certificate that names only one spouse, but in practice (or under local custom), they have multiple spouses recognized. 2. Multiple marriage certificates from different jurisdictions, each one appearing valid but together indicating a polygamous situation. 3. A marriage certificate where the legal definition of marriage in that country permits polygamy, even if the individual is currently in a monogamous union.',
    'art.mono.alert.title': 'The monogamy requirement is strict and non-negotiable',
    'art.mono.p13': 'IRCC will not approve a spousal sponsorship if there is any indication that the marriage is or was part of a polygamous union. This is a hard stop — no exceptions, no appeals based on cultural differences, no lenient interpretations.',
    'art.mono.h2.4': 'What documentation do you need to prove monogamy?',
    'art.mono.p14': 'When you file a spousal sponsorship, you must provide clear evidence that:',
    'art.mono.p15': '1. Your spouse has no other legal spouse (or legal spouses) in any jurisdiction. 2. Your marriage is the only marriage your spouse is in. 3. Your spouse has declared monogamy explicitly.',
    'art.mono.p16': 'Documentation typically includes:',
    'art.mono.p17': 'Original or certified marriage certificate(s). An affidavit from your spouse declaring that they are in a monogamous relationship with you. A statutory declaration or notarized statement confirming monogamy. Divorce decrees or death certificates if your spouse was previously married. A declaration from your spouse\'s country of origin (if from a country recognizing polygamy) confirming they are not in a polygamous union.',
    'art.mono.h2.5': 'A real case: the marriage certificate error that nearly destroyed a file',
    'art.mono.p18': 'One of our clients, a Canadian citizen, was sponsoring their spouse for permanent residence. The spouse was from a country in the Middle East where polygamy is legally recognized. The marriage certificate itself looked valid — it bore all the right stamps and signatures. But it was issued in a jurisdiction where the legal definition of marriage permits multiple simultaneous spouses. IRCC flagged this as a potential polygamy issue and asked for explicit confirmation of monogamy. Without the right documentation, the file would have been refused.',
    'art.mono.h2.6': 'How to avoid problems: the checklist',
    'art.mono.p19': 'Before filing a spousal sponsorship, verify:',
    'art.mono.p20': '1. Your spouse has never been married to anyone else currently. 2. Your spouse has not been part of a polygamous union (legally or customarily). 3. All previous marriages (if any) are legally dissolved. 4. Your marriage certificate accurately reflects your spouse\'s marital status at the time of the marriage. 5. You have obtained an explicit declaration of monogamy from your spouse. 6. You have all necessary legal documents translated and certified.',
    'art.mono.info.title': 'Monogamy is non-negotiable in Canadian spousal sponsorship',
    'art.mono.p21': 'If there is any question about whether your spouse has been in a polygamous union or is currently in one, address it BEFORE filing. The cost of preventing a refusal is far less than the cost of appealing a refusal or starting over. Work with a lawyer or immigration consultant who understands the law in your spouse\'s country of origin and can help you gather the right documentation.',

    // Article: parrainage COMPLETE BODY TRANSLATION (60 items)
    'art.parr.intro.p1': 'Spousal sponsorship in Canada carries a hidden requirement that many families do not know about until it is too late: the sponsored spouse must intend to reside with the sponsor. If the couple plans to live in different provinces or different countries, the sponsorship can be refused. Here is what you need to know, and how to protect your file.',
    'art.parr.p1': 'Sarah is a Canadian citizen living in Quebec. She wants to sponsor her husband for permanent residence. He lives in Ontario with his children from a previous relationship. The plan is: he will stay in Ontario initially to maintain custody, she will remain in Quebec for her work, and they will reunite once the immigration process is complete.',
    'art.parr.p2': 'This plan sounds reasonable. It sounds like a temporary arrangement made necessary by real family circumstances. But to IRCC, it looks like a sponsorship where the couple does not intend to live together — and that is a ground for refusal.',
    'art.parr.p3': 'This article explains what the "intention to reside" requirement means, why it matters, what mistakes families make, and how to navigate this requirement without putting your file at risk.',
    'art.parr.h2.1': 'What does "intention to reside together" mean in Canadian law?',
    'art.parr.p4': 'Canadian law requires that spouses who apply for family sponsorship have a genuine intention to reside together. This is not a suggestion — it is a mandatory legal requirement, and it is assessed at the time of application.',
    'art.parr.p5': 'What does "reside together" mean in practice?',
    'art.parr.p6': 'Residing together means that the spouses intend to share a common home — either immediately after the sponsored spouse receives permanent residence, or within a reasonable timeframe. The law understands that there may be short-term delays due to logistics, employment, or other practical reasons. But there must be a genuine plan and intention to live under the same roof.',
    'art.parr.h2.2': 'The critical distinction: intention versus logistics',
    'art.parr.p7': 'IRCC distinguishes between two scenarios:',
    'art.parr.p8': 'Scenario A: "We intend to live together, but we need 6 months for logistics" — ACCEPTABLE. Scenario B: "We intend to maintain separate residences in different provinces/countries" — REFUSAL.',
    'art.parr.p9': 'The question is not whether you will live together immediately. The question is whether you genuinely intend to live together in the future.',
    'art.parr.h2.3': 'The problem: provincial residence requirements and ambiguous family situations',
    'art.parr.p10': 'The intention to reside requirement becomes complicated when:',
    'art.parr.p11': '1. One spouse lives in Quebec and the other in Ontario, with family or employment ties in both provinces. 2. The sponsored spouse has children from a previous relationship in another province. 3. The sponsoring spouse has a job in one location and family in another. 4. The couple plans to live in different locations temporarily while one or both find work.',
    'art.parr.h3.1': 'The Quebec factor: integration requirements',
    'art.parr.p12': 'Quebec adds an additional layer of complexity. Under Quebec law, a person sponsoring a spouse must intend to facilitate the sponsored person\'s integration into Quebec society. This does not necessarily mean the sponsored spouse must live in Quebec, but IRCC interprets it closely with the federal "intention to reside" requirement.',
    'art.parr.p13': 'If a Canadian citizen living in Quebec sponsors a spouse who plans to live in Ontario, both IRCC and Quebec authorities may question whether the sponsoring spouse is genuinely facilitating the sponsored spouse\'s integration into Quebec — or whether they are simply sponsoring someone who will be absent from the province.',
    'art.parr.h3.2': 'The Ottawa-Gatineau factor: interprovincial couples',
    'art.parr.p14': 'The Ottawa-Gatineau region presents a unique situation. Many couples live and work on opposite sides of the provincial border, sharing a common residence but technically living in two provinces. IRCC understands this reality and generally accepts it as evidence of genuine intention to reside together, provided the couple maintains a shared home (even if that home is located on one side of the border or the other).',
    'art.parr.p15': 'However, if the couple plans to maintain completely separate residences in Ottawa and Gatineau with no shared home, IRCC may view this skeptically.',
    'art.parr.h2.4': 'How IRCC assesses intention to reside: what they look for',
    'art.parr.p16': 'IRCC officers examine several factors to determine whether a couple genuinely intends to reside together:',
    'art.parr.h3.3': 'Documentation of shared plans',
    'art.parr.p17': '1. A written statement (sworn affidavit or statutory declaration) from both spouses explaining their intention to reside together. 2. A timeline for when they expect to share a home. 3. Evidence of a shared residence: a lease, mortgage, or property agreement in both names (or at least showing the sponsor\'s current residence). 4. Photos of the shared space, if one already exists.',
    'art.parr.h3.4': 'Financial and employment ties',
    'art.parr.p18': '1. Employment contracts or job offers in the location where they plan to reside together. 2. Bank accounts in joint names. 3. Insurance policies listing both spouses. 4. Communications (emails, texts, letters) discussing plans to relocate together.',
    'art.parr.h3.5': 'Family and social integration',
    'art.parr.p19': '1. Evidence that both spouses have begun establishing connections (schools for children, community organizations, religious institutions, etc.) in the location where they plan to live together. 2. Proof of registration of children in schools in the intended residence location. 3. Utility bills or other documents showing the shared residence address.',
    'art.parr.alert.title': 'Ambiguous statements about residence can sink a file',
    'art.parr.p20': 'If the documentation submitted to IRCC is unclear, contradictory, or suggests the spouses will not live together, the officer may refuse the sponsorship on the grounds that there is no genuine intention to reside together. This refusal is difficult to appeal because IRCC bases it on the couple\'s own statements.',
    'art.parr.h2.5': 'Common mistakes that trigger refusals',
    'art.parr.p21': 'In our practice, we regularly see families make the following errors:',
    'art.parr.h3.6': 'Mistake 1: Admitting there will be a "temporary separation"',
    'art.parr.p22': 'Family says: "He will stay in Ontario for one year to care for his children, then move to Quebec." IRCC reads: "They do not intend to live together now, and there is uncertainty about the future." The key word is "intend" — it is present-tense. Saying "we will live together eventually" is not the same as saying "we intend to live together."',
    'art.parr.h3.7': 'Mistake 2: Assuming the officer will understand your situation',
    'art.parr.p23': 'Many families tell their story verbally in an interview or expect the officer to infer intention from the application context. This is risky. Put everything in writing — an affidavit, a cover letter, a detailed statement of intention. Do not assume the officer will sympathize with your situation or fill in the blanks.',
    'art.parr.h3.8': 'Mistake 3: Listing different addresses for the sponsor and sponsored spouse',
    'art.parr.p24': 'When both spouses are already in Canada, they should list the same residential address on the application. If they are currently in different locations due to work, explain why and provide a clear statement that they intend to consolidate their residence. Listing different addresses without explanation looks like they are planning to stay separate.',
    'art.parr.h3.9': 'Mistake 4: Not addressing children from previous relationships',
    'art.parr.p25': 'If the sponsored spouse has children in another province, be explicit: acknowledge the children, explain the custody/access arrangement, and make clear that the couple intends to establish a joint residence while managing the existing family obligations. Silence on this point makes it look like the couple is using the children as cover for not actually planning to live together.',
    'art.parr.h3.10': 'Mistake 5: Submitting vague documentation',
    'art.parr.p26': 'Vague statements like "we plan to live together someday" or "we will figure it out after he gets permanent residence" are not evidence of intention. IRCC needs concrete plans: a specific location, a timeline, financial arrangements, and evidence that the couple is already beginning to coordinate their lives.',
    'art.parr.h2.6': 'How to protect your file: the proactive approach',
    'art.parr.p27': 'If your situation involves any complexity around residence (different provinces, children, employment ties), take these steps BEFORE filing:',
    'art.parr.p28': '1. Prepare a detailed affidavit from each spouse (sponsor and sponsored) stating the intention to reside together. Be specific: name the city, province, or region where you intend to live. Explain any temporary arrangements and when you expect them to resolve. 2. Gather documentation: a lease or mortgage in a shared name, utility bills, proof of employment in the intended residence location. If you do not yet have a shared residence, describe the location where you intend to establish one. 3. Prepare letters of support from family members in the intended residence location. 4. Include a cover letter (sometimes called a letter of explanation) addressing the residence issue directly. This is your chance to control the narrative.',
    'art.parr.h2.7': 'Special cases: when the couple cannot reside in the same province (yet)',
    'art.parr.p29': 'In some cases, a couple genuinely cannot live together immediately due to custody arrangements, employment obligations, or other legal constraints. This does not automatically mean the sponsorship will be refused. But you must:',
    'art.parr.p30': '1. Be explicit about the constraint (custody order, employment contract, etc.) and provide documentation. 2. Specify a concrete date or timeline when the constraint will be lifted. 3. Demonstrate that this is a temporary situation, not a permanent arrangement. 4. Show that both spouses are taking active steps to work toward living together (selling a property, securing a job in the intended location, etc.). 5. Provide evidence of regular communication and ongoing commitment to the relationship.',
    'art.parr.h2.8': 'The Quebec and Ontario integration angle',
    'art.parr.p31': 'If the sponsoring spouse is in Quebec, address the Quebec integration requirement. A simple statement might be: "We intend to establish our family residence in Quebec City. The sponsored spouse intends to integrate into Quebec society, learn French, and establish social and professional ties in the community." Alternatively, you can state your shared residence will be in Ontario, but be clear and deliberate about it.',
    'art.parr.p32': 'Do not leave the residence location ambiguous. IRCC and Quebec authorities need to know: where is this couple actually planning to live?',
    'art.parr.h2.9': 'What to do if you receive a refusal based on lack of intention to reside',
    'art.parr.p33': 'If IRCC refuses your sponsorship on the grounds that there is no genuine intention to reside together, you have limited options:',
    'art.parr.p34': '1. Request reconsideration with additional documentation that clearly demonstrates the couple\'s intention. 2. File an appeal with the Immigration Appeal Division (IAD), which has the authority to overturn IRCC\'s finding. 3. In rare cases, pursue a judicial review in Federal Court. However, courts are reluctant to overturn factual findings made by IRCC officers, so this path is difficult.',
    'art.parr.info.title': 'Intention to reside together is assessed at the moment of application',
    'art.parr.p35': 'The law asks: "At the time they filed, did this couple intend to live together?" If your documentation supports a "yes" answer, the sponsorship can proceed. If your documentation is unclear, contradictory, or suggests a "no" answer, the sponsorship can be refused. Make your intention crystal clear from the moment of filing. Do not assume the officer will understand your situation or will grant the benefit of the doubt. Put everything in writing and provide concrete evidence.',

    // Article: pere COMPLETE BODY TRANSLATION (55 items)
    'art.pere.intro.p1': 'A Canadian citizen has a child with a non-Canadian woman. The child is born outside Canada. The man wants to sponsor his child for permanent residence or help the child acquire Canadian citizenship by descent. But the legal bond between father and child is not automatically established. Without proof of paternity, IRCC will not recognize the child as the Canadian citizen\'s biological child — and sponsorship or citizenship-by-descent applications will fail.',
    'art.pere.p1': 'Marc is a Canadian citizen. At age 25, he spent a year in the Dominican Republic, where he met and lived with a woman. When he returned to Canada, he did not know she was pregnant. Ten years later, the woman contacts him. The child is now 10 years old. Marc wants to help bring his child to Canada. He assumes that since he is the biological father, the process will be straightforward. It is not.',
    'art.pere.p2': 'To IRCC and to Canadian law, Marc is not automatically the father of this child. There is no birth certificate with his name. There is no adoption order. There is no marriage to the child\'s mother. Without legal proof of the paternal bond, Marc cannot sponsor his child, and the child cannot acquire Canadian citizenship by descent from him.',
    'art.pere.p3': 'This article explains how paternity is established in Canadian immigration law, why DNA tests are sometimes necessary, what the timeline looks like, and what steps need to be taken to bring a child to Canada when the paternal bond is not legally documented.',
    'art.pere.h2.1': 'How is paternity established in Canadian immigration law?',
    'art.pere.p4': 'In Canadian family law and immigration law, paternity (the legal relationship between father and child) must be established through one of several mechanisms:',
    'art.pere.h3.1': 'Method 1: Birth certificate with father\'s name',
    'art.pere.p5': 'If the child\'s birth certificate lists the man as the father, and the birth certificate is issued by a reliable authority in a country whose vital statistics system Canada recognizes, this is strong evidence of paternity. The child\'s jurisdiction of origin (whether it is the Dominican Republic, Haiti, Jamaica, or another country) matters — Canada assesses the credibility of that country\'s vital statistics system.',
    'art.pere.h3.2': 'Method 2: Recognition of paternity by the putative father',
    'art.pere.p6': 'In many countries, a man can formally "recognize" a child as his own, even if he did not marry the mother. This recognition is a legal act, often notarized or registered with a court or government agency. If the man has signed a recognition of paternity document in his country of origin (or in Canada), this establishes the paternal bond.',
    'art.pere.h3.3': 'Method 3: Court judgment establishing paternity',
    'art.pere.p7': 'A court in any jurisdiction (the child\'s country of origin or Canada) can issue a judgment establishing paternity. This is usually done through a paternity suit filed by the mother, the child, or the putative father. Once a judgment is issued, the paternal bond is legally established.',
    'art.pere.h3.4': 'Method 4: DNA testing',
    'art.pere.p8': 'If paternity cannot be established through the above methods, IRCC may require or accept DNA testing. A DNA test that confirms the biological relationship between the man and the child can serve as proof of paternity for immigration purposes.',
    'art.pere.h2.2': 'The problem: paternity not documented at birth',
    'art.pere.p9': 'In many cases, paternity was never legally established at the time of the child\'s birth. The reasons vary:',
    'art.pere.p10': '1. The father was not present at the birth or in the mother\'s country. 2. The parents were not married. 3. The father did not formally recognize the child. 4. The birth certificate does not list the father, or lists a different father. 5. The country of origin has weak vital statistics systems, and birth certificates can be amended or falsified. 6. Cultural or religious practices may have governed the situation at the time, but they do not create a legal paternal bond in Canadian law.',
    'art.pere.p11': 'In these situations, the man (now wanting to sponsor the child) has no legal proof of paternity. IRCC will not simply accept his word. The child cannot acquire Canadian citizenship by descent based on biological connection alone — Canadian law requires legal establishment of the paternal bond.',
    'art.pere.h2.3': 'DNA testing: when is it required?',
    'art.pere.p12': 'IRCC requires DNA testing when:',
    'art.pere.p13': '1. The birth certificate does not list the putative father as the child\'s father. 2. No court judgment establishing paternity exists. 3. No recognition of paternity by the putative father exists. 4. IRCC has concerns about the authenticity of the vital statistics documents provided.',
    'art.pere.alert.title': 'DNA testing can take months and can delay the entire sponsorship process',
    'art.pere.p14': 'DNA testing in Canada is available through Immigration, Refugees and Citizenship Canada (IRCC) or through private labs authorized by IRCC. The test itself takes 2-4 weeks, but arranging the test, getting the results, and having them reviewed by IRCC can add significant delays to the overall timeline.',
    'art.pere.h2.4': 'Steps to establish paternity and sponsor a child',
    'art.pere.p15': 'The process depends on the current legal status of the paternal bond. Here are the general pathways:',
    'art.pere.h3.5': 'If a birth certificate with the father\'s name already exists',
    'art.pere.p16': '1. Obtain a certified copy of the birth certificate from the child\'s country of origin. 2. Have it officially translated into English or French by a certified translator. 3. Submit it to IRCC as part of the sponsorship application. 4. If IRCC accepts the birth certificate, no DNA test is required.',
    'art.pere.h3.6': 'If paternity was recognized but not on the birth certificate',
    'art.pere.p17': '1. Obtain certified copies of the recognition of paternity documents from the country of origin. 2. Have them officially translated. 3. Submit them to IRCC. 4. IRCC will review whether the recognition is valid under the laws of that jurisdiction. 5. If accepted, no DNA test is required.',
    'art.pere.h3.7': 'If paternity is not legally established at all',
    'art.pere.p18': '1. Option A: Go back to the child\'s country of origin and file a paternity suit. This can be lengthy (1-3 years), but it results in a court judgment that IRCC will recognize. 2. Option B: In Canada, the putative father can file a paternity suit. However, a Canadian court judgment establishing paternity of a foreign child may not be recognized in the child\'s country of origin (for purposes of updating the child\'s birth certificate). 3. Option C: Proceed with IRCC sponsorship and accept that a DNA test will be required.',
    'art.pere.h2.5': 'The DNA testing process: what to expect',
    'art.pere.p19': 'If IRCC requires DNA testing:',
    'art.pere.p20': '1. IRCC will specify which lab(s) are authorized and provide instructions. 2. Both the putative father and the child must be tested. (The mother may also be tested to rule out other biological relationships, but this is not always required.) 3. The tests are typically conducted in Canada, but in some cases, they can be done in the child\'s country of origin at an IRCC-authorized lab. 4. The cost is borne by the applicant (typically $300-$800 per person). 5. Results are sent directly to IRCC, not to the family.',
    'art.pere.p21': 'Once IRCC receives the DNA results:',
    'art.pere.p22': '1. If the test confirms paternity (with a probability of 99%+ biological relationship), IRCC will accept it as proof of the paternal bond. 2. The sponsorship application or citizenship-by-descent application can then proceed. 3. The timeline from DNA test completion to IRCC acceptance is typically 4-8 weeks.',
    'art.pere.h2.6': 'Citizenship by descent vs. sponsorship: which is the right path?',
    'art.pere.p23': 'If the child is the biological child of a Canadian citizen father, there are two possible pathways to permanent residence or citizenship:',
    'art.pere.h3.8': 'Citizenship by descent',
    'art.pere.p24': 'If the Canadian father can prove paternity and the child is under 18 (or under 22 and meets other conditions), the child may be eligible to acquire Canadian citizenship immediately, without going through sponsorship. This is the fastest and most direct path — no wait time, no sponsorship conditions. However, this route requires that paternity be very clearly established.',
    'art.pere.h3.9': 'Family sponsorship',
    'art.pere.p25': 'If the child is over 18 or does not qualify for citizenship by descent, the father can sponsor the child as a "dependent child" under the family sponsorship program. This is slower (typically 1-2 years), but it is available for dependent children of all ages.',
    'art.pere.h2.7': 'Common mistakes and how to avoid them',
    'art.pere.p26': 'In our practice, we see families make several critical errors in these cases:',
    'art.pere.h3.10': 'Mistake 1: Assuming biological connection is enough',
    'art.pere.p27': 'Families sometimes believe that IRCC will accept a simple statement from the father, or a letter from the mother, or a family photo as proof of paternity. They do not. IRCC requires legal documentation. Do not proceed without it.',
    'art.pere.p28': 'Mistake 2: Delaying the paternity establishment process',
    'art.pere.p29': 'Paternity suits, recognition processes, and DNA tests take time. Families who wait until the child is 15 or 16 to start the process face rushed timelines if the child needs to be in Canada quickly. The earlier paternity is established, the earlier the sponsorship or citizenship-by-descent process can begin.',
    'art.pere.p30': 'Mistake 3: Submitting unverified vital statistics',
    'art.pere.p31': 'Some families submit birth certificates or vital statistics from countries with weak documentation systems without explanation or without supporting evidence. IRCC may question the authenticity of the documents. Be proactive: if your vital statistics come from a country with known documentation issues, explain why you believe the documents are authentic and provide corroborating evidence.',
    'art.pere.p32': 'Mistake 4: Not obtaining certified translations',
    'art.pere.p33': 'Any paternity document in a language other than English or French must be officially translated by a certified translator. Using Google Translate or an unofficial translation will result in rejection. Invest in a proper translation — it is inexpensive and essential.',
    'art.pere.info.title': 'Paternity must be legally established before IRCC can act',
    'art.pere.p34': 'If you are a Canadian citizen with a biological child abroad whose paternity is not legally documented, begin the establishment process now. Whether you choose a paternity suit in the child\'s country, a Canadian paternity suit, or DNA testing through IRCC, the earlier you start, the earlier your child can come to Canada. Do not assume that biology alone will be sufficient — in immigration law, it is not.',

    // Article: registre COMPLETE BODY TRANSLATION (35 items)
    'art.reg.intro.p1': 'A permanent resident leaves Canada for an extended period without notifying anyone. They are abroad for 4 years. When they return and apply for citizenship, IRCC denies the application because they do not have enough documented days in Canada. The PR had 1,000+ days in Canada, but IRCC cannot verify them because there is no travel history on file. This situation is entirely preventable — but only if the permanent resident maintains a travel record.',
    'art.reg.p1': 'Many people do not realize that Canada tracks when permanent residents enter and leave the country. When a PR travels, their passport is scanned (manually or electronically) at the border. IRCC maintains these records. But the system is not foolproof, and it is the responsibility of the PR to ensure their travel history is accurate.',
    'art.reg.p2': 'This article explains what a travel registry is, why it matters, how IRCC uses it, and what permanent residents need to do to protect themselves.',
    'art.reg.h2.1': 'What is a travel registry and why does it matter?',
    'art.reg.p3': 'A travel registry (sometimes called a travel history) is a record of all border crossings — when a person entered or left Canada. IRCC maintains this record for permanent residents and uses it to:',
    'art.reg.p4': '1. Verify the number of days spent in Canada (required for citizenship applications). 2. Assess whether a PR has abandoned their permanent resident status (by being outside Canada for too long). 3. Confirm the PR\'s presence in Canada for purposes of sponsoring family members. 4. Check whether the PR has complied with residency obligations.',
    'art.reg.p5': 'A complete and accurate travel registry is essential for permanent residents. Without it, a PR may have difficulty proving they meet the physical presence requirements for citizenship.',
    'art.reg.h2.2': 'How does IRCC track travel?',
    'art.reg.p6': 'IRCC receives border crossing information from Canada Border Services Agency (CBSA). When a PR crosses a Canadian border (by air, land, or sea), CBSA scans their passport. This information is transmitted to IRCC and added to the PR\'s file.',
    'art.reg.p7': 'However, the system has limitations:',
    'art.reg.p8': '1. Manual scanning errors: Some border officers may misread a passport number or incorrectly record the date. 2. Technical failures: Scanning systems occasionally malfunction or lose data. 3. Gaps in coverage: Not all border crossings are scanned in real time (especially at land borders). 4. Lost or damaged passports: If a PR loses their passport or switches to a new passport, the travel history may be split across multiple passport numbers.',
    'art.reg.h3.1': 'The danger of relying solely on IRCC\'s records',
    'art.reg.p9': 'A PR should not assume that IRCC has an accurate, complete record of all their border crossings. If IRCC\'s records are incomplete or inaccurate, it can affect:',
    'art.reg.p10': '1. Citizenship applications (if the PR cannot prove enough days in Canada). 2. Sponsorship applications (if IRCC questions whether the PR is actually resident in Canada). 3. Residency obligation assessments (if IRCC believes the PR has spent too much time outside Canada).',
    'art.reg.h2.3': 'Physical presence requirement for citizenship',
    'art.reg.p11': 'To apply for Canadian citizenship, a permanent resident must have been physically present in Canada for at least 1,095 days (3 years) in the 5-year period before applying. This is verified using the travel registry.',
    'art.reg.p12': 'The rule is simple in theory: the more time outside Canada, the fewer days count toward the requirement. But in practice, problems arise:',
    'art.reg.p13': '1. IRCC cannot find a record of a border crossing that actually happened. 2. IRCC finds a record of a border crossing that did not happen (due to scanning error). 3. A PR left Canada but did not officially return (e.g., they were away for years and only recently came back). 4. A PR\'s passports are not properly linked in IRCC\'s system, splitting their travel history.',
    'art.reg.alert.title': 'If IRCC\'s records show you spent too much time outside Canada, proving otherwise is very difficult',
    'art.reg.p14': 'Once IRCC issues a notice saying your travel history shows insufficient physical presence, you have limited options to challenge it. You can provide evidence (stamps in old passports, airline records, rental agreements, utility bills), but IRCC will weight their official border records more heavily.',
    'art.reg.h2.4': 'Residency obligation for permanent residents',
    'art.reg.p15': 'A permanent resident is subject to a residency obligation: they must be physically present in Canada for at least 2 years out of every 5-year period. IRCC monitors this using the travel registry.',
    'art.reg.p16': 'If IRCC determines that a PR has been outside Canada for more than 3 years without being present, they may:',
    'art.reg.p17': '1. Issue a notice that the PR has lost their PR status (called a "loss of permanent resident status" notice). 2. Require the PR to attend an examination to explain their absences. 3. Proceed with removal proceedings.',
    'art.reg.h2.5': 'How to maintain an accurate travel registry',
    'art.reg.p18': 'Permanent residents can take several steps to ensure their travel registry is accurate and complete:',
    'art.reg.h3.2': 'Keep your passport valid and secure',
    'art.reg.p19': '1. Always renew your passport before it expires. Do not travel on an expired passport. 2. If your passport is lost or stolen, report it immediately and apply for a replacement. 3. Do not damage your passport — keep it in good condition so border officers can scan it properly. 4. Keep all old passports in a safe place. IRCC may need to review them to reconstruct your travel history.',
    'art.reg.p20': '1. Keep records of all trips: dates of departure and return, flight numbers or travel documentation. 2. Keep copies of airline tickets and boarding passes. 3. Keep copies of hotel receipts, rental agreements, or other documents showing where you were and when. 4. Keep utility bills or correspondence showing your Canadian address during times you were in Canada. 5. If you made trips that were not scanned at the border (e.g., you crossed by land and the crossing was not monitored), gather whatever proof you can (photos, credit card statements, witness statements from family members).',
    'art.reg.p21': 'Before applying for citizenship or sponsoring a family member, request a copy of your travel registry from IRCC. Compare it with your own records. If there are discrepancies:',
    'art.reg.p22': '1. Contact IRCC immediately and explain the discrepancies. 2. Provide evidence (old passports, stamps, airline records) showing the correct information. 3. Ask IRCC to correct the record before you file your citizenship or sponsorship application.',
    'art.reg.h2.6': 'What to do if IRCC\'s records are inaccurate',
    'art.reg.p23': 'If you discover that IRCC\'s records do not match your actual travel history, do not wait to file a citizenship application. Act now:',
    'art.reg.p24': '1. Request a copy of your travel registry by submitting an Access to Information request (ATIP). This usually takes 30 days. 2. Review the record carefully and compare it to your own documentation. 3. If there are errors, prepare a detailed letter to IRCC (to the Local Immigration Office that services your area) explaining the discrepancies and providing evidence. 4. Include all supporting documents: old passports (photocopied), airline records, utility bills, rental agreements, anything that helps establish your actual location on specific dates. 5. Ask IRCC to correct the travel registry before you apply for citizenship.',
    'art.reg.h2.7': 'Lost or stolen passports and travel history',
    'art.reg.p25': 'If you lost or replaced your passport during your time as a PR, this complicates your travel registry. IRCC may not automatically link the old and new passport numbers, causing gaps in your travel history. To address this:',
    'art.reg.p26': '1. When applying for citizenship, explain that you lost/replaced your passport and provide copies of both the old and new passports. 2. Provide additional evidence (airline records from that period, utility bills showing you were in Canada) to fill any gaps. 3. IRCC can manually review and link the passport numbers, but you must request this.',
    'art.reg.info.title': 'Maintain your travel registry proactively — do not wait until you need it',
    'art.reg.p27': 'If you are a permanent resident, start keeping your own travel records now. Do not assume IRCC has perfect records. When you apply for citizenship or sponsor a family member, a complete and accurate travel history will be essential. The time to address discrepancies is before filing, not after.',

    // Blog page translations (107 items)
    'blog.page.title': 'Blog — MDPL Immigration | Immigration Canada advice and news',
    'blog.bc.current': 'Blog',
    'blog.hero.eyebrow': 'Information resource on immigration',
    'blog.hero.title': 'The <em>MDPL Immigration</em> blog',
    'blog.hero.subtitle': 'File by file.',
    'blog.hero.desc': 'Understanding immigration to Canada through real cases, practical analyses and accessible explanations. This blog is designed to inform, raise awareness and guide — not to replace personalized professional advice.',
    'blog.about.eyebrow': 'Our approach',
    'blog.about.title': 'Why this blog <em>exists</em>',
    'blog.about.p1': 'The MDPL Immigration blog was created to offer a clear, professional and accessible information space on Canadian immigration procedures.',
    'blog.about.p2': 'Articles published are inspired by concrete situations encountered in practice. The goal is to explain how certain immigration rules apply in reality, without claiming that each situation will yield the same result.',
    'blog.about.p3': 'Every file is unique. The examples presented serve to inform, raise awareness and help readers better understand potential issues.',
    'blog.about.caption': 'MDPL Immigration office, Laval, Quebec',
    'blog.pillar1.title': 'Inform',
    'blog.pillar1.desc': 'Clear explanations of the most common immigration procedures.',
    'blog.pillar2.title': 'Simplify',
    'blog.pillar2.desc': 'Complex situations made accessible through real cases.',
    'blog.pillar3.title': 'Prevent errors',
    'blog.pillar3.desc': 'Identify and avoid frequent pitfalls in immigration files.',
    'blog.pillar4.title': 'Guide',
    'blog.pillar4.desc': 'Direct readers to the right topics according to their situation.',
    'blog.cats.eyebrow': 'Browse by theme',
    'blog.cats.title': 'Blog categories',
    'blog.cats.lead': 'Select a category to view corresponding articles.',
    'blog.cats.link': 'View articles',
    'blog.cat1.num': 'Category 01',
    'blog.cat1.title': 'Permanent residence applications',
    'blog.cat1.desc': 'Process, criteria, timelines and common mistakes in PR files for Canada.',
    'blog.cat2.num': 'Category 02',
    'blog.cat2.title': 'Dual citizenship',
    'blog.cat2.desc': 'Issues, rights and legal considerations for citizens with dual citizenship.',
    'blog.cat3.num': 'Category 03',
    'blog.cat3.title': 'Asylum applications',
    'blog.cat3.desc': 'Refugee protection, procedure before the Refugee Protection Division.',
    'blog.cat4.num': 'Category 04',
    'blog.cat4.title': 'Detention',
    'blog.cat4.desc': 'Immigration detention, detention reviews and rights of detainees.',
    'blog.cat5.num': 'Category 05',
    'blog.cat5.title': 'Errors',
    'blog.cat5.desc': 'Common errors in immigration files and their possible consequences.',
    'blog.cat6.num': 'Category 06',
    'blog.cat6.title': 'Humanitarian application',
    'blog.cat6.desc': 'Humanitarian and compassionate considerations in immigration files.',
    'blog.search.label': 'Search',
    'blog.search.placeholder': 'E.g.: CSQ, work permit, passport...',
    'blog.search.btn': 'Search',
    'blog.search.tag1': 'CSQ',
    'blog.search.tag2': 'status',
    'blog.search.tag3': 'work permit',
    'blog.search.tag4': 'sponsorship',
    'blog.search.tag5': 'detention',
    'blog.search.tag6': 'IRCC',
    'blog.search.tag7': 'citizenship',
    'blog.search.tag8': 'humanitarian',
    'blog.arts.eyebrow': 'Recent publications',
    'blog.arts.title': 'Blog <em>articles</em>',
    'blog.arts.lead': 'Each article presents a practical situation. Click to read the full article.',
    'blog.arts.link': 'Read article',
    'blog.arts.cta': 'View all articles',
    'blog.art1.tag': 'Dual citizenship',
    'blog.art1.title': 'Boarding refusal: when Canadian citizenship blocks travel',
    'blog.art1.excerpt': 'A child born abroad, an eTA invalidated after citizenship recognition, a brutal refusal at the airport. What every Canadian citizen parent must know before traveling.',
    'blog.art1.kw1': 'Canadian passport',
    'blog.art1.kw2': 'boarding refusal',
    'blog.art1.kw3': 'invalid eTA',
    'blog.art1.kw4': 'citizenship certificate',
    'blog.art2.tag': 'Permanent residence',
    'blog.art2.title': 'Travel registry and permanent residence: an essential tool for your citizenship application',
    'blog.art2.excerpt': '1,095 days to prove to IRCC with exact dates. Your memory will not be enough — download our free logbook and start today.',
    'blog.art2.kw1': 'travel registry PR',
    'blog.art2.kw2': '1,095 days citizenship',
    'blog.art3.tag': 'Quebec immigration',
    'blog.art3.title': 'What is the CSQ? The Quebec Selection Certificate explained',
    'blog.art3.excerpt': 'MIFI, IRCC, sponsorship, loss of document: everything you need to know about the CSQ and why you must keep it for life.',
    'blog.art3.kw1': 'CSQ',
    'blog.art3.kw2': 'MIFI',
    'blog.art3.kw3': 'Quebec immigration',
    'blog.art4.tag': 'Permanent residence',
    'blog.art4.title': 'He lives in Ontario, works in Quebec: a sponsorship file that nearly turned into a nightmare',
    'blog.art4.excerpt': 'Ottawa–Gatineau, intention to reside, CSQ mistakenly required. How a misinterpretation by the officer nearly compromised a permanent residence application.',
    'blog.art4.kw1': 'spousal sponsorship',
    'blog.art4.kw2': 'Ottawa Gatineau',
    'blog.art4.kw3': 'section 40 IRPA',
    'blog.art5.tag': 'Permanent residence',
    'blog.art5.title': 'He is the father, the child is Canadian: but proof of the bond remains essential',
    'blog.art5.excerpt': 'Birth certificate without the father\'s name, mandatory DNA test, delays of a year or more. What families need to know about Canadian citizenship by descent.',
    'blog.art5.kw1': 'citizenship by descent',
    'blog.art5.kw2': 'IRCC DNA test',
    'blog.art6.tag': 'Child sponsorship',
    'blog.art6.title': '"It\'s been my daughter for years": adoption, guardianship and immigration to Canada from the Caribbean',
    'blog.art6.excerpt': 'Customary guardianship, informal adoption, child entrusted to family: why IRCC refuses these bonds and how to regularize the situation to immigrate to Canada.',
    'blog.art6.kw1': 'adoption guardianship Canada',
    'blog.art6.kw2': 'child sponsorship Caribbean',
    'blog.art7.tag': 'Foreign workers',
    'blog.art7.title': 'ESDC inspections on LMIAs: what every employer must know before receiving this letter',
    'blog.art7.excerpt': 'An ESDC letter arrives without warning. What you declared in your LMIA, your salary practices and employment conditions will be scrutinized. What every TFWP employer must absolutely prepare.',
    'blog.art7.kw1': 'ESDC inspection',
    'blog.art7.kw2': 'LMIA employer',
    'blog.art7.kw3': 'TFWP compliance',
    'blog.art8.tag': 'Family sponsorship',
    'blog.art8.title': 'Monogamy or polygamy: what you need to know before filing spouse sponsorship',
    'blog.art8.excerpt': 'A polygamous regime on a marriage certificate — even by mistake — can lead directly to a refusal. A real case, official correction required, and Quebec rules: what to check before filing.',
    'blog.art8.kw1': 'polygamy sponsorship',
    'blog.art8.kw2': 'marriage certificate IRCC',
    'blog.art8.kw3': 'matrimonial regime',
    'blog.art9.tag': 'Canadian immigration',
    'blog.art9.title': 'The importance of submitting documents on time in Canadian immigration',
    'blog.art9.excerpt': 'An eligible file can be refused simply because a document was not submitted on time. Deadlines, good faith, extension and exemption: what you need to know before it\'s too late.',
    'blog.art9.kw1': 'IRCC deadlines',
    'blog.art9.kw2': 'immigration documents',
    'blog.art9.kw3': 'deadline extension',
    'blog.faq.eyebrow': 'Frequently asked questions',
    'blog.faq.title': 'Frequently asked questions about <em>immigration to Canada</em>',
    'blog.faq.lead': 'This section groups the main questions related to Canadian immigration procedures. It aims to provide clear and accessible answers to help better understand the different stages of the process.',
    'blog.faq.q1': 'Can I immigrate to Canada easily?',
    'blog.faq.a1': 'Immigration to Canada cannot be considered a simple or automatic process. It depends on several factors, including your profile, education level, work experience and personal situation. Each program has specific criteria that must be met. A good understanding of these requirements is essential for evaluating your chances and directing your approach strategically.',
    'blog.faq.q2': 'How long does it take to immigrate to Canada?',
    'blog.faq.a2': 'Immigration timelines vary significantly depending on the program you choose. Permanent residence applications can take 6 months to 2 years. Work permits may take weeks to months. Student permits typically take a few weeks. It is important to understand the timeline for the program you are applying to and to plan accordingly.',
    'blog.faq.q3': 'What is the cost of immigrating to Canada?',
    'blog.faq.a3': 'Immigration costs include government application fees, medical exams, police certificates, document translation, and professional advice if you choose to hire a consultant. Costs can range from a few hundred to several thousand dollars depending on your situation and the program you are applying to.',
    'blog.faq.q4': 'Do I need a job offer to immigrate to Canada?',
    'blog.faq.a4': 'A job offer is not always required to immigrate to Canada. Some programs (like Express Entry) do not require a job offer, although having one can improve your chances. Other programs, like the Temporary Foreign Worker Program, do require an employer job offer. The importance of a job offer depends on the program you are considering.',
    'blog.faq.q5': 'Do I need to hire an immigration consultant?',
    'blog.faq.a5': 'Hiring an immigration consultant is not mandatory, but it can offer significant advantages in certain situations. A professional can help you better understand your options, structure your file and avoid common mistakes.',
    'blog.faq.q6': 'What is the purpose of this blog?',
    'blog.faq.a6': 'This blog was designed as an information space intended to make immigration procedures more accessible. Content is based on real situations and aims to explain the different stages of the process in a clear manner. It is a starting point for seriously learning about Canadian immigration.',
    'blog.cta.title': 'A question related to <em>your situation?</em>',
    'blog.cta.desc': 'Blog articles inform, but do not replace a personalized assessment. Let\'s discuss your file in consultation.',
    'blog.cta.btn1': 'Book an appointment',
    'blog.cta.btn2': 'Contact us',
    'blog.disclaimer.title': 'Important information',
    'blog.disclaimer.text': 'Information presented on this site is provided for informational purposes only and does not constitute legal advice. Every immigration situation is unique and depends on several factors. For any concrete action, a personalized consultation with an authorized immigration representative is necessary.',

    // Terms of Use page translations (16 items)
    'terms.page.title': 'Terms of Use — MDPL Immigration',
    'terms.bc.current': 'Terms of use',
    'terms.hero.eyebrow': 'Legal information',
    'terms.hero.title': 'Terms of <em>use</em>',
    'terms.hero.subtitle': 'The framework for using our site and tools.',
    'terms.updated': '<em>Last updated: January 2025</em>',
    'terms.h2.1': '1. <em>Acceptance of terms</em>',
    'terms.p1': 'By accessing the mdplimmigration.com website and using its content or tools, you acknowledge that you have read these terms and agree to comply with them. If you do not accept these terms, we ask that you do not use this site.',
    'terms.h2.2': '2. <em>Nature of information provided</em>',
    'terms.p2': 'The MDPL Immigration website is informational in nature. The content presented — articles, service sheets, interactive tools, FAQs — is written for general information purposes. It <strong>does not constitute legal advice</strong> and does <strong>not create a client-representative relationship</strong> between you and our firm.',
    'terms.h2.3': '3. <em>Use of tools</em>',
    'terms.p3': 'The calculators, quizzes, simulators and other interactive tools available on this site are provided for guidance purposes. Their results are indicative and do not account for all the subtleties of an individual immigration file. No important decision should be made solely on the basis of the results of these tools. For an analysis tailored to your situation, a personalized consultation with an authorized representative is necessary.',
    'terms.h2.4': '4. <em>Intellectual property</em>',
    'terms.p4': 'All site content — text, images, logos, code, design — is protected by intellectual property laws and belongs to MDPL Immigration, unless otherwise noted. Any reproduction, distribution or commercial use without prior written authorization is prohibited. Short quotation for information or research purposes is permitted, provided the source is mentioned.',
    'terms.h2.5': '5. <em>External links</em>',
    'terms.p5': 'The site may contain links to third-party websites — notably IRCC, MIFI, Service Canada. These links are provided for your convenience. MDPL Immigration is not responsible for the content, availability, or privacy policies of these external sites.',
    'terms.h2.6': '6. <em>Limitation of liability</em>',
    'terms.p6': 'MDPL Immigration endeavors to keep the information on the site accurate and up-to-date. However, immigration rules change frequently: fees, timelines, criteria and programs may change without notice. MDPL Immigration cannot be held responsible for decisions made by a user solely on the basis of information accessed on this site.',
    'terms.h2.7': '7. <em>Professional regulation</em>',
    'terms.p7': 'MDPL Immigration is a firm of regulated immigration consultants. Any immigration service provision is governed by the rules of the College of Immigration and Citizenship Consultants (CICC). A client-representative relationship is established only upon signing a written mandate, following an initial consultation.',
    'terms.h2.8': '8. <em>Modification of terms</em>',
    'terms.p8': 'MDPL Immigration reserves the right to modify these terms of use at any time. The date of the last update appears at the top of this page. It is your responsibility to consult this page regularly.',
    'terms.h2.9': '9. <em>Governing law</em>',
    'terms.p9': 'These terms are governed by the laws in force in Quebec and Canada. Any dispute relating to the use of the site falls under the exclusive jurisdiction of the courts of the Laval judicial district, Quebec.',
    'terms.h2.10': '10. <em>Contact</em>',
    'terms.p10': 'For any questions about these terms, contact us at info@mdplimmigration.com or 450 977-0066.',

    // Privacy Policy page translations (16 items)
    'privacy.page.title': 'Privacy Policy — MDPL Immigration',
    'privacy.bc.current': 'Privacy policy',
    'privacy.hero.eyebrow': 'Legal information',
    'privacy.hero.title': 'Privacy <em>policy</em>',
    'privacy.hero.subtitle': 'How we protect your personal information.',
    'privacy.updated': '<em>Last updated: January 2025</em>',
    'privacy.h2.1': '1. <em>Our commitment</em>',
    'privacy.p1': 'MDPL Immigration places the utmost importance on the privacy of its clients and website visitors. This document explains what information we collect, for what purposes, how it is protected and what your rights are.',
    'privacy.h2.2': '2. <em>Information collected</em>',
    'privacy.p2': 'On this site, we only collect information that you voluntarily provide to us: through the contact form, by email or phone. No personal information is collected without your knowledge when simply visiting the site. Our interactive tools (calculators, quizzes) operate entirely in your browser: no data entered is transmitted to our servers.',
    'privacy.h2.3': '3. <em>Use of information</em>',
    'privacy.p3': 'The information you provide to us is used exclusively for: responding to your information requests, scheduling a consultation appointment, processing your immigration file if you become a client, occasionally informing you of legislative changes that may affect you. We never sell, rent or share your personal information with third parties for commercial purposes.',
    'privacy.h2.4': '4. <em>Professional confidentiality</em>',
    'privacy.p4': 'As authorized immigration representatives, we are subject to a strict duty of professional confidentiality. Every client file is treated with the strictest confidentiality, in accordance with the rules of the College of Immigration and Citizenship Consultants (CICC) and the Personal Information Protection Act.',
    'privacy.h2.5': '5. <em>Storage and security</em>',
    'privacy.p5': 'Client information is stored in secure systems for the duration required by legal and professional obligations. Beyond that, it is destroyed according to applicable standards. Access to files is strictly limited to authorized members of our firm.',
    'privacy.h2.6': '6. <em>Your rights</em>',
    'privacy.p6': 'In accordance with Quebec and Canadian personal information protection legislation (including Bill 25 in Quebec), you have the right to access your information, correct it, request its withdrawal within limits provided by law. To exercise these rights, contact us at info@mdplimmigration.com.',
    'privacy.h2.7': '7. <em>Cookies and statistics</em>',
    'privacy.p7': 'Our site does not use advertising tracking cookies. Technical cookies may be used for proper functioning of the site. We do not use any third-party tracking tools for profiling purposes.',
    'privacy.h2.8': '8. <em>Modifications</em>',
    'privacy.p8': 'This policy may be updated. The date of the last revision appears at the top of this page. If you have any questions, please do not hesitate to contact us.',

    // FAQ page translations (34 items)
    'faq.page.title': 'Frequently Asked Questions — MDPL Immigration | FAQ Canadian immigration',
    'faq.bc.current': 'Frequently asked questions',
    'faq.hero.eyebrow': 'Frequently asked questions',
    'faq.hero.title': 'Your <em>questions</em>, our answers',
    'faq.hero.subtitle': 'To better understand our services and the immigration process.',
    'faq.hero.desc': 'We have gathered here the questions our clients ask us most frequently during the initial consultation. If your question is not in this list, please do not hesitate to contact us — we will be happy to answer it during a personalized conversation.',
    'faq.q1': 'How does an initial consultation with MDPL Immigration work?',
    'faq.a1': 'The initial consultation allows us to assess your personal, professional and family situation to identify possible immigration options. We take the time to listen to your project, answer your questions and present the procedures best suited to your situation. This meeting is essential to build a realistic and personalized strategy. It can take place in person at our Laval office, or remotely by video conference for our clients located abroad.',
    'faq.q2': 'What types of files do you handle?',
    'faq.a2': 'Our firm handles a wide variety of files: study permits, work permits, visitor visas, electronic travel authorizations (eTA), family sponsorships, family reunification, permanent residence applications (federal and Quebec programs) as well as procedures for temporary foreign workers (including LMIAs) for employers. We support individuals, families and employers alike. If your situation is particular or complex, we evaluate it carefully to determine the best possible path.',
    'faq.q3': 'How long does an immigration application take?',
    'faq.a3': 'Processing times vary greatly depending on the type of application, country of residence, program chosen and workload of immigration authorities. A visitor visa application may take a few weeks, while family sponsorship or permanent residence application may take several months or more than a year. IRCC regularly publishes processing timeframes on its official website. During the initial consultation, we communicate realistic timelines for your situation, taking into account the latest official updates.',
    'faq.q4': 'Is it mandatory to work with an immigration consultant?',
    'faq.a4': 'No, it is never mandatory to use an immigration consultant. Anyone can prepare and submit their own application to Canadian authorities. That said, the Canadian immigration system is complex and constantly evolving. A poorly prepared application can result in a refusal, additional delays, or even consequences on future procedures. Using an authorized representative allows you to benefit from a professional analysis of your file, a tailored strategy and careful follow-up until the decision.',
    'faq.q5': 'What happens if my previous application was refused?',
    'faq.a5': 'A refusal is not necessarily the end of the road. Many of our clients came to us after one or more refusals and ultimately obtained their visa, permit or permanent residence with a well-prepared new application. The key is to precisely understand the reasons for the refusal and address them concretely. During the consultation, we analyze the refusal letter, identify the weak points of the previous file and propose a corrective strategy. In some cases, an appeal or application for judicial review may also be considered.',
    'faq.q6': 'Do you accept clients abroad?',
    'faq.a6': 'Yes, absolutely. Our firm supports clients from over 40 countries. We offer consultations remotely by video conference and all communications can be conducted by email or telephone. The vast majority of immigration procedures can be completed without you needing to travel to Canada before obtaining your status. We manage the file preparation, online submission and follow-up with authorities remotely.',
    'faq.q7': 'What documents should I prepare for the initial consultation?',
    'faq.a7': 'To optimize your initial consultation, we recommend preparing: a copy of your passport (identification page); your diplomas, transcripts and professional credentials; your language exam results if applicable (IELTS, TEF, etc.); your travel history, visas and Canadian permits (including refusals); a description of your family situation and immigration project. If you don\'t have all these documents, that\'s okay: we can do a first assessment with what you have. We will then let you know what else needs to be completed.',
    'faq.q8': 'How much does it cost to work with your firm?',
    'faq.a8': 'Our fees vary depending on the type of file and services required. We provide transparent pricing during the initial consultation. Our costs are competitive and our service is rigorous. We also work with clients on payment plans if needed. Remember: the cost of professional help is often far less than the cost of a refused application or the delays resulting from a poorly prepared file.',
    'faq.q9': 'Can you represent me before IRCC or other immigration authorities?',
    'faq.a9': 'Yes. MDPL Immigration is a firm of immigration consultants regulated by the College of Immigration and Citizenship Consultants (CICC). We are authorized to represent clients before IRCC, Citizenship and Immigration Canada, provincial immigration programs and other Canadian immigration authorities. Our role is to prepare your file, submit your application and follow up with authorities on your behalf until a decision is made.',
    'faq.q10': 'What is the difference between a work permit, a study permit and permanent residence?',
    'faq.a10': 'A work permit allows a foreign national to work in Canada for a specific employer for a limited period (usually 1-3 years). A study permit allows a foreign student to attend a designated learning institution for the duration of their studies. Permanent residence (PR) is a status that allows a person to live, work and study in Canada indefinitely, with rights similar to those of a Canadian citizen (except voting and running for office). Each has different requirements, procedures and implications for your future in Canada.',
    'faq.q11': 'Can I change my immigration status while in Canada?',
    'faq.a11': 'Yes, in many cases it is possible to change status while in Canada. For example, you can apply for permanent residence while holding a work or study permit. However, not all transitions are possible, and some have strict requirements or time limitations. The rules are complex and depend on your current status, your country of origin and your family situation. During the consultation, we evaluate which transitions are available to you.',
    'faq.q12': 'What happens if I don\'t meet all the requirements for a program?',
    'faq.a12': 'If you do not fully meet the standard requirements for a particular program, there may still be alternatives. Some programs have provisions for applicants who fall slightly short of certain criteria, or there may be other programs better suited to your profile. Our role is to analyze your situation comprehensively and identify all possible pathways, not just the most obvious ones. Sometimes, the best solution is an approach you hadn\'t considered.',
    'faq.cta.title': 'Do you have more questions?',
    'faq.cta.desc': 'Most of the answers to your questions can be found here. Otherwise, don\'t hesitate to contact us — that\'s what we\'re here for.'
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
    { fr: ‘Navigation’,      en: ‘Navigation’ },
    { fr: ‘Coordonnées’,     en: ‘Contact’ },
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
    if (document.getElementById('lang-toggle')) return;
    if (!document.body) {
      setTimeout(injectButton, 100);
      return;
    }

    var btn = document.createElement('button');
    btn.className = 'lang-toggle-fixed';
    btn.id = 'lang-toggle';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'Switch language / Changer la langue');
    btn.innerHTML = '<span class="lang-opt" data-lang="fr">FR</span><span class="lang-sep" aria-hidden="true">/</span><span class="lang-opt" data-lang="en">EN</span>';

    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      var current = document.documentElement.lang || 'fr';
      applyLang(current === 'fr' ? 'en' : 'fr');
    });

    console.log('✓ Language toggle button injected successfully');
  }

  // ── Initialisation ────────────────────────────────────────────────────────
  cacheAllFr();

  // Ensure button injection happens after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }

  var stored = localStorage.getItem('mdpl-lang') || 'fr';
  if (stored === 'en') {
    applyLang('en');
  } else {
    document.documentElement.lang = 'fr';
  }

}());
