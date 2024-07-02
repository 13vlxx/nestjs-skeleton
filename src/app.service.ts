import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { version } from '../package.json';

@Injectable()
export class AppService {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  private mongodbStateToValue = (mongodbState: ConnectionStates) => {
    switch (mongodbState) {
      case 0:
        return 'Disconnected';
      case 1:
        return 'Connected';
      case 2:
        return 'Connecting';
      case 3:
        return 'Disconnecting';
      case 99:
        return 'Uninitialized';
    }
  };

  async healthCkech() {
    const mongodbState = this.mongodbStateToValue(
      await this.mongoConnection.readyState,
    );

    return {
      application: {
        status: 'UP',
        version,
      },
      dependencies: {
        mongodb: {
          status: mongodbState,
        },
      },
    };
  }
}
