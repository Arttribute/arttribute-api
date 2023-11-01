export const CertificateCollection = `
@public
collection Certificate {
  id: string;
  name: string;
  image:string;
  owner: User;
  reference: {
    type: string;
    id: string;
    owner: string;
  };
  description: string;
  slug: string;
  created: string;
  minted: boolean;
  tokenDetails?:string;

  @index(owner);
  @index(slug);
  @index(reference.type, reference.id, owner);

  constructor (id: string, name:string, image:string, owner: User, referenceType: string, referenceId: string, referenceOwner: string,  description: string, slug: string, created: string, minted: boolean) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.owner = owner;
    this.reference = {
      type: referenceType,
      id: referenceId,
      owner: referenceOwner
    };
    this.description = description;
    this.slug =slug;
    this.created = created;
    this.minted = minted;
  }

  updateMintedStatus (minted: boolean, tokenDetails:string) {
    this.minted = minted;
    this.tokenDetails = tokenDetails;
  }

  del () {
    selfdestruct();
  }
  
}
`;

