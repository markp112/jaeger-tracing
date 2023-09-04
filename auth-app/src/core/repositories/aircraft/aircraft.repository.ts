import { logger } from '@logger/logger';
import { AppDataSource } from 'typeorm/dataSource/dataSource';
import { AircraftEntity } from 'typeorm/entities/aircraft';
import { trace } from '@opentelemetry/api';
import { Repository } from 'typeorm';

interface Aircraft {
  create(aircraft: AircraftEntity): Promise<void>;
  fetchOne(id: number): Promise<AircraftEntity | null>;
  fetchAll(): Promise<AircraftEntity[]>;
}

class AircraftRepository implements Aircraft {
  constructor(private repository: Repository<AircraftEntity>) {}

  async create(aircraft: AircraftEntity): Promise<void> {
    try {
      await this.repository
        .createQueryBuilder()
        .insert()
        .values(aircraft)
        .execute();
    } catch (err) {
      this.captureTraceError(<Error>err);
      logger.error(err);
      throw err;
    }
  }

  async fetchOne(id: number): Promise<AircraftEntity | null> {
    try {
      return await this.repository
        .createQueryBuilder('aircraft')
        .where('aircraft.id = :id', { id })
        .getOne();
    } catch (err) {
      this.captureTraceError(<Error>err);
      logger.error(err);
      throw err;
    }
  }

  async fetchAll(): Promise<AircraftEntity[]> {
    try {
      return await this.repository.createQueryBuilder('aircraft').getMany();
    } catch (err) {
      this.captureTraceError(<Error>err);
      logger.error(err);
      throw err;
    }
  }

  private captureTraceError(err: Error) {
    const span = trace.getActiveSpan();
    span?.recordException((err as Error).message);
    span?.setAttribute('http.status', 500);
  }
}

export { AircraftRepository };
