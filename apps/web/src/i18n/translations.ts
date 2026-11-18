/* ===================================================================
   i18n — Translation utilities and data
   =================================================================== */

export type Locale = "es" | "en";

export interface Translations {
  nav: {
    home: string;
    photos: string;
    videos: string;
    collections: string;
    about: string;
    contact: string;
    search: string;
    skip: string;
    menu: string;
    close: string;
    theme: string;
    language: string;
  };
  footer: {
    privacy: string;
    terms: string;
    accessibility: string;
    credits: string;
    rss: string;
    development: string;
    copyright: string;
    selfhosted: string;
  };
  home: {
    heroSubtitle: string;
    viewPhotos: string;
    viewVideos: string;
    selectedWork: string;
    collections: string;
    featuredReel: string;
    aboutSection: string;
    workTogether: string;
    viewAll: string;
    readMore: string;
    emptyArchiveTitle: string;
    emptyArchiveText: string;
    emptyArchiveActions: string[];
  };
  photos: {
    title: string;
    intro: string;
    emptyTitle: string;
    emptyText: string;
    emptyActions: string[];
    noResultsTitle: string;
    noResultsText: string;
    noResultsActions: string[];
    filterAll: string;
    filterCollection: string;
    filterTag: string;
    filterYear: string;
    filterType: string;
    filterSort: string;
    filterRecent: string;
    filterOldest: string;
    filterClear: string;
    filterResults: (n: number) => string;
    previous: string;
    next: string;
    enlarge: string;
    share: string;
    copy: string;
    copied: string;
    related: string;
    date: string;
    collection: string;
    tags: string;
    credit: string;
    license: string;
    rights: string;
    noDownload: string;
  };
  videos: {
    title: string;
    intro: string;
    emptyTitle: string;
    emptyText: string;
    emptyActions: string[];
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    quality: string;
    fullscreen: string;
    captions: string;
    transcript: string;
    duration: string;
    notReady: string;
  };
  collections: {
    title: string;
    emptyTitle: string;
    emptyText: string;
    pieces: (n: number) => string;
  };
  search: {
    title: string;
    placeholder: string;
    all: string;
    photos: string;
    videos: string;
    collections: string;
    whatAreYouLooking: string;
    searchHint: string;
    suggestions: string[];
    noResultsTitle: (query: string) => string;
    noResultsText: string;
    noResultsActions: string[];
  };
  about: {
    title: string;
    focus: string;
  };
  contact: {
    title: string;
    intro: string;
    name: string;
    email: string;
    message: string;
    consent: string;
    send: string;
    sending: string;
    messageHelp: string;
    alternative: string;
    successTitle: string;
    successText: string;
    successAction: string;
    errorEmpty: (field: string) => string;
    errorInvalidEmail: string;
    errorTooLong: string;
    errorNoConsent: string;
    errorTurnstile: string;
  };
  errors: {
    notFoundTitle: string;
    notFoundText: string;
    notFoundActions: string[];
    goneTitle: string;
    goneText: string;
    goneActions: string[];
    errorTitle: string;
    errorText: string;
    errorActions: string[];
  };
  common: {
    backToHome: string;
    clearFilters: string;
    viewAllPhotos: string;
    viewAllVideos: string;
    loading: string;
  };
}

