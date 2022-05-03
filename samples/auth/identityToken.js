const mstr = require('../../lib/mstr.js');

(async () => {
  const baseUrl = 'http://10.23.3.162:8080/MicroStrategyLibrary/api';
  const mstrApi = new mstr.REST({
      baseUrl: baseUrl
  });

  const loginRequest = {
      username: 'Administrator',
      password: '',
      loginMode: 1
  };

  const sessionInfo = await mstrApi.login(loginRequest);
  console.log('logged in - session: ', sessionInfo);

  /*
  Simple sample demonstrating rountrip:
    - login to get auth token + cookie
    - generate identityToken using aut token + cookie
    - validate identityToken
    - restore identityToken to auth token
  */
  
  try {
      const idToken = await mstrApi.authentication.createIdentityToken();
      console.log('identityToken: ', idToken);

      //mstrApi.authentication.clearCookies();
      console.log('validated identityToken: ', await mstrApi.authentication.validateIdentityToken(idToken));

      // mstrApi.authentication.truncateStoredSession();
      console.log('restoredIdentityToken to auth token: ', await mstrApi.authentication.restoreIdentityToken(idToken));
  } catch (e) {
      console.error('Failed to create/validate/restore ID token due to error: ', e);
  }

  const logout = await mstrApi.logout();
  console.log(logout.status);


})();