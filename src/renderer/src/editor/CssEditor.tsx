import { useEffect, useMemo, useRef, useState } from 'react';
import CodeMirror, { ExternalChange, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { css as cssLang } from '@codemirror/lang-css';
import { EditorView } from '@codemirror/view';
import { useThemeStore } from '../state/themeStore';
import { useUiStore } from '../state/uiStore';
import { useI18n } from '../i18n';
import { generateCss } from '../css/generator';
import { composeDoc, splitDoc } from '../css/merge';
import { copyTextToClipboard } from '../utils/clipboard';

const editorTheme = EditorView.theme(
  {
    '&': { backgroundColor: '#0b0910', fontSize: '12.5px', height: '100%' },
    '.cm-content': {
      fontFamily: "'JetBrains Mono', Consolas, monospace",
      caretColor: '#ff8c26',
      color: '#e9e7f2'
    },
    '.cm-gutters': { backgroundColor: '#0b0910', color: '#4d4661', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'rgba(255,140,38,0.05)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#ff8c26' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: 'rgba(167,139,250,0.22) !important'
    },
    '.cm-cursor': { borderLeftColor: '#ff8c26' }
  },
  { dark: true }
);

export function CssEditor() {
  const { t } = useI18n();
  const pushToast = useUiStore((s) => s.pushToast);
  const theme = useThemeStore((s) => s.theme);
  const editorOverride = useThemeStore((s) => s.editorOverride);
  const setCustomCss = useThemeStore((s) => s.setCustomCss);
  const setEditorOverride = useThemeStore((s) => s.setEditorOverride);

  const generated = useMemo(() => generateCss(theme), [theme]);
  const composed = useMemo(
    () => composeDoc(editorOverride ?? generated, theme.customCss),
    [generated, editorOverride, theme.customCss]
  );

  const [doc, setDoc] = useState(composed);
  const lastSynced = useRef(composed);
  const debounceRef = useRef<number>();
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  // Push a doc into both React state and the live CodeMirror view directly. The library's own
  // controlled `value` sync can get stuck deferring to a "user is still typing" latch that never
  // resolves once a debounced write lands after it — dispatching straight to the view sidesteps that.
  const applyDoc = (next: string) => {
    lastSynced.current = next;
    setDoc(next);
    const view = editorRef.current?.view;
    if (view && view.state.doc.toString() !== next) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: next },
        annotations: [ExternalChange.of(true)]
      });
    }
  };

  // Builder / catalog changes push a fresh composition into the editor.
  useEffect(() => {
    if (composed !== lastSynced.current) {
      applyDoc(composed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composed]);

  const onChange = (value: string) => {
    setDoc(value);
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const { generatedRegion, customRegion } = splitDoc(value);
      // Deleting the whole generated region isn't a real override — treat it as "regenerate".
      const wipedGenerated = generatedRegion.trim() === '';
      const override = !wipedGenerated && generatedRegion.trimEnd() !== generated.trimEnd() ? generatedRegion : null;
      const nextDoc = composeDoc(override ?? generated, customRegion);
      setEditorOverride(override);
      setCustomCss(customRegion.replace(/\s+$/, ''));
      if (wipedGenerated) {
        // Nothing coherent survives a full wipe — snap the visible editor back to the live CSS.
        applyDoc(nextDoc);
      } else {
        // Remember what this edit composes to, so the builder-sync effect doesn't yank the cursor.
        lastSynced.current = nextDoc;
      }
    }, 280);
  };

  const regenerate = () => {
    setEditorOverride(null);
  };

  const copyDoc = async () => {
    const ok = await copyTextToClipboard(doc);
    if (ok) {
      pushToast(t('export.copied'), 'success');
    } else {
      pushToast(t('export.copyFailed'), 'error');
    }
  };

  return (
    <div className="editor-pane">
      <div className="editor-head">
        <span className="editor-title">{t('editor.title')}</span>
        <div className="editor-head-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {editorOverride !== null ? (
            <span className="editor-chip editor-chip-override" title={t('editor.overrideHint')}>
              {t('editor.overrideActive')}
              <button type="button" className="editor-chip-btn" onClick={regenerate}>
                {t('editor.regenerate')}
              </button>
            </span>
          ) : (
            <span className="editor-chip">{t('editor.live')}</span>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={copyDoc}>
            {t('export.copy')}
          </button>
        </div>
      </div>
      <div className="editor-scroll">
        <CodeMirror
          ref={editorRef}
          value={doc}
          onChange={onChange}
          theme="dark"
          extensions={[cssLang(), editorTheme, EditorView.lineWrapping]}
          basicSetup={{ foldGutter: true, highlightActiveLine: true }}
        />
      </div>
      <p className="editor-foot">{t('editor.markerHint')}</p>
    </div>
  );
}
