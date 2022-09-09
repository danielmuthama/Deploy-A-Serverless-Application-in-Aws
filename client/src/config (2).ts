// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '4lh4rivpp9'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'talismanic.auth0.com',            // Auth0 domain
  clientId: 'pfW74jh7W0TW1VE2nJJ2ibpXH03kW9nu',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
