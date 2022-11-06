export class Registro {
  public format: string;
  public content: string;
  public icon: string;
  public type: string;
  public textType: string;
  public created: Date;

  constructor(format: string, content: string) {
    this.format = format;
    this.content = content;
    this.created = new Date();
    this.determinarTipo();
  }

  private determinarTipo() {
    const inicioTexto = this.content.substr(0, 4);
    switch (inicioTexto) {
      case 'http':
        this.type = 'http';
        this.icon = 'link';
        this.textType = 'Website';
        break;
      case 'geo:':
        this.type = 'geo';
        this.icon = 'location';
        this.textType = 'Place';
        break;

      default:
        this.type = 'No config';
        this.icon = 'create';
    }
  }
}
