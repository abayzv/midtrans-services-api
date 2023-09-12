import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { FindOneEvent } from './app.event';
import { CreateTransaction } from './interface/midtrans.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('hello')
  handleHello(data: FindOneEvent) {
    return this.appService.handleHello(data);
  }

  @EventPattern('create_transaction')
  createTransaction(data: CreateTransaction) {
    return this.appService.createTransaction(data);
  }

  @EventPattern('get_status_transaction')
  getStatusTransaction(orderId: string) {
    return this.appService.getStatusTransaction(orderId);
  }
}
