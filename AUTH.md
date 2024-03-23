Universal Authentication:
Flow:

UI:
Sign in Modal:

Options:
Sign in With Arttribute
X - Sign in With Google
Sign in With Magic Link

-> OIDC <-
When Sign in With Arttribute is clicked, it will forward to the Arttribute
authentication page. This would be project based, for example,
the Arttribute Studio would have a project.
The redirect should have a callback url that will receive the
user information and thus an authenticated user. Google uses a state param
that can then be resolved by the server.

auth.arttribute.io/


UI:
User Page:
Connections:

Options:
Connect to Arttribute

-> OAuth2 <-
When Connect to Arttribute is clicked, it will also forward to an Arttribute
authoziration page. This would be project based, for example,
the Arttribute Studio would have a project.
When they are forwarded to the page, they would see a scopes page
showing the scopes that the project is requesting,
this can initially be optional.

The flow here needs more research since it will generate an access token
that will need to be stored in the project's host system/database rather than
a token on the host's website.