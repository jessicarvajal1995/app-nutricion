export class DailyDish {
    constructor(
      public id: string,
      public dailyRecordId: string,
      public dishId: string,
      public grams: number,
      public createdAt: Date,
      public updatedAt: Date
    ) {}
}
   