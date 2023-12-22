import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ScreenCloudService } from 'src/common/external/screencloud/screencloud.service';
import { AppE2EUtil } from 'test/util/app-e2e.util';

describe('Withdraw (E2E)', () => {
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

  describe('mutation Withdraw', () => {
    const mutationWithdraw = `
    mutation Withdraw($amount: Float!, $pin: String!) {
      withdraw(amount: $amount, pin: $pin) {
        ... on WithdrawSuccess {
          fiveNotes
          tenNotes
          twentyNotes
        }
        ... on UserError {
          code
          message
        }
      }
    }`;

    beforeEach(() => {
      jest.spyOn(screenCloudService, 'validatePin').mockResolvedValue(true);
    });

    it('Return WithdrawSuccess, given request is valid with correct pin', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutationWithdraw,
          variables: { pin: '6666', amount: 105 },
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        withdraw: {
          fiveNotes: 3,
          tenNotes: 3,
          twentyNotes: 3,
        },
      });
    });

    it('Return INVALID_PIN_ERROR, given request is valid but incorrect pin', async () => {
      jest.spyOn(screenCloudService, 'validatePin').mockResolvedValue(false);

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutationWithdraw,
          variables: { pin: '8888', amount: 105 },
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        withdraw: {
          code: 'INVALID_PIN_ERROR',
          message: expect.any(String),
        },
      });
    });

    it('Return OVERDRAWN_ERROR, given request is valid but overdrawn', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutationWithdraw,
          variables: { pin: '8888', amount: 505 },
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        withdraw: {
          code: 'OVERDRAWN_ERROR',
          message: expect.any(String),
        },
      });
    });

    it('Throw BadRequestException, given invalid request', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutationWithdraw,
          variables: { pin: 'bet8', amount: 1000 },
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
