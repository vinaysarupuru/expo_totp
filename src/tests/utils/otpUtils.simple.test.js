import { formatCode } from '../../utils/otpUtils';

describe('OTP Utilities - Simple Tests', () => {
  describe('formatCode', () => {
    it('should format a 6-digit code with a space in the middle', () => {
      expect(formatCode('123456')).toBe('123 456');
    });

    it('should handle empty strings', () => {
      expect(formatCode('')).toBe(' ');
    });

    it('should handle codes with less than 6 digits', () => {
      expect(formatCode('123')).toBe('123 ');
    });
  });
}); 