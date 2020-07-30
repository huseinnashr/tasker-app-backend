import { deepCopy } from './helper';

export abstract class Factory<T, U = unknown> {
  protected abstract get(params: U): T;

  makeOne(params: U): T {
    const _params = deepCopy(params);
    return this.get(_params);
  }

  makeMany(many: number, params: U): T[] {
    const _params = deepCopy(params);
    const entities: T[] = [];
    for (let i = 0; i < many; i++) {
      entities.push(this.get(_params));
    }
    return entities;
  }
}
