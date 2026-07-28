export type Locale = "pt" | "es" | "en";

export type Milestone = {
  year: string;
  title: string;
  lines: string[];
  tag?: string;
};

export type Show = {
  year: string;
  title: string;
};

export type RecentPartner = {
  year: string;
  name: string;
  place: string;
  detail: string;
};

export type Strength = {
  icon: string;
  title: string;
  text: string;
};

export type Project = {
  tag: string;
  title: string;
  description: string;
  image: string;
  year?: number | string;
  accent?: "cyan" | "magenta" | "yellow";
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
    projectsTitle: string;
    projectsDescription: string;
  };
  nav: {
    about: string;
    services: string;
    projects: string;
    contact: string;
    quote: string;
    menuOpen: string;
    menuClose: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
    trust: string;
  };
  marquee: string[];
  stats: { num: string; lbl: string }[];
  manifesto: {
    before: string;
    accent1: string;
    accent2: string;
    mid: string;
    accent3: string;
    sub: string;
    readMore: string;
    readLess: string;
    story: string[];
  };
  about: {
    eyebrow: string;
    titleLine1: string;
    titleEm: string;
    intro: string[];
    highlights: string[];
    hotels: {
      title: string;
      paragraphs: string[];
      partnersLabel: string;
      partners: string[];
      recentLabel: string;
      recent: RecentPartner[];
    };
    timelineLabel: string;
    journeyTitle: string;
    milestones: Milestone[];
    showsLabel: string;
    showsSubtitle: string;
    shows: Show[];
    strengthsLabel: string;
    strengths: Strength[];
    audiencesLabel: string;
    audiences: string[];
    corporateIntro: string;
    closingQuote: string;
    closing: string;
    years: string;
  };
  services: {
    eyebrow: string;
    titleLine1: string;
    titleEm: string;
    intro: string;
    learnMore: string;
    prev: string;
    next: string;
    items: {
      tag: string;
      lines: { text: string; accent?: "cyan" | "magenta" | "yellow" }[][];
      image: string;
    }[];
  };
  clients: {
    eyebrow: string;
    title: string;
    titleEm: string;
    items: string[];
  };
  testimonials: {
    eyebrow: string;
    titleLine1: string;
    titleEm: string;
    items: { quote: string; who: string }[];
    note: string;
  };
  instagram: {
    follow: string;
    before: string;
    accent: string;
    after: string;
    sub: string;
    cta: string;
  };
  projects: {
    eyebrow: string;
    titleLine1: string;
    titleEm: string;
    intro: string;
    headlineBefore: string;
    accent1: string;
    mid: string;
    accent2: string;
    sub: string;
    cta: string;
    backHome: string;
    playWithSound: string;
    muteVideo: string;
    prevImage: string;
    nextImage: string;
    items: Project[];
  };
  contact: {
    eyebrow: string;
    titleLine1: string;
    titleEm: string;
    intro: string;
    name: string;
    email: string;
    phone: string;
    eventType: string;
    details: string;
    submit: string;
    whatsappEyebrow: string;
    whatsappIntro: string;
    whatsappCta: string;
    whatsappFloat: string;
    eventTypes: string[];
    ringBefore: string;
    ringAccent: string;
    ringAfter: string;
    pitch: string;
    cta: string;
    close: string;
    submitting: string;
    successTitle: string;
    successText: string;
    errorText: string;
  };
  footer: {
    copy: string;
    note: string;
    legal: string;
    privacy: string;
    cookies: string;
  };
  cookiesBanner: {
    title: string;
    text: string;
    policy: string;
    accept: string;
    reject: string;
    settings: string;
    settingsTitle: string;
    settingsIntro: string;
    save: string;
    close: string;
    alwaysOn: string;
    necessaryTitle: string;
    necessaryText: string;
    preferencesTitle: string;
    preferencesText: string;
    analyticsTitle: string;
    analyticsText: string;
    marketingTitle: string;
    marketingText: string;
    manage: string;
  };
  ui: {
    readMore: string;
    readLess: string;
    viewStory: string;
    hideStory: string;
    viewService: string;
    hideService: string;
    moreReviews: string;
    lessReviews: string;
    viewProjectInfo: string;
    hideProjectInfo: string;
  };
};