/* --- Spanish translations --- */
export const es: Translations = {
  nav: {
    home: "Inicio",
    photos: "Fotos",
    videos: "Videos",
    collections: "Colecciones",
    about: "Sobre mí",
    contact: "Contacto",
    search: "Buscar",
    skip: "Saltar al contenido",
    menu: "Menú",
    close: "Cerrar",
    theme: "Cambiar tema",
    language: "Idioma: Español",
  },
  footer: {
    privacy: "Privacidad",
    terms: "Términos",
    accessibility: "Accesibilidad",
    credits: "Créditos",
    rss: "RSS",
    development: "Desarrollo",
    copyright: "© Patricio Betancourt. Todos los derechos reservados.",
    selfhosted: "Sitio autoalojado",
  },
  home: {
    heroSubtitle: "Fotografía y video",
    viewPhotos: "Ver fotos",
    viewVideos: "Ver videos",
    selectedWork: "Trabajos destacados",
    collections: "Colecciones",
    featuredReel: "Reel destacado",
    aboutSection: "Sobre mí",
    workTogether: "¿Trabajamos juntos?",
    viewAll: "Ver todo",
    readMore: "Leer más",
    emptyArchiveTitle: "EL ARCHIVO SE ESTÁ PREPARANDO",
    emptyArchiveText:
      "Fotografías y videos llegarán pronto.\nMientras tanto, puedes conocer mi trabajo de desarrollo.",
    emptyArchiveActions: ["Sobre mí", "Contacto", "Desarrollo"],
  },
  photos: {
    title: "Fotos",
    intro: "Una selección de imágenes, sin recortes ni ruido.",
    emptyTitle: "AÚN NO HAY FOTOGRAFÍAS PUBLICADAS",
    emptyText:
      "Estoy preparando la primera selección. Vuelve pronto o explora los videos.",
    emptyActions: ["Ver videos", "Sobre mí"],
    noResultsTitle: "NINGUNA PIEZA COINCIDE CON ESTOS FILTROS",
    noResultsText:
      "Estás viendo: {filters}. Prueba quitando uno o vuelve a todo.",
    noResultsActions: ["Quitar filtros", "Ver todo"],
    filterAll: "Todas",
    filterCollection: "Colección",
    filterTag: "Etiqueta",
    filterYear: "Año",
    filterType: "Tipo",
    filterSort: "Orden",
    filterRecent: "Recientes",
    filterOldest: "Más antiguas",
    filterClear: "Limpiar filtros",
    filterResults: (n: number) => `${n} resultados`,
    previous: "Anterior",
    next: "Siguiente",
    enlarge: "Ampliar",
    share: "Compartir",
    copy: "Copiar enlace",
    copied: "Enlace copiado",
    related: "Relacionados",
    date: "Fecha",
    collection: "Colección",
    tags: "Etiquetas",
    credit: "Crédito",
    license: "Licencia",
    rights: "© Patricio Betancourt. Todos los derechos reservados.",
    noDownload: "El original no está disponible para descarga.",
  },
  videos: {
    title: "Videos",
    intro: "Piezas breves, en movimiento.",
    emptyTitle: "AÚN NO HAY VIDEOS PUBLICADOS",
    emptyText: "La primera pieza audiovisual está en preparación.",
    emptyActions: ["Ver fotos", "Sobre mí"],
    play: "Reproducir",
    pause: "Pausar",
    mute: "Silenciar",
    unmute: "Activar sonido",
    quality: "Calidad",
    fullscreen: "Pantalla completa",
    captions: "Subtítulos",
    transcript: "Transcripción",
    duration: "Duración",
    notReady: "Este video todavía se está preparando.",
  },
  collections: {
    title: "Colecciones",
    emptyTitle: "LAS COLECCIONES SE ESTÁN ORGANIZANDO",
    emptyText: "Mientras tanto, puedes ver todas las fotos y videos.",
    pieces: (n: number) => `${n} piezas`,
  },
  search: {
    title: "Buscar",
    placeholder: "Busca por título, descripción, colección o etiqueta…",
    all: "Todo",
    photos: "Fotos",
    videos: "Videos",
    collections: "Colecciones",
    whatAreYouLooking: "¿QUÉ ESTÁS BUSCANDO?",
    searchHint: "Busca por título, descripción, colección o etiqueta.",
    suggestions: ["Fotos", "Videos", "Colecciones"],
    noResultsTitle: (query: string) =>
      `NO ENCONTRAMOS RESULTADOS PARA «${query}»`,
    noResultsText: "Prueba con otra palabra o quita los filtros.",
    noResultsActions: ["Limpiar filtros", "Ver todas las fotos", "Ver todos los videos"],
  },
  about: {
    title: "Sobre mí",
    focus: "Enfoque",
  },
  contact: {
    title: "Contacto",
    intro: "¿Tienes un proyecto o una pregunta? Escríbeme.",
    name: "Nombre",
    email: "Correo",
    message: "Mensaje",
    consent: "Acepto la política de privacidad.",
    send: "Enviar mensaje",
    sending: "Enviando…",
    messageHelp: "Máximo 5 000 caracteres. No incluyas datos sensibles.",
    alternative: "¿Prefieres correo?",
    successTitle: "✓ Mensaje enviado",
    successText: "Gracias por escribir. Te responderé al correo que indicaste.",
    successAction: "Volver al inicio",
    errorEmpty: (field: string) => `Escribe tu ${field}.`,
    errorInvalidEmail:
      "Revisa el correo: falta el formato nombre@dominio.",
    errorTooLong: "El mensaje supera los 5 000 caracteres.",
    errorNoConsent: "Necesito tu consentimiento para responder.",
    errorTurnstile:
      "No pudimos verificar que eres una persona. Intenta de nuevo o usa el correo alternativo.",
  },
  errors: {
    notFoundTitle: "NO ENCONTRAMOS ESTA PÁGINA",
    notFoundText:
      "Puede que el enlace esté mal o que la pieza haya cambiado de URL.",
    notFoundActions: ["Ir al inicio", "Ver fotos", "Buscar"],
    goneTitle: "ESTA PIEZA YA NO ESTÁ PUBLICADA",
    goneText: "El autor retiró este contenido.",
    goneActions: ["Ver fotos", "Ver videos", "Inicio"],
    errorTitle: "ALGO SALIÓ MAL",
    errorText: "No pudimos cargar esta página. Intenta de nuevo en unos minutos.",
    errorActions: ["Reintentar", "Inicio"],
  },
  common: {
    backToHome: "Volver al inicio",
    clearFilters: "Limpiar filtros",
    viewAllPhotos: "Ver todas las fotos",
    viewAllVideos: "Ver todos los videos",
    loading: "Cargando…",
  },
};

