import { IUnitParam } from "../interfaces/interface";
export default class LocalStore {
  private static instance: LocalStore;
  private constructor() {
    // private constructor
  }

  private playerMainMembers: IUnitParam[] = [];
  private playerSubMembers: IUnitParam[] = [];
  private stage: number = 0;

  public static getInstance(): LocalStore {
    if (!LocalStore.instance) {
      LocalStore.instance = new LocalStore();
    }

    return LocalStore.instance;
  }

  public setPlayerMembers(members: IUnitParam[]): void {
    this.playerMainMembers = members;
  }

  public getPlayerMembers(): IUnitParam[] {
    return this.playerMainMembers;
  }

  public addPlayerMember(member: IUnitParam): void {
    this.playerMainMembers.push(member);
  }

  public removePlayerMember(member: IUnitParam): void {
    this.playerMainMembers = this.playerMainMembers.filter((m) => m !== member);
  }

  public setPlayerSubMembers(members: IUnitParam[]): void {
    this.playerSubMembers = members;
  }

  public getPlayerSubMembers(): IUnitParam[] {
    return this.playerSubMembers;
  }

  public addPlayerSubMember(member: IUnitParam): void {
    this.playerSubMembers.push(member);
  }

  public removePlayerSubMember(member: IUnitParam): void {
    this.playerSubMembers = this.playerSubMembers.filter((m) => m !== member);
  }

  public getStage(): number {
    return this.stage;
  }

  public setStage(stage: number): void {
    this.stage = stage;
  }

  public incrementStage(): number {
    return ++this.stage;
  }
}
