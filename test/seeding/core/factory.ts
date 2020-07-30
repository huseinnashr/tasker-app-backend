export abstract class Factory<T, U = unknown> {
  protected abstract get(params: U): T;

  private _params: U;

  /** Dynamically set the factory params. */
  protected setParams(params: U): void {
    this._params = params;
  }

  makeOne(params: U): T {
    this.setParams(params);
    return this.get(this._params);
  }

  makeMany(many: number, params: U): T[] {
    const entities: T[] = [];
    this.setParams(params);
    for (let i = 0; i < many; i++) {
      entities.push(this.get(this._params));
    }
    return entities;
  }
}
