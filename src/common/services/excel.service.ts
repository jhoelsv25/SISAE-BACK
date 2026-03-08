import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

export type ExcelColumn = { key: string; label: string };

export interface ExcelGenerateConfig {
  sheetName?: string;
  fileName?: string;
}

export interface ExcelParseResult {
  headers: string[];
  rows: Record<string, unknown>[];
}


@Injectable()
export class ExcelService {
  generate(
    columns: ExcelColumn[],
    data: Record<string, unknown>[],
    config: ExcelGenerateConfig = {},
  ): Buffer {
    const { sheetName = 'Datos' } = config;
    const headers = columns.map((c) => c.label);
    const keys = columns.map((c) => c.key);
    const rows = data.map((row) => keys.map((k) => row[k] ?? ''));
    const aoa = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return Buffer.from(buf);
  }
  generateTemplate(
    columns: ExcelColumn[],
    exampleRow?: Record<string, unknown>,
    config: ExcelGenerateConfig = {},
  ): Buffer {
    const { sheetName = 'Plantilla' } = config;
    const headers = columns.map((c) => c.label);
    const keys = columns.map((c) => c.key);
    const aoa = [headers];
    if (exampleRow) {
      aoa.push(keys.map((k) => String(exampleRow[k] ?? '')));
    }
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return Buffer.from(buf);
  }

  parse(buffer: Buffer): ExcelParseResult {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const firstSheet = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as unknown[][];

    if (raw.length < 2) {
      return { headers: [], rows: [] };
    }

    const headers = (raw[0] as unknown[]).map((h) => String(h ?? '').trim()).filter(Boolean);
    const rows: Record<string, unknown>[] = [];

    for (let i = 1; i < raw.length; i++) {
      const row = raw[i] as unknown[];
      const obj: Record<string, unknown> = {};
      headers.forEach((h, j) => {
        const val = row[j];
        obj[h] =
          typeof val === 'number' && Number.isFinite(val) ? val : val != null ? String(val).trim() : '';
      });
      if (Object.values(obj).some((v) => v !== '' && v != null)) {
        rows.push(obj);
      }
    }

    return { headers, rows };
  }
}
