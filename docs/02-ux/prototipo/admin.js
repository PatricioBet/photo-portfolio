/* Admin views for the prototype. Static, no authentication, no real uploads. */
(function () {
  const v = window.PROTO.views;

  function shell(active, title, content) {
    const nav = [
      ["dashboard", "#/admin", v.t("admin.dashboard")],
      ["media", "#/admin/media", v.t("admin.media")],
      ["publish", "#/admin/publish", v.t("admin.publish")]
    ];
    return '<div class="admin-shell">' +
      '<aside class="admin-side">' +
      '<a class="brand" href="#/admin">PB</a>' +
      '<p class="proto-note" style="color:var(--text-muted);font-size:12px">' +
      v.t("admin.sideNote") + "</p>" +
      '<nav aria-label="' + v.t("admin.title") + '">' +
      nav.map(function (item) {
        const current = item[0] === active ? ' aria-current="page"' : "";
        return '<a href="' + item[1] + '"' + current + ">" + item[2] + "</a>";
      }).join("") +
      "</nav>" +
      '<div class="admin-exit"><a href="#/">' + v.t("admin.exit") + "</a></div>" +
      "</aside>" +
      '<div class="admin-main">' +
      '<header class="admin-top"><h1>' + title + "</h1>" +
      '<p class="notice" style="margin:0">' + v.t("admin.note") + "</p></header>" +
      content +
      "</div></div>";
  }

  function stat(label, value) {
    return '<div class="stat"><span>' + label + "</span><strong>" + value + "</strong></div>";
  }

  function dashboard() {
    const works = v.allWorks();
    const photos = works.filter(function (w) { return w.type === "photo"; });
    const videos = works.filter(function (w) { return w.type === "video"; });
    const empty = window.PROTO.state.content === "empty";
    const checklist = [
      [v.t("admin.check.passkey"), true],
      [v.t("admin.check.backup"), true],
      [v.t("admin.check.content"), false],
      [v.t("admin.check.demo"), empty]
    ];

    let html = '<div class="stats">' +
      stat(v.t("admin.stats.photos"), photos.length) +
      stat(v.t("admin.stats.videos"), videos.length) +
      stat(v.t("admin.stats.drafts"), 0) +
      stat(v.t("admin.stats.trash"), 0) +
      "</div>";

    html += '<div class="admin-grid">' +
      '<div class="panel"><h2>' + v.t("admin.checklist") + "</h2>" +
      '<ul class="checklist">' + checklist.map(function (item) {
        return "<li><span class=\"" + (item[1] ? "done" : "todo") + "\">" +
          (item[1] ? "✓" : "○") + "</span><span>" + item[0] + "</span></li>";
      }).join("") + "</ul></div>" +
      '<div class="panel"><h2>' + v.t("admin.system") + "</h2>" +
      '<dl class="kv">' +
      "<div><dt>" + v.t("admin.system.build") + "</dt><dd>" + v.t("admin.value.build") + "</dd></div>" +
      "<div><dt>" + v.t("admin.system.backup") + "</dt><dd>" + v.t("admin.value.backup") + "</dd></div>" +
      "<div><dt>" + v.t("admin.system.disk") + "</dt><dd>42 %</dd></div>" +
      "<div><dt>" + v.t("admin.system.queue") + "</dt><dd>0</dd></div>" +
      "</dl></div></div>";

    html += "<h2 style=\"font-size:20px;margin:32px 0 16px\">" + v.t("admin.recent") + "</h2>";
    if (!works.length) {
      html += '<div class="empty"><h3>' + v.t("admin.media.empty") + "</h3>" +
        "<p>" + v.t("admin.media.emptyBody") + "</p>" +
        '<a class="btn btn-primary" href="#/admin/media">' + v.t("admin.upload") + "</a></div>";
    } else {
      html += '<div class="table-wrap"><table><caption>' +
        works.length + " " + v.t("common.pieces") + "</caption><thead><tr>" +
        "<th scope=\"col\">" + v.t("admin.table.title") + "</th>" +
        "<th scope=\"col\">" + v.t("admin.table.type") + "</th>" +
        "<th scope=\"col\">" + v.t("admin.table.status") + "</th>" +
        "<th scope=\"col\">" + v.t("admin.table.collection") + "</th>" +
        "</tr></thead><tbody>" +
        works.slice(0, 5).map(function (work) {
          const collection = v.collectionBySlug(work.collection);
          return "<tr><td>" + v.esc(v.pick(work.title)) + "</td><td>" +
            (work.type === "video" ? v.t("common.video") : v.t("common.photo")) + "</td><td>" +
            v.t("admin.status.published") + "</td><td>" +
            v.esc(collection ? v.pick(collection.title) : "—") + "</td></tr>";
        }).join("") +
        "</tbody></table></div>";
    }

    return { title: v.t("admin.title"), html: shell("dashboard", v.t("admin.hello"), html) };
  }

  function media() {
    const works = v.allWorks();
    let html = '<div class="panel" style="margin-bottom:24px">' +
      "<h2>" + v.t("admin.upload") + "</h2>" +
      '<input type="file" id="admin-file" class="sr-only" multiple accept="image/*,video/*">' +
      '<label class="dropzone" for="admin-file">' +
      "<strong>" + v.t("admin.upload") + "</strong>" +
      "<span>" + v.t("admin.drop") + "</span></label>" +
      '<p class="notice" id="upload-note" aria-live="polite">' + v.t("admin.uploadNote") + "</p>" +
      "</div>";

    if (!works.length) {
      html += '<div class="empty"><h2>' + v.t("admin.media.empty") + "</h2>" +
        "<p>" + v.t("admin.media.emptyBody") + "</p></div>";
    } else {
      html += '<div class="table-wrap"><table><caption>' +
        v.t("admin.media") + " · " + works.length + " " + v.t("common.pieces") +
        "</caption><thead><tr>" +
        "<th scope=\"col\">" + v.t("admin.table.title") + "</th>" +
        "<th scope=\"col\">" + v.t("admin.table.type") + "</th>" +
        "<th scope=\"col\">" + v.t("admin.table.status") + "</th>" +
        "<th scope=\"col\">" + v.t("admin.table.collection") + "</th>" +
        "</tr></thead><tbody>" +
        works.map(function (work) {
          const collection = v.collectionBySlug(work.collection);
          return "<tr><td>" + v.esc(v.pick(work.title)) +
            " <span class=\"demo-badge\" style=\"position:static;display:inline-block\">" +
            v.t("common.demo") + "</span></td><td>" +
            (work.type === "video" ? v.t("common.video") : v.t("common.photo")) + "</td><td>" +
            v.t("admin.status.published") + "</td><td>" +
            v.esc(collection ? v.pick(collection.title) : "—") + "</td></tr>";
        }).join("") +
        "</tbody></table></div>";
    }

    return { title: v.t("admin.media"), html: shell("media", v.t("admin.media"), html) };
  }

  function publish() {
    const empty = window.PROTO.state.content === "empty";
    let html = "";

    if (empty) {
      html += '<div class="empty"><h2>' + v.t("admin.publish.empty") + "</h2>" +
        "<p>" + v.t("admin.publish.emptyBody") + "</p>" +
        '<a class="btn btn-primary" href="#/admin/media">' + v.t("admin.upload") + "</a></div>";
    } else {
      html += '<div class="publish-box"><div>' +
        "<strong>" + v.t("admin.publish.pending") + "</strong>" +
        '<p id="publish-status" aria-live="polite" style="margin:4px 0 0;color:var(--text-muted)">' +
        v.t("admin.value.ready") + "</p></div>" +
        '<button type="button" class="btn btn-primary" data-action="publish">' +
        v.t("admin.publish.button") + "</button></div>";

      html += '<div class="panel"><h2>' + v.t("admin.publish.releases") + "</h2>" +
        '<ul class="release-list">' +
        "<li><span>2026-11-17-1 · " + v.t("admin.publish.current") + " · 1 min 12 s</span>" +
        "<span><button type=\"button\" class=\"btn btn-small\" disabled>Rollback</button></span></li>" +
        "<li><span>2026-11-17-0 · 1 min 05 s</span>" +
        "<span><button type=\"button\" class=\"btn btn-small\" disabled>Rollback</button></span></li>" +
        "<li><span>2026-11-16-2 · 0 min 58 s</span>" +
        "<span><button type=\"button\" class=\"btn btn-small\" disabled>Rollback</button></span></li>" +
        "</ul>" +
        '<p class="notice">' + v.t("admin.note") + "</p></div>";
    }

    return { title: v.t("admin.publish"), html: shell("publish", v.t("admin.publish"), html) };
  }

  window.PROTO.admin = {
    dashboard: dashboard,
    media: media,
    publish: publish
  };
})();
