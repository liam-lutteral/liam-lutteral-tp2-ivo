import { describe, it, expect } from 'vitest';
import { tipoOptions, metadataFor, shirtAssets } from './camisetas.js';

describe('tipoOptions', () => {
  it('debe incluir "Todos" como primera opción', () => {
    expect(tipoOptions[0]).toBe('Todos');
  });

  it('debe incluir todas las opciones de tipo', () => {
    expect(tipoOptions).toEqual(['Todos', 'Titular', 'Suplente', 'Alternativa']);
  });
});

describe('metadataFor', () => {
  it('debe retornar assets de titular para tipo "Titular"', () => {
    const result = metadataFor({ tipo: 'Titular' });
    expect(result).toBe(shirtAssets.titular);
    expect(result.collar).toBe('Redondo');
    expect(result.sleeve).toBe('Mangas cortas');
  });

  it('debe retornar assets de suplente para tipo "Suplente"', () => {
    const result = metadataFor({ tipo: 'Suplente' });
    expect(result).toBe(shirtAssets.suplente);
    expect(result.collar).toBe('Cuello V');
  });

  it('debe retornar assets de alternativa para tipo "Alternativa"', () => {
    const result = metadataFor({ tipo: 'Alternativa' });
    expect(result).toBe(shirtAssets.alternativa);
    expect(result.colors).toHaveLength(3);
  });

  it('debe retornar default para tipo vacío', () => {
    const result = metadataFor({ tipo: '' });
    expect(result).toBe(shirtAssets.default);
  });

  it('debe retornar default para tipo undefined', () => {
    const result = metadataFor({});
    expect(result).toBe(shirtAssets.default);
  });

  it('debe ser case-insensitive', () => {
    const titular = metadataFor({ tipo: 'titular' });
    expect(titular).toBe(shirtAssets.titular);

    const suplente = metadataFor({ tipo: 'SUPLENTE' });
    expect(suplente).toBe(shirtAssets.suplente);
  });

  it('debe retornar default para tipo desconocido', () => {
    const result = metadataFor({ tipo: 'Invierno' });
    expect(result).toBe(shirtAssets.default);
  });
});

describe('shirtAssets', () => {
  it('cada tipo debe tener front y back', () => {
    Object.values(shirtAssets).forEach((asset) => {
      expect(asset.front).toBeDefined();
      expect(asset.back).toBeDefined();
      expect(asset.colors).toBeInstanceOf(Array);
      expect(asset.description).toBeDefined();
    });
  });

  it('todos los assets deben apuntar a archivos SVG en /camisetas/', () => {
    Object.values(shirtAssets).forEach((asset) => {
      expect(asset.front).toMatch(/^\/camisetas\/.+\.svg$/);
      expect(asset.back).toMatch(/^\/camisetas\/.+\.svg$/);
    });
  });
});
