interface EyeDropperResult {
  sRGBHex: string;
}

interface EyeDropperApi {
  open(options?: { signal?: AbortSignal }): Promise<EyeDropperResult>;
}

declare global {
  interface Window {
    EyeDropper?: new () => EyeDropperApi;
  }
}

export const eyeDropperSupported = typeof window !== 'undefined' && typeof window.EyeDropper === 'function';

/**
 * Runs in the real top-level document (no sandboxed iframe), so the browser-native picker
 * behaves as intended. The AbortController timeout is a defensive backstop only — it guards
 * against the picker never resolving (e.g. a stray click outside the viewport) rather than
 * a known freeze, since there is no sandboxing here to trigger one.
 */
export async function pickColorFromScreen(): Promise<string | null> {
  if (!window.EyeDropper) return null;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    // Deferring .open() by one tick lets Chrome flush the click event that triggered this call
    // off the UI thread first — calling it synchronously from within that click handler is what
    // freezes the tab.
    const result = await new Promise<{ sRGBHex: string }>((resolve, reject) => {
      window.setTimeout(() => {
        new window.EyeDropper!().open({ signal: controller.signal }).then(resolve, reject);
      }, 50);
    });
    return result.sRGBHex;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}
