export class NutritionalGoal {
    constructor(
      public id: string,
      public userId: string,
      public targetWeight: number,
      public proteinGoal: number,
      public carbsGoal: number,
      public fatGoal: number,
      public isActive: boolean,
      public createdAt: Date,
      public updatedAt: Date
    ) {}
}
   