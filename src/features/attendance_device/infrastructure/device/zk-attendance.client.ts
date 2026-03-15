import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Zkteco = require('zkteco-js');
import { AttendanceDevicePort } from '../../application/ports/attendance-device.port';
import { AttendanceLog } from '../../domain/entities/attendance-log.entity';
import { DeviceUser } from '../../domain/entities/device-user.entity';
import { BiometricConfigRepository } from '../persistence/repositories/biometric-config.repository';

@Injectable()
export class ZkAttendanceClient implements AttendanceDevicePort {
  private readonly logger = new Logger(ZkAttendanceClient.name);
  private client: any;
  private connected = false;

  private ip: string;
  private port: number;
  private timeout: number;
  private inport: number;

  constructor(
    private readonly config: ConfigService,
    private readonly biometricConfigRepo: BiometricConfigRepository,
  ) {
    this.ip = this.config.get<string>('zk.ip') ?? '127.0.0.1';
    this.port = this.config.get<number>('zk.port') ?? 4370;
    this.timeout = this.config.get<number>('zk.timeout') ?? 5000;
    this.inport = this.config.get<number>('zk.inport') ?? 5200;
    this.client = new Zkteco(this.ip, this.port, this.inport, this.timeout);
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    await this.loadConfig();
    await this.retry(async () => {
      await this.client.createSocket();
      this.connected = true;
      this.logger.log(`Conectado a ZKTeco ${this.ip}:${this.port}`);
    });
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return;
    try {
      await this.client.disconnect();
    } finally {
      this.connected = false;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.loadConfig();
      await this.client.createSocket();
      await this.client.disconnect();
      this.connected = false;
      return true;
    } catch (error) {
      this.connected = false;
      return false;
    }
  }

  async getUsers(): Promise<DeviceUser[]> {
    const response = (await this.safeFetch(() => this.client.getUsers())) as any;
    const users = response?.data ?? [];
    return users.map((user: any) => new DeviceUser(
      uuid(),
      String(user.userId ?? user.userid ?? ''),
      String(user.name ?? ''),
      user.role ?? null,
      user.cardno ? String(user.cardno) : null,
    ));
  }

  async getAttendanceLogs(): Promise<AttendanceLog[]> {
    const response = (await this.safeFetch(() => this.client.getAttendances())) as any;
    const logs = response?.data ?? [];
    return logs.map((log: any) => new AttendanceLog(
      uuid(),
      String(log.userId ?? log.userid ?? ''),
      new Date(log.attTime ?? log.timestamp ?? Date.now()),
      log.status ?? null,
      log.punch ?? null,
      this.ip,
    ));
  }

  private async safeFetch<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      this.logger.warn('Fallo comunicación con dispositivo, reintentando...');
      await this.reconnect();
      return await fn();
    }
  }

  private async reconnect(): Promise<void> {
    await this.disconnect();
    await this.loadConfig();
    await this.connect();
  }

  private async loadConfig(): Promise<void> {
    const dbConfig = await this.biometricConfigRepo.getActive();
    const next = {
      ip: dbConfig?.ip ?? this.config.get<string>('zk.ip') ?? '127.0.0.1',
      port: dbConfig?.port ?? this.config.get<number>('zk.port') ?? 4370,
      timeout: dbConfig?.timeout ?? this.config.get<number>('zk.timeout') ?? 5000,
      inport: dbConfig?.inport ?? this.config.get<number>('zk.inport') ?? 5200,
    };

    const changed =
      next.ip !== this.ip || next.port !== this.port || next.timeout !== this.timeout || next.inport !== this.inport;

    if (changed) {
      this.ip = next.ip;
      this.port = next.port;
      this.timeout = next.timeout;
      this.inport = next.inport;
      this.client = new Zkteco(this.ip, this.port, this.inport, this.timeout);
    }
  }

  private async retry(fn: () => Promise<void>, max = 3, delayMs = 1000) {
    let lastError: any;
    for (let i = 0; i < max; i++) {
      try {
        await fn();
        return;
      } catch (error) {
        lastError = error;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    throw lastError;
  }
}
