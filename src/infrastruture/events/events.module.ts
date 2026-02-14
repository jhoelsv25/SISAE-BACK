import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true, // habilita eventos con nombres jerárquicos
      delimiter: '.', // separador para los nombres jerárquicos
      maxListeners: 10, // número máximo de listeners por evento
      verboseMemoryLeak: true, // habilita mensajes detallados sobre fugas de memoria
    }),
  ],
})
export class EventsModule {}
