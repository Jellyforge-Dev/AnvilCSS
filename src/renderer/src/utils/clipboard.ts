/**
 * navigator.clipboard.writeText throws in contexts where the Clipboard API is blocked
 * (insecure context, iframe without the clipboard-write permission policy, browser
 * setting). The execCommand('copy') fallback works there since it hangs off a real
 * user-triggered selection instead of the async permission-gated API.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
