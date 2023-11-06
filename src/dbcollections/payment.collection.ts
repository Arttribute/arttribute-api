export const PaymentCollection = `
@public 
collection Payment{
  id: string;
  reference: {
    type: string;
    id: string;
  };
  transactionHash: string;
  sender: User;
  receiver: User;
  amount: number;
  currency: string;
  type: string;
  source?: string;
  project?: Project;
  network: Network;
  created: string;

  @index(sender);
  @index(receiver);
  @index(project);
  @index(reference.type, reference.id, sender);


  constructor(id: string, referenceType: string, referenceId: string, transactionHash:string, sender: User, receiver: User, amount:number, currency:string, type:string,  source?: string, project?: Project, network: Network, created: string){
    this.id = id;
    this.reference = {
      type: referenceType,
      id: referenceId
    };
    this.transactionHash = transactionHash;
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.currency = currency;
    this.type = type;
    this.source = source;
    this.project = project;
    this.network = network;
    this.created = created;
  }

  del () {
    selfdestruct();
  }
}
`;
