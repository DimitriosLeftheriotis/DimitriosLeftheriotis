import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(root, file), 'utf8');

const requiredFiles = [
  'index.html',
  'styles.css',
  'script.js',
  'Biography.md',
  'Biography.pdf',
  '.nojekyll',
  'README.md',
];

const sectionIds = [
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'resume',
  'contact',
];

const projects = [
  'Agentic Harness with Ollama',
  'Pathfinding Visualizer',
  'Annual Training Plan',
];

test('all deployment files exist', () => {
  for (const file of requiredFiles) {
    assert.ok(existsSync(join(root, file)), `${file} should exist`);
  }
});

test('document has complete metadata and local assets', () => {
  const html = read('index.html');
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<html[^>]+lang="en"/i);
  assert.match(html, /<meta[^>]+charset="utf-8"/i);
  assert.match(html, /<meta[^>]+name="viewport"[^>]+width=device-width/i);
  assert.match(html, /<title>[^<]*Dimitrios Leftheriotis[^<]*<\/title>/i);
  assert.match(html, /<meta[^>]+name="author"[^>]+Dimitrios Leftheriotis/i);
  assert.match(html, /<meta[^>]+name="description"[^>]+content="[^"]+"/i);
  assert.match(html, /<meta[^>]+property="og:title"/i);
  assert.match(html, /<meta[^>]+property="og:description"/i);
  assert.match(html, /<meta[^>]+property="og:type"[^>]+website/i);
  assert.match(html, /<link[^>]+rel="stylesheet"[^>]+href="styles\.css"/i);
  assert.match(html, /<script[^>]+src="script\.js"[^>]+defer/i);
});

test('document uses semantic landmarks and a single primary heading', () => {
  const html = read('index.html');
  for (const element of ['header', 'nav', 'main', 'footer']) {
    assert.match(html, new RegExp(`<${element}\\b`, 'i'));
  }
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<a[^>]+class="skip-link"[^>]+href="#main-content"/i);
  assert.match(html, /<main[^>]+id="main-content"/i);
});

test('all portfolio sections and navigation destinations exist', () => {
  for (const id of sectionIds) {
    assert.match(read('index.html'), new RegExp(`<section[^>]+id="${id}"`, 'i'), `missing #${id}`);
    assert.match(read('index.html'), new RegExp(`href="#${id}"`, 'i'), `missing link to #${id}`);
  }
});

