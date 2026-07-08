const dangerousTags = /<\/?(script|iframe|object|embed|form|input|button|textarea|select|option|meta|link|style)[^>]*>/gi;
const inlineEventHandlers = /\son[a-z]+\s*=\s*(['"]).*?\1/gi;
const javascriptUrls = /(href|src)\s*=\s*(['"])\s*javascript:.*?\2/gi;

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  return html
    .replace(dangerousTags, '')
    .replace(inlineEventHandlers, '')
    .replace(javascriptUrls, '$1="#"');
}
