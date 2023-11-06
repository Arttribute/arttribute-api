export const PermissionRequestCollection = `
@public 
collection PermissionRequest{
  id: string;
  reference: {
    type: string;
    id: string;
  };
  sender: User;
  receiver: User;
  senderNote: string;
  receiverNote?: string;
  accepted: boolean;
  closed: boolean;
  created: string;
  updated: string;

  @index(sender);
  @index(receiver);
  @index(reference.type, reference.id, sender);

  constructor(id: string, referenceType: string, referenceId: string, sender: User, receiver: User, senderNote?: string, accepted: string, closed: string, created: string, updated: string){
    this.id = id;
    this.reference = {
      type: referenceType,
      id: referenceId
    };
    this.sender = sender;
    this.receiver = receiver;
    this.senderNote = senderNote;
    this.accepted = accepted;
    this.closed = closed;
    this.created = created;
    this.updated = updated;
  }
  
  updateRequestStatus( accepted: boolean, closed: boolean, updated:string, receiverNote?: string) {
    this.accepted = accepted;
    this.closed = closed;
    this.receiverNote = receiverNote;
    this.updated = updated;
  }

  del () {
    selfdestruct();
  }
}
`;
