export const CollectionCertificate = `
@public 
collection Collection{
  id: string;
  title: string;
  featureImage:string;
  description: string;
  isPublic: boolean;
  tags: string[];
  items: Item[];
  owner: User;
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

  @index(owner);
  constructor(id: string, title: string, featureImage:string, description: string, isPublic: boolean, tags: string[], owner: User, project?: Project, licenseName: string, licenseReference: License[], priceAmount?: number, currency?: string, needsRequest: boolean, created: string, updated: string){
    this.id = id;
    this.title = title;
    this.featureImage = featureImage;
    this.description = description;
    this.isPublic = isPublic;
    this.tags = tags;
    this.items = [];
    this.owner = owner;
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

  changeVisibility(isPublic: boolean){
    this.isPublic = isPublic;
  }

  addItemToCollection(item: Item, newLicenses?: License[]){
    this.items.push(item);
    if (newLicenses) {
      this.license.reference.push(newLicenses);
    }
  }
  
  removeItemFromCollection(items: Item[], newLicenses: License[]){
    this.items = items;
    this.license.reference = newLicenses;
  }

  del(){
    selfdestruct();
  }
}
`;

