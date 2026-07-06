const INJECT_TAGS =
  '<link rel="stylesheet" href="/anvil/anvil-injector.css">\n' +
  '<script src="/anvil/anvil-injector.js" defer></script>\n' +
  '<link rel="stylesheet" href="/anvil/anvil-theme.css">\n';

/** Insert the AnvilCSS script/stylesheet right before the closing </head> tag. */
export function injectHtml(html) {
  const idx = html.indexOf('</head>');
  if (idx === -1) return html + INJECT_TAGS;
  return html.slice(0, idx) + INJECT_TAGS + html.slice(idx);
}
