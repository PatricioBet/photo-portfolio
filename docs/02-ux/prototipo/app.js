/* Prototype runtime: state, hash routing, events and small simulations. */
(function () {
  const v = window.PROTO.views;
  let firstRender = true;
  let lightboxIndex = -1;
  let lightboxTrigger = null;

  function read(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      /* storage may be unavailable; the prototype still works */
    }
  }

  const state = {
    lang: read("proto-lang", "es"),
    theme: read("proto-theme", "dark"),
    content: read("proto-content", "demo"),
    photoFilter: ""
  };
  window.PROTO.state = state;

  const main = document.getElementById("main");
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const dialog = document.getElementById("lightbox");
  const menuBtn = document.getElementById("menu-btn");
  const modeBtn = document.getElementById("mode-btn");
  const langBtn = document.getElementById("lang-btn");

  function t(key) {
    return v.t(key);
  }

  function liveRegion() {
    let region = document.getElementById("live-region");
    if (!region) {
      region = document.createElement("p");
      region.id = "live-region";
      region.className = "sr-only";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    return region;
  }

  function announce(message) {
    const region = liveRegion();
    region.textContent = "";
    window.setTimeout(function () { region.textContent = message; }, 50);
  }

  function applyTheme() {
    const systemDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = state.theme === "system" ? systemDark : state.theme === "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    const label = t("proto.theme." + state.theme);
    const themeButton = document.getElementById("theme-btn");
    const themeIcon = document.getElementById("theme-btn-2");
    if (themeButton) themeButton.textContent = t("proto.theme") + ": " + label;
    if (themeIcon) themeIcon.setAttribute("aria-label", t("nav.theme") + ": " + label);
  }

  function applyChrome() {
    document.documentElement.lang = state.lang;
    const skip = document.querySelector(".skip");
    if (skip) skip.textContent = t("nav.skip");
    if (menuBtn) menuBtn.textContent = t("nav.menu");
    const nav = document.getElementById("site-nav");
    if (nav) nav.setAttribute("aria-label", t("nav.label"));
    document.getElementById("nav-photos").textContent = t("nav.photos");
    document.getElementById("nav-videos").textContent = t("nav.videos");
    document.getElementById("nav-collections").textContent = t("nav.collections");
    document.getElementById("nav-about").textContent = t("nav.about");
    document.getElementById("nav-contact").textContent = t("nav.contact");
    document.getElementById("nav-search").textContent = t("nav.search");

    const note = document.getElementById("proto-note");
    if (note) {
      note.textContent = state.content === "empty" ? t("proto.note.empty") : t("proto.note.demo");
    }
    if (modeBtn) {
      modeBtn.textContent = state.content === "empty" ? t("proto.mode.empty") : t("proto.mode.demo");
    }
    if (langBtn) {
      langBtn.textContent = t("proto.lang");
      langBtn.setAttribute("lang", state.lang === "es" ? "en" : "es");
    }
    applyTheme();
  }

  function renderFooter() {
    footer.innerHTML = v.footer();
  }

  function parseRoute() {
    const raw = (window.location.hash || "#/").replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean).map(function (part) {
      try { return decodeURIComponent(part); } catch (error) { return part; }
    });
    if (!parts.length) return { name: "home" };
    const head = parts[0];
    const tail = parts[1];

    if (head === "admin") {
      const sub = tail === "media" || tail === "publish" ? tail : "dashboard";
      return { name: "admin", sub: sub };
    }
    if (head === "fotos") return tail ? { name: "photo", slug: tail } : { name: "photos" };
    if (head === "videos") return tail ? { name: "video", slug: tail } : { name: "videos" };
    if (head === "colecciones") return tail ? { name: "collection", slug: tail } : { name: "collections" };
    if (head === "sobre-mi") return { name: "about" };
    if (head === "contacto") return { name: "contact" };
    if (head === "buscar") return { name: "search" };
    if (["privacidad", "terminos", "accesibilidad", "creditos", "rss"].indexOf(head) !== -1) {
      return { name: "pending", kind: head };
    }
    if (head === "404") return { name: "notFound" };
    return { name: "notFound" };
  }

  function setActiveNav(route) {
    const map = {
      photos: "nav-photos",
      photo: "nav-photos",
      videos: "nav-videos",
      video: "nav-videos",
      collections: "nav-collections",
      collection: "nav-collections",
      about: "nav-about",
      contact: "nav-contact",
      search: "nav-search"
    };
    document.querySelectorAll(".site-nav a").forEach(function (link) {
      link.removeAttribute("aria-current");
    });
    const id = map[route.name];
    if (id) {
      const link = document.getElementById(id);
      if (link) link.setAttribute("aria-current", "page");
    }
  }

  function render() {
    const route = parseRoute();
    let view;

    switch (route.name) {
      case "home":
        view = v.home();
        break;
      case "photos":
        view = v.photos();
        break;
      case "photo":
        view = v.photo(route.slug) || v.notFound();
        break;
      case "videos":
        view = v.videos();
        break;
      case "video":
        view = v.video(route.slug) || v.notFound();
        break;
      case "collections":
        view = v.collections();
        break;
      case "collection":
        view = v.collection(route.slug) || v.notFound();
        break;
      case "about":
        view = v.about();
        break;
      case "contact":
        view = v.contact();
        break;
      case "search":
        view = v.search();
        break;
      case "pending":
        view = v.pending(route.kind);
        break;
      case "admin":
        view = window.PROTO.admin[route.sub]();
        break;
      default:
        view = v.notFound();
    }

    document.body.dataset.route = route.name === "admin" ? "admin" : "public";
    main.innerHTML = view.html;
    document.title = view.title + " · Prototipo photo.patriciobet.dev";

    applyChrome();
    renderFooter();
    setActiveNav(route);
    closeMenu(false);

    if (route.name === "search") initSearch();
    if (route.name === "contact") initContact();
    if (route.name === "admin") initAdmin();

    if (!firstRender) {
      main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    firstRender = false;
  }

  function initSearch() {
    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");
    const form = document.getElementById("search-form");
    if (!input || !results || !form) return;

    function update() {
      results.innerHTML = v.searchResults(input.value);
    }

    input.addEventListener("input", update);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      update();
    });
    window.PROTO._searchUpdate = update;
  }

  function setFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field) field.setAttribute("aria-invalid", "true");
    if (error) error.textContent = message;
  }

  function clearFieldErrors() {
    ["name", "email", "message", "consent"].forEach(function (id) {
      const field = document.getElementById(id);
      if (field) field.removeAttribute("aria-invalid");
    });
    ["err-name", "err-email", "err-message", "err-consent"].forEach(function (id) {
      const error = document.getElementById(id);
      if (error) error.textContent = "";
    });
    const status = document.getElementById("form-status");
    if (status) status.textContent = "";
  }

  function initContact() {
    const form = document.getElementById("contact-form");
    const message = document.getElementById("message");
    const counter = document.getElementById("msg-count");
    if (!form) return;

    function updateCounter() {
      if (counter && message) {
        counter.textContent = message.value.length + " / 5000";
      }
    }

    if (message) message.addEventListener("input", updateCounter);
    updateCounter();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFieldErrors();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const body = message.value.trim();
      const consent = document.getElementById("consent").checked;
      const invalid = [];

      if (!name) {
        setFieldError("name", "err-name", t("contact.requiredName"));
        invalid.push("name");
      }
      if (!email) {
        setFieldError("email", "err-email", t("contact.requiredEmail"));
        invalid.push("email");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError("email", "err-email", t("contact.emailError"));
        invalid.push("email");
      }
      if (!body) {
        setFieldError("message", "err-message", t("contact.requiredMessage"));
        invalid.push("message");
      } else if (body.length > 5000) {
        setFieldError("message", "err-message", t("contact.longError"));
        invalid.push("message");
      }
      if (!consent) {
        setFieldError("consent", "err-consent", t("contact.consentError"));
        invalid.push("consent");
      }

      const status = document.getElementById("form-status");
      if (invalid.length) {
        if (status) status.textContent = t("contact.error");
        const first = document.getElementById(invalid[0]);
        if (first) first.focus();
        return;
      }

      const submit = document.getElementById("contact-submit");
      const success = document.getElementById("contact-success");
      if (status) status.textContent = t("contact.sending");
      if (submit) {
        submit.disabled = true;
        submit.textContent = t("contact.sending");
      }
      window.setTimeout(function () {
        if (submit) {
          submit.disabled = false;
          submit.textContent = t("contact.send");
        }
        if (success) {
          success.hidden = false;
          success.focus();
        }
        if (status) status.textContent = t("contact.successTitle");
        form.reset();
        updateCounter();
      }, 700);
    });
  }

  function initAdmin() {
    const input = document.getElementById("admin-file");
    const note = document.getElementById("upload-note");
    if (input && note) {
      input.addEventListener("change", function () {
        note.textContent = input.files.length + " " + t("admin.media.selected");
      });
    }
  }

  function closeMenu(restoreFocus) {
    if (!header) return;
    header.classList.remove("nav-open");
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      if (restoreFocus) menuBtn.focus();
    }
  }

  function lightboxPhotos() {
    return v.allWorks().filter(function (work) { return work.type === "photo"; });
  }

  function renderLightbox() {
    const photos = lightboxPhotos();
    if (!photos.length) return;
    const work = photos[lightboxIndex];
    const art = document.getElementById("lb-art");
    art.className = "art " + work.art;
    art.setAttribute("aria-label", v.pick(work.alt));
    document.getElementById("lb-title").textContent = v.pick(work.title);
    document.getElementById("lb-count").textContent =
      (lightboxIndex + 1) + " / " + photos.length;
    document.getElementById("lb-prev").textContent = t("common.prev");
    document.getElementById("lb-next").textContent = t("common.next");
    document.getElementById("lb-close").setAttribute("aria-label", t("nav.close"));
  }

  function stepLightbox(delta) {
    const photos = lightboxPhotos();
    if (!photos.length) return;
    lightboxIndex = (lightboxIndex + delta + photos.length) % photos.length;
    renderLightbox();
  }

  function openLightbox(slug, trigger) {
    const photos = lightboxPhotos();
    const index = photos.findIndex(function (work) { return work.slug === slug; });
    if (index < 0) return;
    lightboxIndex = index;
    lightboxTrigger = trigger || document.activeElement;
    renderLightbox();
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    document.getElementById("lb-close").focus();
  }

  function closeLightbox() {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function copyLink() {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        announce(t("common.copied"));
      }).catch(function () {
        window.prompt(t("common.copy"), url);
      });
    } else {
      window.prompt(t("common.copy"), url);
    }
  }

  function handleAction(actionEl, event) {
    const action = actionEl.dataset.action;

    if (action === "filter") {
      state.photoFilter = actionEl.dataset.filter || "";
      render();
      return;
    }
    if (action === "clear-filter") {
      state.photoFilter = "";
      render();
      return;
    }
    if (action === "open-lightbox") {
      openLightbox(actionEl.dataset.slug, actionEl);
      return;
    }
    if (action === "copy-link") {
      copyLink();
      return;
    }
    if (action === "print") {
      window.print();
      return;
    }
    if (action === "clear-search") {
      const input = document.getElementById("search-input");
      if (input) {
        input.value = "";
        if (window.PROTO._searchUpdate) window.PROTO._searchUpdate();
        input.focus();
      }
      return;
    }
    if (action === "toggle-video") {
      const stage = document.getElementById("video-stage");
      if (!stage) return;
      stage.classList.toggle("is-playing");
      const playing = stage.classList.contains("is-playing");
      stage.querySelectorAll('[data-action="toggle-video"]').forEach(function (button) {
        button.textContent = playing ? "⏸" : "▶";
        button.setAttribute("aria-label", playing ? t("detail.pause") : t("detail.play"));
      });
      const bar = stage.querySelector('[role="progressbar"]');
      if (bar) {
        bar.setAttribute("aria-valuenow", playing ? "38" : "0");
        bar.setAttribute("aria-label", playing ? t("detail.playing") : t("detail.play"));
      }
      return;
    }
    if (action === "publish") {
      const status = document.getElementById("publish-status");
      const button = actionEl;
      button.disabled = true;
      button.textContent = t("admin.publish.building");
      if (status) status.textContent = t("admin.publish.building");
      window.setTimeout(function () {
        if (status) status.textContent = t("admin.publish.done");
        button.disabled = false;
        button.textContent = t("admin.publish.button");
      }, 1400);
    }
  }

  document.addEventListener("click", function (event) {
    const actionEl = event.target.closest("[data-action]");
    if (actionEl) {
      event.preventDefault();
      handleAction(actionEl, event);
      return;
    }
    const navLink = event.target.closest(".site-nav a");
    if (navLink) closeMenu(false);
  });

  langBtn.addEventListener("click", function () {
    state.lang = state.lang === "es" ? "en" : "es";
    write("proto-lang", state.lang);
    applyChrome();
    render();
  });

  modeBtn.addEventListener("click", function () {
    state.content = state.content === "demo" ? "empty" : "demo";
    write("proto-content", state.content);
    state.photoFilter = "";
    applyChrome();
    render();
    announce(state.content === "empty" ? t("proto.note.empty") : t("proto.note.demo"));
  });

  function cycleTheme() {
    const order = ["dark", "light", "system"];
    const next = order[(order.indexOf(state.theme) + 1) % order.length];
    state.theme = next;
    write("proto-theme", next);
    applyTheme();
    announce(t("proto.theme") + ": " + t("proto.theme." + next));
  }

  document.getElementById("theme-btn").addEventListener("click", cycleTheme);
  document.getElementById("theme-btn-2").addEventListener("click", cycleTheme);

  menuBtn.addEventListener("click", function () {
    const open = header.classList.toggle("nav-open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      const firstLink = header.querySelector(".site-nav a");
      if (firstLink) firstLink.focus();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && header.classList.contains("nav-open")) {
      closeMenu(true);
    }
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) closeLightbox();
  });
  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", function () { stepLightbox(-1); });
  document.getElementById("lb-next").addEventListener("click", function () { stepLightbox(1); });
  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepLightbox(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepLightbox(-1);
    }
  });
  dialog.addEventListener("close", function () {
    if (lightboxTrigger && typeof lightboxTrigger.focus === "function") {
      lightboxTrigger.focus();
    }
  });

  if (window.matchMedia) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = function () {
      if (state.theme === "system") applyTheme();
    };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
  }

  window.addEventListener("hashchange", render);

  applyChrome();
  render();
})();
