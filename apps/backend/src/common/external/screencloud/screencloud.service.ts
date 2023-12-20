import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ScreenCloudService {
  private readonly screenCloudBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.screenCloudBaseUrl = this.configService.getOrThrow(
      'SCREEN_CLOUD_BASE_API',
    );
  }

  async validatePin(pin: string): Promise<boolean> {
    const result = await firstValueFrom(
      this.httpService.post<{ currentBalance: number }>(
        new URL('/api/pin/', this.screenCloudBaseUrl).href,
        {
          pin,
        },
        { validateStatus: (statusCode) => statusCode < 500 },
      ),
    );

    if (result.status === 200 && !('error' in result.data)) {
      return true;
    }

    return false;
  }
}
