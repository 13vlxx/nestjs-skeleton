import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCkech() {
    return 'Hello World!';
  }
}
