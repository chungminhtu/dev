import { Injectable } from '@nestjs/common';

// CORE
import { ConfigService } from '@core/config';

// SHARED

const config = new ConfigService();
const host = config.HOST;
const hostGateway = config.GATEWAY_HOST;

export function docPatternUrl(filePath?: string | null) {
  return /http/.test(filePath ?? '') ? filePath : (filePath && [host, 'document-pattern', filePath].join('/')) || null;
}

@Injectable()
export class UrlService {
  private _defaultFile = () => `https://source.unsplash.com/random/${512}x${Math.round(256 + 256 * Math.random())}`;

  mediaUrl(filePath?: string | null) {
    return /http/.test(filePath ?? '') ? filePath : (filePath && [host, 'media', filePath].join('/')) || null;
  }

  uploadUrl(filePath?: string | null) {
    return /http/.test(filePath ?? '') ? filePath : (filePath && [host, 'uploads', filePath].join('/')) || null;
  }

  staticUrl(filePath?: string | null) {
    return /http/.test(filePath ?? '') ? filePath : (filePath && [host, 'static', filePath].join('/')) || null;
  }

  memberAvatarUrl(filePath?: string | null) {
    return (filePath && [hostGateway, 'uploads', filePath].join('/')) || this._defaultFile();
  }
}
