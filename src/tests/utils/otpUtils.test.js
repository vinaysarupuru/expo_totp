import { generateTOTPCode, generateHOTPCode, formatCode } from '../../utils/otpUtils';

describe('OTP Utilities', () => {
  describe('formatCode', () => {
    it('should format a 6-digit code with a space in the middle', () => {
      expect(formatCode('123456')).toBe('123 456');
    });

    it('should handle empty strings', () => {
      expect(formatCode('')).toBe('');
    });

    it('should handle codes with less than 6 digits', () => {
      expect(formatCode('123')).toBe('123');
    });
  });

  describe('generateTOTPCode', () => {
    it('should generate a 6-digit code from a secret key', () => {
      const secretKey = 'JBSWY3DPEHPK3PXP';
      const code = generateTOTPCode(secretKey);
      
      expect(code).toMatch(/^\d{6}$/);
    });
  });

  describe('generateHOTPCode', () => {
    it('should generate a 6-digit code from a secret key and counter', () => {
      const secretKey = 'JBSWY3DPEHPK3PXP';
      const counter = 1;
      const code = generateHOTPCode(secretKey, counter);
      
      expect(code).toMatch(/^\d{6}$/);
    });

    it('should generate different codes for different counters', () => {
      const secretKey = 'JBSWY3DPEHPK3PXP';
      const code1 = generateHOTPCode(secretKey, 1);
      const code2 = generateHOTPCode(secretKey, 2);
      
      expect(code1).not.toBe(code2);
    });
  });
}); 