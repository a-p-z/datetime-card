export class DraggableEntity {
  friendly_name?: string;
  id: string = "";
  max: string = "";

  constructor(public key: number) {
    this.key = key;
    this.friendly_name = "";
  }
}
