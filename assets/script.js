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
