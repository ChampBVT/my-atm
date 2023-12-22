import { Test } from '@nestjs/testing';
import { mocker } from 'src/common/test/mocker';
import { ScreenCloudService } from 'src/common/external/screencloud/screencloud.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';

describe(ScreenCloudService.name, () => {
  const screenCloudBaseUrl = 'http://link.com';

  let screenCloudService: ScreenCloudService;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ScreenCloudService],
    })
      .useMocker(mocker)
      .compile();

    screenCloudService = moduleRef.get<ScreenCloudService>(ScreenCloudService);
    httpService = moduleRef.get<HttpService>(HttpService);

    Reflect.set(screenCloudService, 'screenCloudBaseUrl', screenCloudBaseUrl);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe(ScreenCloudService.prototype.validatePin.name, () => {
    it('Return true, given pin is valid', async () => {
      const mockApiResponse: AxiosResponse = {
        status: 200,
        statusText: 'Ok',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: {
          currentBalance: 300,
        },
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(mockApiResponse));

      const result = await screenCloudService.validatePin('1234');

      expect(result).toBe(true);
      expect(httpService.post).toHaveBeenCalledWith(
        'http://link.com/api/pin/',
        { pin: '1234' },
        { validateStatus: expect.any(Function) },
      );
    });

    it('Return false, given pin is invalid', async () => {
      const mockApiResponse: AxiosResponse = {
        status: 403,
        statusText: 'Forbidden',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: {
          error: 'Incorrect or missing PIN.',
        },
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(mockApiResponse));

      const result = await screenCloudService.validatePin('8888');

      expect(result).toBe(false);
      expect(httpService.post).toHaveBeenCalledWith(
        'http://link.com/api/pin/',
        { pin: '8888' },
        { validateStatus: expect.any(Function) },
      );
    });
  });
});
