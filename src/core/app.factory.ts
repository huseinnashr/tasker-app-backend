export abstract class AppFactory<T, U = unknown> {
  constructor(private template: Partial<U> = {}) {}

  protected abstract get(template: Partial<U>): T;

  makeOne(): T {
    return this.get(this.template);
  }

  makeMany(many: number): T[] {
    const entities: T[] = [];
    for (let i = 0; i < many; i++) {
      entities.push(this.get(this.template));
    }
    return entities;
  }
}
