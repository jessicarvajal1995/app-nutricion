export class Dish {
    constructor(
      public id: string,
      public name: string,
      public proteinPer100g: number,
      public carbsPer100g: number,
      public fatsPer100g: number,
      public createdAt: Date,
      public updatedAt: Date
    ) {}
}
   