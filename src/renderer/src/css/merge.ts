export const GEN_START = '/* ╔════════════ AnvilCSS · GENERATED THEME ════════════╗ */';
export const GEN_END = '/* ╚═ AnvilCSS · end of generated block — code below this line always survives builder changes ═╝ */';

export function composeDoc(generated: string, customCss: string): string {
  const custom = customCss.trim();
  return `${generated.trimEnd()}\n\n${GEN_END}\n\n${custom}${custom ? '\n' : ''}`;
}

export interface SplitDoc {
  generatedRegion: string;
  customRegion: string;
  markerFound: boolean;
}

export function splitDoc(doc: string): SplitDoc {
  const idx = doc.indexOf(GEN_END);
  if (idx === -1) {
    // Marker deleted by hand: treat the whole document as generated-region override.
    return { generatedRegion: doc, customRegion: '', markerFound: false };
  }
  return {
    generatedRegion: doc.slice(0, idx).trimEnd(),
    customRegion: doc.slice(idx + GEN_END.length).replace(/^\s+/, ''),
    markerFound: true
  };
}

const IMPORT_RE = /@import\s+(?:url\()?['"]?[^'")\s]+['"]?\)?[^;]*;/g;

/** CSS requires @import before any rule — pull imports from anywhere to the top. */
export function hoistImports(css: string): string {
  const imports: string[] = [];
  const body = css.replace(IMPORT_RE, (m) => {
    if (!imports.includes(m)) imports.push(m);
    return '';
  });
  if (!imports.length) return css;
  return `${imports.join('\n')}\n\n${body.replace(/\n{3,}/g, '\n\n').trimStart()}`;
}

/** The CSS that is exported / fed to the preview: override wins over generated, custom always appended. */
export function effectiveCss(generated: string, editorOverride: string | null, customCss: string): string {
  const head = (editorOverride ?? generated).trimEnd();
  const custom = customCss.trim();
  const joined = custom ? `${head}\n\n/* ── Custom CSS ── */\n${custom}\n` : `${head}\n`;
  return hoistImports(joined);
}
