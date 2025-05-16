export class DailyRecord {
    constructor(
      public id: string,
      public userId: string,
      public date: Date,
      public createdAt: Date,
      public updatedAt: Date
    ) {}
}
   