/**
 * Copies text to clipboard
 * @param text - Text to copy
 */
export function copyClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
