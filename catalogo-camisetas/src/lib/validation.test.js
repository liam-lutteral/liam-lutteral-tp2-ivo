import { describe, it, expect } from 'vitest';
import { isValidImageUrl, escapeHtml, FALLBACK_IMAGE } from './validation.js';

describe('isValidImageUrl', () => {
  it('debe aceptar URLs con http://', () => {
    expect(isValidImageUrl('http://example.com/image.jpg')).toBe(true);
  });

  it('debe aceptar URLs con https://', () => {
    expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true);
  });

  it('debe retornar true si la URL está vacía (campo opcional)', () => {
    expect(isValidImageUrl('')).toBe(true);
  });

  it('debe retornar true si la URL es null o undefined', () => {
    expect(isValidImageUrl(null)).toBe(true);
    expect(isValidImageUrl(undefined)).toBe(true);
  });

  it('debe rechazar URLs sin protocolo', () => {
    expect(isValidImageUrl('ftp://example.com/image.jpg')).toBe(false);
  });

  it('debe rechazar texto sin formato de URL', () => {
    expect(isValidImageUrl('not-a-url')).toBe(false);
  });

  it('debe recortar espacios en blanco antes de validar', () => {
    expect(isValidImageUrl('  https://example.com/img.jpg  ')).toBe(true);
  });
});

describe('escapeHtml', () => {
  it('debe escapar & a &amp;', () => {
    expect(escapeHtml('AT&T')).toBe('AT&amp;T');
  });

  it('debe escapar < a &lt;', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('debe escapar > a &gt;', () => {
    expect(escapeHtml('10 > 5')).toBe('10 &gt; 5');
  });

  it('debe escapar " a &quot;', () => {
    expect(escapeHtml('Hola "mundo"')).toBe('Hola &quot;mundo&quot;');
  });

  it('debe escapar \' a &#039;', () => {
    expect(escapeHtml("It's a test")).toBe('It&#039;s a test');
  });

  it('debe retornar string vacío para null', () => {
    expect(escapeHtml(null)).toBe('');
  });

  it('debe retornar string vacío para undefined', () => {
    expect(escapeHtml(undefined)).toBe('');
  });

  it('debe preservar texto sin caracteres especiales', () => {
    expect(escapeHtml('Hola mundo')).toBe('Hola mundo');
  });
});

describe('FALLBACK_IMAGE', () => {
  it('debe ser la ruta del SVG de respaldo', () => {
    expect(FALLBACK_IMAGE).toBe('/camisetas/front-slim.svg');
  });
});