/* --- English translations --- */
export const en: Translations = {
  nav: {
    home: "Home",
    photos: "Photos",
    videos: "Videos",
    collections: "Collections",
    about: "About",
    contact: "Contact",
    search: "Search",
    skip: "Skip to content",
    menu: "Menu",
    close: "Close",
    theme: "Change theme",
    language: "Language: English",
  },
  footer: {
    privacy: "Privacy",
    terms: "Terms",
    accessibility: "Accessibility",
    credits: "Credits",
    rss: "RSS",
    development: "Development",
    copyright: "© Patricio Betancourt. All rights reserved.",
    selfhosted: "Self-hosted site",
  },
  home: {
    heroSubtitle: "Photography and video",
    viewPhotos: "View photos",
    viewVideos: "View videos",
    selectedWork: "Selected work",
    collections: "Collections",
    featuredReel: "Featured reel",
    aboutSection: "About",
    workTogether: "Let's work together",
    viewAll: "View all",
    readMore: "Read more",
    emptyArchiveTitle: "THE ARCHIVE IS BEING PREPARED",
    emptyArchiveText:
      "Photographs and videos will arrive soon.\nIn the meantime, you can explore my development work.",
    emptyArchiveActions: ["About", "Contact", "Development"],
  },
  photos: {
    title: "Photos",
    intro: "A selection of images, without crops or noise.",
    emptyTitle: "NO PHOTOGRAPHS PUBLISHED YET",
    emptyText:
      "I'm preparing the first selection. Come back soon or explore the videos.",
    emptyActions: ["View videos", "About"],
    noResultsTitle: "NO WORK MATCHES THESE FILTERS",
    noResultsText:
      "You're viewing: {filters}. Try removing one or go back to everything.",
    noResultsActions: ["Clear filters", "View all"],
    filterAll: "All",
    filterCollection: "Collection",
    filterTag: "Tag",
    filterYear: "Year",
    filterType: "Type",
    filterSort: "Sort",
    filterRecent: "Recent",
    filterOldest: "Oldest",
    filterClear: "Clear filters",
    filterResults: (n: number) => `${n} results`,
    previous: "Previous",
    next: "Next",
    enlarge: "Enlarge",
    share: "Share",
    copy: "Copy link",
    copied: "Link copied",
    related: "Related",
    date: "Date",
    collection: "Collection",
    tags: "Tags",
    credit: "Credit",
    license: "License",
    rights: "© Patricio Betancourt. All rights reserved.",
    noDownload: "The original is not available for download.",
  },
  videos: {
    title: "Videos",
    intro: "Short pieces, in motion.",
    emptyTitle: "NO VIDEOS PUBLISHED YET",
    emptyText: "The first audiovisual piece is in preparation.",
    emptyActions: ["View photos", "About"],
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    unmute: "Unmute",
    quality: "Quality",
    fullscreen: "Full screen",
    captions: "Captions",
    transcript: "Transcript",
    duration: "Duration",
    notReady: "This video is still being prepared.",
  },
  collections: {
    title: "Collections",
    emptyTitle: "COLLECTIONS ARE BEING ORGANIZED",
    emptyText: "In the meantime, you can view all photos and videos.",
    pieces: (n: number) => `${n} pieces`,
  },
  search: {
    title: "Search",
    placeholder: "Search by title, description, collection or tag…",
    all: "All",
    photos: "Photos",
    videos: "Videos",
    collections: "Collections",
    whatAreYouLooking: "WHAT ARE YOU LOOKING FOR?",
    searchHint: "Search by title, description, collection or tag.",
    suggestions: ["Photos", "Videos", "Collections"],
    noResultsTitle: (query: string) =>
      `NO RESULTS FOR "${query}"`,
    noResultsText: "Try another word or clear the filters.",
    noResultsActions: ["Clear filters", "View all photos", "View all videos"],
  },
  about: {
    title: "About",
    focus: "Focus",
  },
  contact: {
    title: "Contact",
    intro: "Do you have a project or a question? Write to me.",
    name: "Name",
    email: "Email",
    message: "Message",
    consent: "I accept the privacy policy.",
    send: "Send message",
    sending: "Sending…",
    messageHelp: "Maximum 5,000 characters. Do not include sensitive data.",
    alternative: "Prefer email?",
    successTitle: "✓ Message sent",
    successText: "Thanks for writing. I'll reply to the email you provided.",
    successAction: "Back to home",
    errorEmpty: (field: string) => `Enter your ${field}.`,
    errorInvalidEmail:
      "Check the email: it needs the name@domain format.",
    errorTooLong: "The message exceeds 5,000 characters.",
    errorNoConsent: "I need your consent to reply.",
    errorTurnstile:
      "We couldn't verify you're a person. Try again or use the alternate email.",
  },
  errors: {
    notFoundTitle: "WE COULDN'T FIND THIS PAGE",
    notFoundText:
      "The link may be wrong or the piece may have a new URL.",
    notFoundActions: ["Go home", "View photos", "Search"],
    goneTitle: "THIS PIECE IS NO LONGER PUBLISHED",
    goneText: "The author removed this content.",
    goneActions: ["View photos", "View videos", "Home"],
    errorTitle: "SOMETHING WENT WRONG",
    errorText: "We couldn't load this page. Try again in a few minutes.",
    errorActions: ["Retry", "Home"],
  },
  common: {
    backToHome: "Back to home",
    clearFilters: "Clear filters",
    viewAllPhotos: "View all photos",
    viewAllVideos: "View all videos",
    loading: "Loading…",
  },
};

/* --- Locale display name --- */
export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

/**
 * Get translations for the given locale.
 */
export function t(locale: Locale): Translations {
  return locale === "en" ? en : es;
}

/**
 * Build the canonical URL for a page.
 */
export function canonical(
  locale: Locale,
  path: string,
  site: string = "https://photo.patriciobet.dev"
): string {
  if (locale === "es" || path === "") {
    return `${site}${path}`;
  }
  return `${site}/${locale}${path}`;
}

/**
 * Build the hreflang alternate URL for a page.
 */
export function hreflang(
  locale: Locale,
  path: string,
  site: string = "https://photo.patriciobet.dev"
): string {
  if (locale === "es" || path === "") {
    return `${site}${path}`;
  }
  return `${site}/${locale}${path}`;
}
