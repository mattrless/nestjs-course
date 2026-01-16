import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(value: string): string {
    return `Hello World! Myvar is ${value}`;
  }
}
