import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to create the mocks so they can be referenced inside vi.mock
const mocks = vi.hoisted(() => {
  return {
    send: vi.fn(),
  };
});

// Mock the module
vi.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: class {
        send = mocks.send;
    },
    ListObjectsV2Command: class {
        constructor(public args: any) {}
    },
  };
});

// Import the service AFTER mocking
import { getAgencies, getDockets } from './service';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

describe('Mirrulations Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.send.mockReset();
  });

  describe('getAgencies', () => {
    it('should return a list of agencies when S3 returns prefixes', async () => {
      // Mock successful S3 response
      mocks.send.mockResolvedValue({
        CommonPrefixes: [
          { Prefix: 'raw-data/AGENCY1/' },
          { Prefix: 'raw-data/AGENCY2/' },
        ],
      });

      const agencies = await getAgencies();

      expect(agencies).toEqual(['AGENCY1', 'AGENCY2']);
      expect(mocks.send).toHaveBeenCalled();
    });

    it('should return an empty list when no prefixes are found', async () => {
        mocks.send.mockResolvedValue({});

        const agencies = await getAgencies();

        expect(agencies).toEqual([]);
      });

    it('should return an empty list when S3 throws an error', async () => {
      mocks.send.mockRejectedValue(new Error('S3 Error'));

      const agencies = await getAgencies();

      expect(agencies).toEqual([]);
    });
  });

  describe('getDockets', () => {
    it('should return a list of dockets for an agency', async () => {
      mocks.send.mockResolvedValue({
        CommonPrefixes: [
          { Prefix: 'raw-data/AGENCY1/DOCKET-2023-0001/' },
          { Prefix: 'raw-data/AGENCY1/DOCKET-2023-0002/' },
        ],
      });

      const dockets = await getDockets('AGENCY1');

      // The service sorts and reverses the list
      expect(dockets).toEqual(['DOCKET-2023-0002', 'DOCKET-2023-0001']);
    });

    it('should return an empty list when S3 throws an error', async () => {
      mocks.send.mockRejectedValue(new Error('S3 Error'));

      const dockets = await getDockets('AGENCY1');

      expect(dockets).toEqual([]);
    });
  });
});