test('biography content is source-backed and cleaned for the web', () => {
  const html = read('index.html');
  assert.match(html, /Undergraduate Student\/Researcher/i);
  assert.match(html, /Ionian University/i);
  assert.match(html, /Applied AI &amp; Computational Modelling/i);
  assert.match(html, /2024\s*(?:<[^>]+>\s*)*[–-]\s*Present/i);
  assert.match(html, /Python/i);
  assert.match(html, /CodeCarbon/i);
  assert.match(html, /Arduino/i);
  assert.doesNotMatch(html, /\[\[/);
});

test('completed projects are represented with verified details and source links', () => {
  const html = read('index.html');
  for (const project of projects) {
    assert.ok(html.includes(project), `missing project: ${project}`);
  }

  assert.equal((html.match(/class="project-card"/g) ?? []).length, projects.length);
  assert.doesNotMatch(html, /Details coming soon\./i);
  assert.match(html, /coach-provided annual training data/i);
  assert.match(html, /transparent AI coding agent harness/i);
  assert.match(html, /interactive 2D grid pathfinding visualizer/i);

  const expectedTechnologies = [
    'Python', 'Flask', 'Matplotlib', 'NumPy', 'HTML', 'JavaScript',
    'Ollama', 'Local LLMs', 'Tool Calling', 'CLI', 'Sandboxing',
    'Pygame', 'A* Search', 'Dijkstra', 'BFS &amp; DFS', 'Graph Algorithms',
  ];
  for (const technology of expectedTechnologies) {
    const escaped = technology.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    assert.match(html, new RegExp(`<li>${escaped}</li>`, 'i'), `missing project technology: ${technology}`);
  }

  const repositories = [
    {
      url: 'https://github.com/DimitriosLeftheriotis/Agentic-Harness-with-Ollama',
      ariaLabel: 'View Agentic Harness with Ollama source code on GitHub',
    },
    {
      url: 'https://github.com/DimitriosLeftheriotis/Pathfinding-Visualizer',
      ariaLabel: 'View Pathfinding Visualizer source code on GitHub',
    },
    {
      url: 'https://github.com/DimitriosLeftheriotis/Annual-Training-Plan',
      ariaLabel: 'View Annual Training Plan source code on GitHub',
    },
  ];

  for (const repo of repositories) {
    assert.ok((html.match(new RegExp(`href="${repo.url}"`, 'g')) ?? []).length >= 2, `missing links for ${repo.url}`);
    assert.match(html, new RegExp(`aria-label="${repo.ariaLabel}"`, 'i'));
  }
});

test('resume and contact destinations are correct', () => {
  const html = read('index.html');
  assert.match(html, /href="Biography\.pdf"[^>]+download/i);
  assert.match(html, /href="mailto:inf2024104@ionio\.gr"/i);
  assert.match(html, /href="mailto:dimitriosleft@gmail\.com"/i);
  assert.match(html, /href="https:\/\/github\.com\/DimitriosLeftheriotis"/i);
  assert.match(html, /href="https:\/\/www\.linkedin\.com\/in\/dimitris-leftheriotis-4b0362347\/"/i);
  assert.doesNotMatch(html, /href="\/(?!\/)/i, 'local links must remain relative for project Pages');
});

test('interactive controls expose accessible state', () => {
  const html = read('index.html');
  assert.match(html, /<button[^>]+class="nav-toggle"/i);
  assert.match(html, /aria-controls="primary-navigation"/i);
  assert.match(html, /aria-expanded="false"/i);
  assert.match(html, /<ul[^>]+id="primary-navigation"/i);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
});

test('styles provide a responsive, accessible visual system', () => {
  const css = read('styles.css');
  assert.match(css, /:root\s*{/);
  assert.match(css, /--color-accent\s*:/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\([^)]*max-width/i);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
  assert.match(css, /\.nav-toggle-line:nth-of-type\(2\)/);
  assert.doesNotMatch(css, /\.nav-toggle-line:first-of-type/);
  assert.match(css, /scroll-margin-top/);
});

test('script progressively enhances navigation and reveal behavior', () => {
  const js = read('script.js');
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /aria-expanded/);
  assert.match(js, /Escape/);
  assert.match(js, /classList/);
  assert.match(js, /prefers-reduced-motion/);
});

test('documentation explains dependency-free preview and branch deployment', () => {
  const readme = read('README.md');
  assert.match(readme, /GitHub Pages/i);
  assert.match(readme, /Deploy from a branch/i);
  assert.match(readme, /node --test tests\/site\.test\.mjs/i);
  assert.match(readme, /no (?:build step|dependencies)/i);
});

test('theme toggle initializes early and exposes accessible state', () => {
  const html = read('index.html');
  const css = read('styles.css');
  const js = read('script.js');

  assert.match(html, /<button[^>]+class="theme-toggle"[^>]+aria-pressed="false"/i);
  assert.match(html, /<span[^>]+class="sr-only"[^>]*>Dark mode<\/span>/i);
  assert.match(html, /data-theme-icon="sun"/i);
  assert.match(html, /data-theme-icon="moon"/i);
  assert.ok(
    html.indexOf('portfolio-theme') < html.indexOf('rel="stylesheet"'),
    'saved or system theme should be applied before the stylesheet loads',
  );

  assert.match(css, /html\[data-theme="dark"\]/i);
  assert.match(css, /color-scheme:\s*dark/i);
  assert.match(css, /\.theme-toggle/i);
  assert.match(css, /\.js\s+\.theme-toggle\s*{[^}]*display:\s*grid/i);
  assert.match(css, /\[data-theme="dark"\][^{]*\[data-theme-icon="moon"\]/i);
  assert.match(css, /\.button-primary[^}]+color:\s*var\(--color-on-accent\)/i);

  assert.match(js, /localStorage/i);
  assert.match(js, /portfolio-theme/i);
  assert.match(js, /prefers-color-scheme:\s*dark/i);
  assert.match(js, /aria-pressed/i);
  assert.match(js, /theme-color/i);
});

test('pre-paint initializer executes saved, system, invalid, and storage-error fallbacks', () => {
  const html = read('index.html');
  const inlineScript = html.match(/<script>\s*([\s\S]*?)<\/script>/i)?.[1];
  assert.ok(inlineScript, 'inline theme initializer should exist');

  const initialize = ({ savedTheme, prefersDark, storageThrows = false }) => {
    const themeColor = { content: '#f7f8fa' };
    const document = {
      documentElement: { dataset: {} },
      querySelector: () => themeColor,
    };
    const localStorage = {
      getItem: () => {
        if (storageThrows) throw new Error('storage unavailable');
        return savedTheme;
      },
    };
    const window = { matchMedia: () => ({ matches: prefersDark }) };

    runInNewContext(inlineScript, { document, localStorage, window });
    return { theme: document.documentElement.dataset.theme, themeColor: themeColor.content };
  };

  assert.deepEqual(initialize({ savedTheme: 'dark', prefersDark: false }), { theme: 'dark', themeColor: '#0c131b' });
  assert.deepEqual(initialize({ savedTheme: 'light', prefersDark: true }), { theme: 'light', themeColor: '#f7f8fa' });
  assert.deepEqual(initialize({ savedTheme: 'invalid', prefersDark: true }), { theme: 'dark', themeColor: '#0c131b' });
  assert.deepEqual(initialize({ savedTheme: null, prefersDark: false, storageThrows: true }), { theme: 'light', themeColor: '#f7f8fa' });
});

test('theme controller synchronizes state, follows system changes, and persists explicit choice', () => {
  const controller = read('script.js');
  const handlers = {};
  const stored = {};
  const label = { textContent: 'Dark mode' };
  const themeColor = { content: '#f7f8fa' };
  const toggle = {
    attributes: new Map([['aria-pressed', 'false']]),
    title: '',
    querySelector: () => label,
    setAttribute(name, value) { this.attributes.set(name, value); },
    addEventListener(type, handler) { handlers[`toggle:${type}`] = handler; },
  };
  const documentElement = { dataset: { theme: 'light' }, classList: { add() {} } };
  const document = {
    documentElement,
    querySelector(selector) {
      if (selector === '.theme-toggle') return toggle;
      if (selector === 'meta[name="theme-color"]') return themeColor;
      return null;
    },
    querySelectorAll: () => [],
  };
  const motionPreference = { matches: false };
  const colorPreference = {
    matches: false,
    addEventListener(type, handler) { handlers[`color:${type}`] = handler; },
  };
  const window = {
    matchMedia(query) {
      return query.includes('prefers-reduced-motion') ? motionPreference : colorPreference;
    },
  };
  const localStorage = {
    getItem: () => null,
    setItem(name, value) { stored[name] = value; },
  };

  runInNewContext(controller, { document, window, localStorage, Date });

  handlers['color:change']({ matches: true });
  assert.equal(documentElement.dataset.theme, 'dark');
  assert.equal(toggle.attributes.get('aria-pressed'), 'true');
  assert.equal(label.textContent, 'Dark mode');
  assert.equal(themeColor.content, '#0c131b');

  handlers['toggle:click']();
  assert.equal(documentElement.dataset.theme, 'light');
  assert.equal(toggle.attributes.get('aria-pressed'), 'false');
  assert.equal(toggle.title, 'Switch to dark mode');
  assert.equal(stored['portfolio-theme'], 'light');

  handlers['color:change']({ matches: true });
  assert.equal(documentElement.dataset.theme, 'light', 'system changes must not override an explicit choice');
});

test('dark primary action colors meet WCAG AA normal-text contrast', () => {
  const css = read('styles.css');
  const darkBlock = css.match(/html\[data-theme="dark"\]\s*{([\s\S]*?)\n}/i)?.[1] ?? '';
  const token = (name) => darkBlock.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
  const foreground = token('color-on-accent');
  const background = token('color-accent');
  const hoverBackground = token('color-accent-dark');
  assert.ok(foreground && background && hoverBackground, 'dark action color tokens should be defined');
  assert.match(css, /::selection\s*{[^}]*background:\s*var\(--color-accent\);[^}]*color:\s*var\(--color-on-accent\)/i);

  const luminance = (hex) => {
    const channels = hex.slice(1).match(/.{2}/g).map((channel) => Number.parseInt(channel, 16) / 255);
    const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const contrast = (first, second) => {
    const light = Math.max(luminance(first), luminance(second));
    const dark = Math.min(luminance(first), luminance(second));
    return (light + 0.05) / (dark + 0.05);
  };

  assert.ok(contrast(foreground, background) >= 4.5, 'default primary action and selection contrast should pass');
  assert.ok(contrast(foreground, hoverBackground) >= 4.5, 'hovered primary action contrast should pass');
});