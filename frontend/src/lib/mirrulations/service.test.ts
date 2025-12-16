import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to ensure variables are hoisted before imports/mocks
const { sendMock } = vi.hoisted(() => {
  return { sendMock: vi.fn() };
});

// Mock the module
vi.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: class {
      send = (...args: any[]) => sendMock(...args);
    },
    ListObjectsV2Command: class {},
  };
});

// Import the service (which uses the mock)
import { getAgencies, getDockets } from './service';

describe('Mirrulations Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAgencies', () => {
    it('returns a list of agencies correctly parsed', async () => {
      sendMock.mockResolvedValueOnce({
        CommonPrefixes: [
          { Prefix: 'raw-data/AGENCY1/' },
          { Prefix: 'raw-data/AGENCY2/' },
          // Edge case: malformed prefix should be handled if it results in empty string
          { Prefix: 'raw-data/' },
        ],
      });

      const agencies = await getAgencies();

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(agencies).toEqual(['AGENCY1', 'AGENCY2']);
    });

    it('handles empty response gracefully', async () => {
      sendMock.mockResolvedValueOnce({}); // No CommonPrefixes

      const agencies = await getAgencies();

      expect(agencies).toEqual([]);
    });

    it('handles errors gracefully', async () => {
      sendMock.mockRejectedValueOnce(new Error('S3 Error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const agencies = await getAgencies();

      expect(agencies).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching agencies:', expect.any(Error));
    });
  });

  describe('getDockets', () => {
    it('returns a list of dockets correctly parsed and sorted (descending)', async () => {
      sendMock.mockResolvedValueOnce({
        CommonPrefixes: [
          { Prefix: 'raw-data/AGENCY1/DOCKET-A/' },
          { Prefix: 'raw-data/AGENCY1/DOCKET-B/' },
        ],
      });

      const dockets = await getDockets('AGENCY1');

      // The service sorts and reverses the list
      // DOCKET-A, DOCKET-B -> sort -> DOCKET-A, DOCKET-B -> reverse -> DOCKET-B, DOCKET-A
      expect(dockets).toEqual(['DOCKET-B', 'DOCKET-A']);
    });

    it('handles empty response', async () => {
      sendMock.mockResolvedValueOnce({});

      const dockets = await getDockets('AGENCY1');

      expect(dockets).toEqual([]);
    });

    it('handles errors gracefully', async () => {
      sendMock.mockRejectedValueOnce(new Error('S3 Error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const dockets = await getDockets('AGENCY1');

      expect(dockets).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching dockets for AGENCY1:', expect.any(Error));
    });
  });
});
