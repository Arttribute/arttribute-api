export const UserCollection = `
@public
collection User {
  // 'id' is unique and required on all collections
  id: string;
  publicKey: string;
  address: string;
  name: string;
  created: string;

  // 'constructor' is called when a new record is
  // created, make sure to assign a value to 'this.id'
  constructor (id: string, publicKey: string, address: string, name: string, created:string) {
    this.id = id;
    this.publicKey = publicKey;
    this.address = address;
    this.name = name;
    this.created = created;
  }
}
`;
