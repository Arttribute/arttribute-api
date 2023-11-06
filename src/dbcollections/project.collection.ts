export const ProjectCollection = `
@public
collection Project {
  id: string;
  owner:User;
  name: string;
  url?: string;
  created: string;
  updated: string;
  
  @index(id, owner);
  
  constructor (id: string, owner: User,name: string, url?: string,  created: string, updated: string) {
    this.id = id;
    this.owner = owner;
    this.name = name;
    this.url = url;
    this.created = created;
    this.updated = updated;
  }

  update (name: string, url?: string, updated: string) {
    this.name = name;
    this.url = url;
    this.updated = updated;
  }
}
`;
