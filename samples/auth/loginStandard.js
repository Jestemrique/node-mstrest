const mstr = require('../../lib/mstr.js');

(async () => {
  const baseUrl = 'http://10.23.3.162:8080/MicroStrategyLibrary/api';
  const mstrApi = new mstr.REST({
    baseUrl: baseUrl
  });

  const loginRequest = {
      username: 'admin',
      password: 'admin',
      loginMode: 1
  };

  const sessionInfo = await mstrApi.login(loginRequest);
  console.log('session', sessionInfo);

  //204 success
  const logout = await mstrApi.logout();
  console.log(logout.status);

})();