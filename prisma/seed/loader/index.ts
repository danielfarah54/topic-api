import { readFile, readdir } from 'fs/promises';

import { PrismaClient } from '@prisma/client';
import { partition } from 'lodash';

import { DataLoaderHandleGenericParams, NeedsFlag, SeedData } from './interfaces';
import { SeedLog } from './logger';

export class DataLoader {
  public readonly log = new SeedLog();
  private _remap: Record<string, any> = {};

  remapId(oldId: any, newId: any): void {
    this._remap[oldId] = newId;
  }

  getId(oldId: string): any {
    return oldId in this._remap ? this._remap[oldId] : oldId;
  }

  constructor(readonly prisma: PrismaClient, readonly flags: string[] = []) {}

  async readSeeds(): Promise<SeedData> {
    const path = `${__dirname}/../data`;
    let files = await readdir(path);
    files = files.filter((file) => file.endsWith('.json'));
    files.sort((a, b) => a.localeCompare(b));

    const seeds: SeedData[] = this.stripFlags(
      this.filterFlags(
        await Promise.all(files.map(async (name) => JSON.parse(await readFile(`${path}/${name}`, 'utf-8'))))
      )
    );

    return seeds.reduce((acc: any, seed: any) => {
      // both acc and seed are { [key: string]: any[] }
      // merge the arrays for each key together
      Object.entries(seed).forEach(([key, value]) => {
        if (key in acc) {
          acc[key] = acc[key].concat(value);
        } else {
          acc[key] = value;
        }
      });
      return acc;
    }, {});
  }

  async handleGeneric(data: Array<any>, params: DataLoaderHandleGenericParams): Promise<void> {
    data = this.stripFlags(this.filterFlags(data));
    this.remapObject(data);

    // partition data if it has a "#id" field
    const [withId, withoutId] = partition(data, (item) => item['#id'] !== undefined);

    // create all items without an "#id" field using createMany
    if (withoutId.length > 0) {
      if (params.createMany) {
        await params.createMany(withoutId);
      } else if (params.mode === 'serial') {
        for (const item of withoutId) {
          await params.create(item);
        }
      } else {
        await Promise.all(withoutId.map((item) => params.create(item)));
      }
    }

    if (withId.length > 0) {
      if (params.mode === 'serial') {
        for (const item of withId) {
          const newItem = { ...item };
          delete newItem['#id'];
          const id = await params.create(newItem);
          this.remapId(item['#id'], id);
        }
      } else {
        await Promise.all(
          withId.map(async (item) => {
            const newItem = { ...item };
            delete newItem['#id'];
            const id = await params.create(newItem);
            this.remapId(item['#id'], id);
          })
        );
      }
    }
  }

  private filterFlags<T extends NeedsFlag>(array: Array<T>): Array<T> {
    return array.filter((item) => {
      if (!item['#if'] || item['#if'].length === 0) {
        return true;
      }

      return Array.isArray(item['#if'])
        ? item['#if'].some((flag: string) => this.flags.includes(flag))
        : this.flags.includes(item['#if']);
    });
  }

  private stripFlags<T>(array: Array<T & NeedsFlag>): Array<T> {
    return array.map((item) => {
      const newItem = { ...item };
      delete newItem['#if'];
      return newItem;
    });
  }

  private remapObject(obj?: Record<string, any> | Array<any>): void {
    if (obj === null || obj === undefined || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      for (const item of obj) {
        this.remapObject(item);
      }
      return;
    }
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$')) {
        obj[key.slice(1)] = this.getId(obj[key]);
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        this.remapObject(obj[key]);
      }
    }
  }
}
