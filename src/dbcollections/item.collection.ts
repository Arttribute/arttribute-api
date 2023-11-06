export const ItemCollection = `
@public 
collection Item{
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  author: string; 
  owner: User;
  source?: string;
  project?: Project;
  license:{
    name: string;
    reference: License[];
  };
  price?: {
    amount?:number;
    currency?: string;
  };
  needsRequest: boolean;
  created: string;
  updated: string;

  @index(id, title, author);

  constructor(id: string, title: string, description: string, url: string, tags: string[], author: string, owner: User, source?: string, project?:Project, licenseName: string, licenseReference: License[], priceAmount?: number, currency?: string, needsRequest: boolean, created: string, updated: string){
    this.id = id;
    this.title = title;
    this.description = description;
    this.url = url;
    this.tags = tags;
    this.author = author;
    this.owner = owner;
    this.source = source;
    this.project = project;
    this.license={
      name: licenseName,
      reference: licenseReference
    };
    this.price = {
      amount: priceAmount,
      currency: currency
    };
    this.needsRequest = needsRequest;
    this.created = created;
    this.updated = updated;
  }

  update(title: string, description: string, tags: string[], author: string, source: string, licenseName: string, licenseReference: License[], priceAmount?: number, currency?: string, needsRequest: boolean, updated: string){
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.author = author;
    this.source = source;
    this.license={
      name: licenseName,
      reference: licenseReference
    };
    this.needsRequest = needsRequest;
    this.price = {
      amount: priceAmount,
      currency: currency
    };
    this.updated = updated;
  }
  del(){
    selfdestruct();
  }
}
`;
