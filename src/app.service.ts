import { Injectable } from '@nestjs/common';
import { FindOneEvent } from './app.event';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  handleHello(data: FindOneEvent) {
    console.log('handleHello - midtrans_service', data);

  }
}
