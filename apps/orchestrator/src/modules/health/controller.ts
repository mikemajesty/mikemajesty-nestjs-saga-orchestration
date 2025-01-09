import { Body, Controller, Get, Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class Service {
  @MessagePattern("notify-ending")
  getHello(@Payload() message: any): string {
    console.log("messagemessagemessagemessagemessage", message);
    return 'orchestrator UP!';
  }
}
