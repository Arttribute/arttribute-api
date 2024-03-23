export const OAuthClientCollection = `
@public
collection AuthClient {
  id: string;
  project: Project;
  name: string;
  redirect: string;
  secretHash: string;
  created: string;
  
  constructor (id: string, project: Project, name: string, redirect: string, created: string) {
    this.id = id;
    this.project = project;
    this.name = name;
    this.redirect = redirect;
    this.created = created;
  }

  addSecretHash (secretHash: string) {
    this.secretHash = secretHash;
  }
}
`;
