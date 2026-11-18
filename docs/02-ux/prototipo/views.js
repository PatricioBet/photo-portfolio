/* Public views for the prototype. Pure string templates, no framework. */
(function () {
  const { i18n, collections } = window.PROTO;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function t(key) {
    const lang = (window.PROTO.state && window.PROTO.state.lang) || "es";
    const dict = i18n[lang] || i18n.es;
    if (dict[key] != null) return dict[key];
    if (i18n.es[key] != null) return i18n.es[key];
    return key;
  }

  function pick(value) {
    const lang = (window.PROTO.state && window.PROTO.state.lang) || "es";
    return value[lang] || value.es || "";
  }

  function allWorks() {
    return window.PROTO.state.content === "empty" ? [] : window.PROTO.works;
  }

  function photos() {
    return allWorks().filter(function (w) { return w.type === "photo"; });
  }

  function videos() {
    return allWorks().filter(function (w) { return w.type === "video"; });
  }

  function activeCollections() {
    return window.PROTO.state.content === "empty" ? [] : collections;
  }

  function collectionBySlug(slug) {
    return collections.find(function (c) { return c.slug === slug; });
  }

  function collectionWorks(slug) {
    return allWorks().filter(function (w) { return w.collection === slug; });
  }

  function workRoute(work) {
    return work.type === "video" ? "#/videos/" + work.slug : "#/fotos/" + work.slug;
  }

  function typeLabel(work) {
    return work.type === "video" ? t("common.video") : t("common.photo");
  }

  function art(work, extraClass) {
    return '<div class="art ' + work.art + (extraClass ? " " + extraClass : "") +
      '" role="img" aria-label="' + esc(pick(work.alt)) + '"></div>';
  }

  function demoBadge() {
    return '<span class="demo-badge">' + t("common.demo") + "</span>";
  }

  function emptyState(title, body, actions) {
    return '<div class="empty">' +
      "<h2>" + title + "</h2>" +
      "<p>" + body + "</p>" +
      (actions ? '<div class="actions">' + actions + "</div>" : "") +
      "</div>";
  }

  function pageHead(title, intro) {
    return '<section class="page-head">' +
      "<h1>" + title + "</h1>" +
      (intro ? "<p>" + intro + "</p>" : "") +
      "</section>";
  }

  function workCard(work) {
    const extra = work.type === "video"
      ? '<span class="play-badge" aria-hidden="true">▶</span>' +
        '<span class="duration-badge">' + esc(work.duration) + "</span>"
      : "";
    return '<a class="card" href="' + workRoute(work) + '">' +
      '<div class="card-art">' + art(work) + demoBadge() + extra + "</div>" +
      "<h3>" + esc(pick(work.title)) + "</h3>" +
      '<p class="meta">' + typeLabel(work) + " · " + esc(work.date.slice(0, 4)) + "</p>" +
      "</a>";
  }

  function collectionCard(collection) {
    const count = collectionWorks(collection.slug).length;
    const label = count === 1 ? t("common.piece") : t("common.pieces");
    return '<a class="card collection-card" href="#/colecciones/' + collection.slug + '">' +
      '<div class="card-art"><div class="art ' + collection.art + '" role="img" aria-label="' +
      esc(pick(collection.title)) + '"></div>' + demoBadge() + "</div>" +
      "<h3>" + esc(pick(collection.title)) + "</h3>" +
      '<p class="meta">' + count + " " + label + " · " + esc(pick(collection.desc)) + "</p>" +
      "</a>";
  }

  function ficha(work) {
    const collection = collectionBySlug(work.collection);
    const rows = [];
    rows.push([t("common.date"), esc(work.date)]);
    if (collection) {
      rows.push([
        t("common.collection"),
        '<a href="#/colecciones/' + collection.slug + '">' + esc(pick(collection.title)) + "</a>"
      ]);
    }
    rows.push([t("common.tags"), esc(work.tags.join(", "))]);
    rows.push([t("common.credit"), esc(t("common.demoCredit"))]);
    rows.push([t("common.license"), esc(t("common.demoLicense"))]);
    return '<dl class="ficha">' + rows.map(function (row) {
      return "<div><dt>" + row[0] + "</dt><dd>" + row[1] + "</dd></div>";
    }).join("") + "</dl>";
  }

  function footer() {
    const year = "2026";
    return '<div class="footer-inner">' +
      "<div><h2>" + t("footer.explore") + "</h2><ul>" +
      '<li><a href="#/fotos">' + t("nav.photos") + "</a></li>" +
      '<li><a href="#/videos">' + t("nav.videos") + "</a></li>" +
      '<li><a href="#/colecciones">' + t("nav.collections") + "</a></li>" +
      '<li><a href="#/sobre-mi">' + t("nav.about") + "</a></li>" +
      '<li><a href="#/contacto">' + t("nav.contact") + "</a></li>" +
      "</ul></div>" +
      "<div><h2>" + t("footer.legal") + "</h2><ul>" +
      '<li><a href="#/privacidad">' + t("footer.privacy") + "</a></li>" +
      '<li><a href="#/terminos">' + t("footer.terms") + "</a></li>" +
      '<li><a href="#/accesibilidad">' + t("footer.accessibility") + "</a></li>" +
      '<li><a href="#/creditos">' + t("footer.credits") + "</a></li>" +
      '<li><a href="#/rss">' + t("footer.rss") + "</a></li>" +
      "</ul></div>" +
      "<div><h2>" + t("footer.connect") + "</h2><ul>" +
      '<li><a href="https://patriciobet.dev">' + t("footer.development") + "</a></li>" +
      '<li><a href="https://github.com/PatricioBet">' + t("footer.github") + "</a></li>" +
      '<li><a href="https://www.linkedin.com/in/patricio-betancourt/">' + t("footer.linkedin") + "</a></li>" +
      "</ul></div>" +
      "</div>" +
      '<div class="footer-bottom">' +
      "<span>" + t("footer.copyright") + " · " + year + "</span>" +
      "<span>" + t("footer.selfhosted") + " · " + t("common.demo") + "</span>" +
      "</div>";
  }

  function homeView() {
    const ws = allWorks();
    const cs = activeCollections();
    const reel = videos()[0];
    const featured = ws.slice().sort(function (a, b) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }).slice(0, 4);

    let html = '<section class="hero">' +
      "<div>" +
      '<p class="kicker">' + t("home.kicker") + "</p>" +
      "<h1>" + t("home.title") + "</h1>" +
      '<p class="lede">' + t("home.subtitle") + "</p>" +
      '<div class="actions">' +
      '<a class="btn btn-primary" href="#/fotos">' + t("home.ctaPhotos") + "</a>" +
      '<a class="btn" href="#/videos">' + t("home.ctaVideos") + "</a>" +
      "</div></div>" +
      '<div class="hero-art"><div class="art art-hero" role="img" aria-label="' +
      esc(t("home.heroAlt")) + '"></div>' + demoBadge() + "</div>" +
      "</section>";

    if (ws.length) {
      html += '<section class="section">' +
        '<div class="section-head"><h2>' + t("home.featured") + "</h2>" +
        '<a class="link-more" href="#/fotos">' + t("home.viewAll") + "</a></div>" +
        '<div class="grid">' + featured.map(workCard).join("") + "</div>" +
        "</section>";

      if (cs.length) {
        html += '<section class="section">' +
          '<div class="section-head"><h2>' + t("home.collections") + "</h2>" +
          '<a class="link-more" href="#/colecciones">' + t("home.viewAll") + "</a></div>" +
          '<div class="grid grid-3">' + cs.map(collectionCard).join("") + "</div>" +
          "</section>";
      }

      if (reel) {
        html += '<section class="section"><div class="section-head"><h2>' +
          t("home.reel") + "</h2></div>" +
          '<div class="reel">' +
          '<div class="reel-art"><div class="art ' + reel.art + '" role="img" aria-label="' +
          esc(pick(reel.alt)) + '"></div>' + demoBadge() +
          '<span class="play-badge" aria-hidden="true">▶</span></div>' +
          "<div><h3>" + esc(pick(reel.title)) + "</h3>" +
          "<p>" + esc(pick(reel.desc)) + "</p>" +
          '<a class="btn" href="' + workRoute(reel) + '">' + t("detail.play") + "</a></div>" +
          "</div></section>";
      }
    } else {
      html += '<section class="section">' +
        emptyState(
          t("home.emptyTitle"),
          t("home.emptyBody"),
          '<a class="btn btn-primary" href="#/sobre-mi">' + t("home.emptyAbout") + "</a>" +
          '<a class="btn" href="#/contacto">' + t("home.emptyContact") + "</a>" +
          '<a class="btn" href="https://patriciobet.dev">' + t("home.emptyDev") + "</a>"
        ) +
        "</section>";
    }

    html += '<section class="section split">' +
      '<div class="portrait"><div class="art art-6" role="img" aria-label="' +
      esc(t("about.portraitAlt")) + '"></div>' + demoBadge() + "</div>" +
      '<div class="prose"><h2>' + t("home.about") + "</h2>" +
      "<p>" + t("home.aboutBody") + "</p>" +
      '<div class="links-row">' +
      '<a class="btn btn-small" href="#/sobre-mi">' + t("home.aboutLink") + "</a>" +
      '<a class="btn btn-small" href="https://patriciobet.dev">' + t("about.dev") + "</a>" +
      "</div></div></section>";

    html += '<section class="section contact-cta">' +
      "<div><h2>" + t("home.contact") + "</h2><p>" + t("home.contactBody") + "</p></div>" +
      '<a class="btn btn-primary" href="#/contacto">' + t("home.contactCta") + "</a>" +
      "</section>";

    return { title: t("home.title") + " — " + t("home.kicker"), html: html };
  }

  function photosView() {
    const list = photos();
    if (!list.length) {
      return {
        title: t("photos.title"),
        html: pageHead(t("photos.title"), t("photos.intro")) +
          '<div class="section">' + emptyState(
            t("photos.emptyTitle"),
            t("photos.emptyBody"),
            '<a class="btn btn-primary" href="#/videos">' + t("photos.emptyCta") + "</a>" +
            '<a class="btn" href="#/sobre-mi">' + t("nav.about") + "</a>"
          ) + "</div>"
      };
    }

    const used = collections.filter(function (c) {
      return list.some(function (w) { return w.collection === c.slug; });
    });
    const active = window.PROTO.state.photoFilter || "";
    let chips = '<button type="button" class="chip" data-action="filter" data-filter="" aria-pressed="' +
      (active === "" ? "true" : "false") + '">' + t("common.all") + "</button>";
    chips += used.map(function (c) {
      return '<button type="button" class="chip" data-action="filter" data-filter="' + c.slug +
        '" aria-pressed="' + (active === c.slug ? "true" : "false") + '">' +
        esc(pick(c.title)) + "</button>";
    }).join("");

    const filtered = active ? list.filter(function (w) { return w.collection === active; }) : list;
    let body;
    if (!filtered.length) {
      const collection = collectionBySlug(active);
      body = emptyState(
        t("photos.filterEmptyTitle"),
        t("photos.filterEmptyBody").replace("{filter}", esc(collection ? pick(collection.title) : active)),
        '<button type="button" class="btn btn-primary" data-action="clear-filter">' +
        t("common.clearFilters") + "</button>" +
        '<a class="btn" href="#/fotos">' + t("common.viewAll") + "</a>"
      );
    } else {
      body = '<div class="grid">' + filtered.map(workCard).join("") + "</div>";
    }

    return {
      title: t("photos.title") + " — " + t("home.title"),
      html: pageHead(t("photos.title"), t("photos.intro")) +
        '<div class="filters" role="group" aria-label="' + t("common.collection") + '">' +
        chips + "</div>" +
        '<div class="section" style="margin-top:0">' + body + "</div>"
    };
  }

  function photoView(slug) {
    const list = photos();
    const index = list.findIndex(function (w) { return w.slug === slug; });
    if (index < 0) return null;

    const work = list[index];
    const collection = collectionBySlug(work.collection);
    const prev = list.length > 1 ? list[(index - 1 + list.length) % list.length] : null;
    const next = list.length > 1 ? list[(index + 1) % list.length] : null;
    const pool = list.filter(function (w) { return w.slug !== work.slug; });
    const same = pool.filter(function (w) { return w.collection === work.collection; });
    const related = same.concat(pool.filter(function (w) { return w.collection !== work.collection; })).slice(0, 3);

    let html = '<div class="breadcrumbs">' +
      '<a href="#/">' + t("nav.home") + "</a>" +
      '<span aria-hidden="true">/</span><a href="#/fotos">' + t("nav.photos") + "</a>" +
      (collection ? '<span aria-hidden="true">/</span><a href="#/colecciones/' + collection.slug + '">' +
        esc(pick(collection.title)) + "</a>" : "") +
      '<span aria-hidden="true">/</span><span aria-current="page">' + esc(pick(work.title)) + "</span>" +
      "</div>";

    html += '<div class="detail-layout">' +
      '<div><div class="detail-art"><div class="art ' + work.art + '" role="img" aria-label="' +
      esc(pick(work.alt)) + '"></div>' + demoBadge() + "</div>" +
      '<p class="notice no-print">' + t("common.noDownload") + "</p></div>" +
      '<div class="detail-panel"><h1>' + esc(pick(work.title)) + "</h1>" +
      '<p class="desc">' + esc(pick(work.desc)) + "</p>" +
      ficha(work) +
      '<div class="detail-actions no-print">' +
      '<button type="button" class="btn btn-primary" data-action="open-lightbox" data-slug="' +
      work.slug + '">' + t("common.enlarge") + "</button>" +
      '<button type="button" class="btn" data-action="copy-link">' + t("common.copy") + "</button>" +
      '<button type="button" class="btn" data-action="print">' + t("common.print") + "</button>" +
      "</div></div></div>";

    if (prev || next) {
      html += '<div class="pager no-print">' +
        (prev ? '<a href="' + workRoute(prev) + '"><span>' + t("common.prev") + "</span>" +
          esc(pick(prev.title)) + "</a>" : "<span></span>") +
        (next ? '<a href="' + workRoute(next) + '" style="text-align:right"><span>' +
          t("common.next") + "</span>" + esc(pick(next.title)) + "</a>" : "<span></span>") +
        "</div>";
    }

    if (related.length) {
      html += '<section class="section related"><div class="section-head"><h2>' +
        t("common.related") + "</h2></div>" +
        '<div class="grid">' + related.map(workCard).join("") + "</div></section>";
    }

    html += '<p class="notice" style="margin-top:32px">' + t("detail.demoNote") + "</p>";
    return { title: pick(work.title) + " — " + t("photos.title"), html: html };
  }

  function videosView() {
    const list = videos();
    if (!list.length) {
      return {
        title: t("videos.title"),
        html: pageHead(t("videos.title"), t("videos.intro")) +
          '<div class="section">' + emptyState(
            t("videos.emptyTitle"),
            t("videos.emptyBody"),
            '<a class="btn btn-primary" href="#/fotos">' + t("videos.emptyCta") + "</a>" +
            '<a class="btn" href="#/sobre-mi">' + t("nav.about") + "</a>"
          ) + "</div>"
      };
    }
    return {
      title: t("videos.title") + " — " + t("home.title"),
      html: pageHead(t("videos.title"), t("videos.intro")) +
        '<div class="section" style="margin-top:32px"><div class="grid">' +
        list.map(workCard).join("") + "</div></div>"
    };
  }

  function videoView(slug) {
    const list = videos();
    const index = list.findIndex(function (w) { return w.slug === slug; });
    if (index < 0) return null;

    const work = list[index];
    const collection = collectionBySlug(work.collection);
    const prev = list.length > 1 ? list[(index - 1 + list.length) % list.length] : null;
    const next = list.length > 1 ? list[(index + 1) % list.length] : null;

    let html = '<div class="breadcrumbs">' +
      '<a href="#/">' + t("nav.home") + "</a>" +
      '<span aria-hidden="true">/</span><a href="#/videos">' + t("nav.videos") + "</a>" +
      (collection ? '<span aria-hidden="true">/</span><a href="#/colecciones/' + collection.slug + '">' +
        esc(pick(collection.title)) + "</a>" : "") +
      '<span aria-hidden="true">/</span><span aria-current="page">' + esc(pick(work.title)) + "</span>" +
      "</div>";

    html += '<div class="detail-layout">' +
      '<div><div class="video-stage" id="video-stage">' +
      '<div class="art ' + work.art + '" role="img" aria-label="' + esc(pick(work.alt)) + '"></div>' +
      demoBadge() +
      '<button type="button" class="big-play" data-action="toggle-video" aria-label="' +
      t("detail.play") + '">▶</button>' +
      '<div class="video-controls">' +
      '<button type="button" class="lb-btn" data-action="toggle-video" aria-label="' +
      t("detail.play") + '" style="min-width:36px;min-height:36px">▶</button>' +
      '<div class="progress" role="progressbar" aria-label="' + t("detail.playing") +
      '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>' +
      "<span>00:00 / " + esc(work.duration) + "</span>" +
      "</div></div>" +
      '<p class="notice no-print">' + t("detail.playerNote") + "</p></div>" +
      '<div class="detail-panel"><h1>' + esc(pick(work.title)) + "</h1>" +
      '<p class="desc">' + esc(pick(work.desc)) + "</p>" +
      ficha(work) +
      '<div class="detail-actions no-print">' +
      '<button type="button" class="btn" data-action="copy-link">' + t("common.copy") + "</button>" +
      '<button type="button" class="btn" data-action="print">' + t("common.print") + "</button>" +
      "</div></div></div>";

    html += '<p class="notice">' + t("detail.videoNote") + "</p>";

    if (prev || next) {
      html += '<div class="pager no-print">' +
        (prev ? '<a href="' + workRoute(prev) + '"><span>' + t("common.prev") + "</span>" +
          esc(pick(prev.title)) + "</a>" : "<span></span>") +
        (next ? '<a href="' + workRoute(next) + '" style="text-align:right"><span>' +
          t("common.next") + "</span>" + esc(pick(next.title)) + "</a>" : "<span></span>") +
        "</div>";
    }

    return { title: pick(work.title) + " — " + t("videos.title"), html: html };
  }

  function collectionsView() {
    const list = activeCollections();
    if (!list.length) {
      return {
        title: t("collections.title"),
        html: pageHead(t("collections.title"), t("collections.intro")) +
          '<div class="section">' + emptyState(
            t("collections.emptyTitle"),
            t("collections.emptyBody"),
            '<a class="btn btn-primary" href="#/fotos">' + t("nav.photos") + "</a>" +
            '<a class="btn" href="#/videos">' + t("nav.videos") + "</a>"
          ) + "</div>"
      };
    }
    return {
      title: t("collections.title") + " — " + t("home.title"),
      html: pageHead(t("collections.title"), t("collections.intro")) +
        '<div class="section" style="margin-top:32px"><div class="grid grid-3">' +
        list.map(collectionCard).join("") + "</div></div>"
    };
  }

  function collectionView(slug) {
    const collection = collectionBySlug(slug);
    const list = collectionWorks(slug);
    if (!collection || !list.length) return null;

    return {
      title: pick(collection.title) + " — " + t("collections.title"),
      html: '<div class="breadcrumbs">' +
        '<a href="#/">' + t("nav.home") + "</a>" +
        '<span aria-hidden="true">/</span><a href="#/colecciones">' + t("nav.collections") + "</a>" +
        '<span aria-hidden="true">/</span><span aria-current="page">' +
        esc(pick(collection.title)) + "</span></div>" +
        '<section class="page-head"><h1>' + esc(pick(collection.title)) + "</h1>" +
        "<p>" + esc(pick(collection.desc)) + "</p></section>" +
        '<div class="section" style="margin-top:32px"><div class="grid">' +
        list.map(workCard).join("") + "</div></div>"
    };
  }

  function aboutView() {
    return {
      title: t("about.title") + " — " + t("home.title"),
      html: pageHead(t("about.title")) +
        '<div class="section split">' +
        '<div class="portrait"><div class="art art-6" role="img" aria-label="' +
        esc(t("about.portraitAlt")) + '"></div>' + demoBadge() + "</div>" +
        '<div class="prose">' +
        "<p>" + t("about.p1") + "</p>" +
        "<p>" + t("about.p2") + "</p>" +
        "<p>" + t("about.p3") + "</p>" +
        '<p class="notice">' + t("about.pending") + "</p>" +
        "<h2 style=\"margin-top:32px\">" + t("about.links") + "</h2>" +
        '<div class="links-row">' +
        '<a class="btn btn-small" href="https://patriciobet.dev">' + t("about.dev") + "</a>" +
        '<a class="btn btn-small" href="https://github.com/PatricioBet">GitHub</a>' +
        '<a class="btn btn-small" href="https://www.linkedin.com/in/patricio-betancourt/">LinkedIn</a>' +
        "</div></div></div>"
    };
  }

  function contactView() {
    return {
      title: t("contact.title") + " — " + t("home.title"),
      html: pageHead(t("contact.title"), t("contact.intro")) +
        '<form class="form" id="contact-form" novalidate>' +
        '<div class="form-grid">' +
        '<div class="field"><label for="name">' + t("contact.name") + "</label>" +
        '<input id="name" name="name" autocomplete="name" required aria-describedby="err-name">' +
        '<p class="field-error" id="err-name"></p></div>' +
        '<div class="field"><label for="email">' + t("contact.email") + "</label>" +
        '<input id="email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="err-email">' +
        '<p class="field-error" id="err-email"></p></div>' +
        "</div>" +
        '<div class="field"><label for="message">' + t("contact.message") + "</label>" +
        '<p class="help" id="msg-help">' + t("contact.messageHelp") + "</p>" +
        '<textarea id="message" name="message" maxlength="5000" required aria-describedby="msg-help msg-count err-message"></textarea>' +
        '<p class="counter" id="msg-count">0 / 5000</p>' +
        '<p class="field-error" id="err-message"></p></div>' +
        '<div class="field check"><input type="checkbox" id="consent" name="consent" required aria-describedby="err-consent">' +
        "<div><label for=\"consent\">" + t("contact.consent") + "</label>" +
        '<p class="help"><a href="#/privacidad">' + t("contact.privacy") + "</a></p></div></div>" +
        '<p class="field-error" id="err-consent"></p>' +
        '<p class="notice no-print" id="form-status" role="status" aria-live="polite"></p>' +
        '<div class="form-actions"><button class="btn btn-primary" type="submit" id="contact-submit">' +
        t("contact.send") + "</button></div>" +
        '<p class="notice no-print">' + t("contact.protoNote") + "</p>" +
        '<div class="success" id="contact-success" hidden tabindex="-1">' +
        "<h2>" + t("contact.successTitle") + "</h2><p>" + t("contact.successBody") + "</p>" +
        '<a class="btn" href="#/">' + t("contact.back") + "</a></div>" +
        '<p class="notice" style="margin-top:24px">' + t("contact.alt") + "</p>" +
        "</form>"
    };
  }

  function resultRow(work) {
    const collection = collectionBySlug(work.collection);
    return '<a class="result" href="' + workRoute(work) + '">' +
      '<div class="result-art"><div class="art ' + work.art + '" role="img" aria-label="' +
      esc(pick(work.alt)) + '"></div></div>' +
      "<div><h3>" + esc(pick(work.title)) + "</h3>" +
      "<p>" + typeLabel(work) + " · " +
      esc(collection ? pick(collection.title) : "") + " · " +
      esc(pick(work.desc)) + "</p></div></a>";
  }

  function searchResults(query) {
    const q = (query || "").trim();
    if (!q) {
      return '<div class="empty"><h2>' + t("search.noQuery") + "</h2>" +
        "<p>" + t("search.noQueryBody") + "</p>" +
        '<div class="actions">' +
        '<a class="btn" href="#/fotos">' + t("nav.photos") + "</a>" +
        '<a class="btn" href="#/videos">' + t("nav.videos") + "</a>" +
        '<a class="btn" href="#/colecciones">' + t("nav.collections") + "</a>" +
        "</div></div>";
    }

    const needle = q.toLowerCase();
    const results = allWorks().filter(function (work) {
      const collection = collectionBySlug(work.collection);
      const haystack = [
        pick(work.title),
        pick(work.desc),
        work.tags.join(" "),
        collection ? pick(collection.title) : ""
      ].join(" ").toLowerCase();
      return haystack.indexOf(needle) !== -1;
    });

    if (!results.length) {
      return '<div class="empty"><h2>' +
        esc(t("search.noResults").replace("{query}", q)) + "</h2>" +
        "<p>" + t("search.noResultsBody") + "</p>" +
        '<div class="actions">' +
        '<button type="button" class="btn btn-primary" data-action="clear-search">' +
        t("search.clear") + "</button>" +
        '<a class="btn" href="#/fotos">' + t("nav.photos") + "</a>" +
        '<a class="btn" href="#/videos">' + t("nav.videos") + "</a>" +
        "</div></div>";
    }

    return "<p>" + results.length + " " + t("search.count") + " «" + esc(q) + "»</p>" +
      results.map(resultRow).join("");
  }

  function searchView() {
    return {
      title: t("search.title") + " — " + t("home.title"),
      html: pageHead(t("search.title")) +
        '<form class="search-form" role="search" id="search-form">' +
        '<label class="sr-only" for="search-input">' + t("search.title") + "</label>" +
        '<input id="search-input" type="search" placeholder="' + esc(t("search.placeholder")) + '">' +
        '<button class="btn" type="submit">' + t("nav.search") + "</button></form>" +
        '<div id="search-results" aria-live="polite">' + searchResults("") + "</div>"
    };
  }

  function notFoundView() {
    return {
      title: t("errors.notFound"),
      html: pageHead("404") +
        '<div class="section">' + emptyState(
          t("errors.notFound"),
          t("errors.notFoundBody"),
          '<a class="btn btn-primary" href="#/">' + t("errors.home") + "</a>" +
          '<a class="btn" href="#/fotos">' + t("errors.photos") + "</a>" +
          '<a class="btn" href="#/buscar">' + t("errors.search") + "</a>"
        ) + "</div>"
    };
  }

  function pendingView(kind) {
    const titles = {
      privacidad: t("legal.privacy"),
      terminos: t("legal.terms"),
      accesibilidad: t("legal.accessibility"),
      creditos: t("legal.credits"),
      rss: t("footer.rss")
    };
    const title = titles[kind] || t("legal.pendingTitle");
    let body = t("legal.pendingBody");
    if (kind === "creditos") body = t("legal.creditsBody");
    if (kind === "rss") body = t("legal.rssBody");
    return {
      title: title + " — " + t("home.title"),
      html: pageHead(esc(title)) +
        '<div class="section"><div class="prose"><p class="notice">' + body + "</p>" +
        '<a class="btn" href="#/">' + t("legal.back") + "</a></div></div>"
    };
  }

  window.PROTO.views = {
    esc: esc,
    t: t,
    pick: pick,
    allWorks: allWorks,
    photos: photos,
    videos: videos,
    collectionBySlug: collectionBySlug,
    collectionWorks: collectionWorks,
    workRoute: workRoute,
    art: art,
    demoBadge: demoBadge,
    workCard: workCard,
    footer: footer,
    home: homeView,
    photos: photosView,
    photo: photoView,
    videos: videosView,
    video: videoView,
    collections: collectionsView,
    collection: collectionView,
    about: aboutView,
    contact: contactView,
    search: searchView,
    searchResults: searchResults,
    notFound: notFoundView,
    pending: pendingView
  };
})();
