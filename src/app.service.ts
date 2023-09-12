import { Injectable } from '@nestjs/common';
import { FindOneEvent } from './app.event';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config/dist';
import * as midtransClient from 'midtrans-client';
import { CreateTransaction } from './interface/midtrans.interface';

@Injectable()
export class AppService {
  serverKey: string = this.configService.get<string>('MIDTRANS_SERVER_KEY');
  isProduction: boolean = this.configService.get<string>('MIDTRANS_IS_PRODUCTION') === 'true';

  snap = new midtransClient.Snap({
    isProduction: this.isProduction,
    serverKey: this.serverKey,
  });

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  handleHello(data: FindOneEvent) {
    console.log('handleHello - midtrans_service', data)
    return {
      data: `your id is ${data.id}`
    }
  }

  async createTransaction(data: CreateTransaction) {
    console.log('createTransaction - midtrans_service', data)

    return await this.snap.createTransaction(data)
  }

  async getStatusTransaction(orderId: string) {
    const url = `https://api.sandbox.midtrans.com/v2/${orderId}/status`
    return await this.useApiAuth(url, 'GET')
  }

  private async useApiAuth(url: string, method: string) {
    const authKey = Buffer.from(`${this.serverKey}:`).toString('base64')
    const { data: response } = await firstValueFrom(
      this.httpService.request({
        url,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${authKey}`
        }
      }).pipe(
        catchError((error) => {
          throw new Error(error.message)
        })
      )
    )

    return response

  }
}
