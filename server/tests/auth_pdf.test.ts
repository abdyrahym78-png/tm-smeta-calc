import { generateToken, verifyToken } from '../src/middleware/auth';
import { PdfExporter } from '../src/services/pdfExporter';

describe('Sprint 4 Auth & PDF Tests', () => {
  it('should encode and decode valid JWT payload with role', () => {
    const token = generateToken({ userId: 'user_1', role: 'ADMIN' });
    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.role).toBe('ADMIN');
  });

  it('should render correct HTML structure for PDF export', () => {
    const estimate = { id: 'est_99', title: 'Тестовая смета', totalAmount: 1000, currency: 'TMT' };
    const html = PdfExporter.generateEstimateHtml(estimate);
    expect(html).toContain('ОФИЦИАЛЬНЫЙ СМЕТНЫЙ АКТ');
    expect(html).toContain('1000 TMT');
  });
});
