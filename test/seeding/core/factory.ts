export abstract class Factory<T, U = unknown> {
  protected abstract get(params: U): T;

  makeOne(params: U): T {
    return this.get(params);
  }

  makeMany(many: number, params: U): T[] {
    const entities: T[] = [];
    for (let i = 0; i < many; i++) {
      entities.push(this.get(params));
    }
    return entities;
  }
}
