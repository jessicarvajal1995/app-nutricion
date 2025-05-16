export class User {
    constructor(
      public id: string,
      public name: string,
      public age: number,
      public height: number,
      public currentWeight: number,
      public createdAt: Date,
      public updatedAt: Date
    ) {}
}
   