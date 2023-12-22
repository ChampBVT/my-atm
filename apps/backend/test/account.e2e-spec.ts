import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ScreenCloudService } from 'src/common/external/screencloud/screencloud.service';
import { AppE2EUtil } from 'test/util/app-e2e.util';

describe('Account (E2E)', () => {
  let app: INestApplication;
  let screenCloudService: ScreenCloudService;

  beforeAll(async () => {
    app = await AppE2EUtil.getApp();

    screenCloudService = app.get<ScreenCloudService>(ScreenCloudService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Query InquiryAccount', () => {
    beforeEach(() => {
      jest.spyOn(screenCloudService, 'validatePin').mockResolvedValue(true);
    });

    const queryInquiryAccount = `
      query InquiryAccount($pin: String!) {
          viewer {
            inquiry {
              account(pin: $pin) {
                ... on Account {
                  balance
                }
                ... on UserError {
                  code
                  message
                }
              }
            }
          }
        }`;

    it('Return Account, given request is valid with correct pin', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: queryInquiryAccount,
          variables: { pin: '6666' },
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        viewer: {
          inquiry: {
            account: {
              balance: 400,
            },
          },
        },
      });
    });

    it('Return UserError, given request is valid but incorrect pin', async () => {
      jest.spyOn(screenCloudService, 'validatePin').mockResolvedValue(false);

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: queryInquiryAccount,
          variables: { pin: '8888' },
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        viewer: {
          inquiry: {
            account: {
              code: 'INVALID_PIN_ERROR',
              message: expect.any(String),
            },
          },
        },
      });
    });

    it('Throw BadRequestException, given invalid request', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: queryInquiryAccount,
          variables: { pin: 'bet8' },
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toMatchObject([
        {
          extensions: { code: 'BAD_REQUEST' },
        },
      ]);
    });
  });
});
