const mstr = require('../../lib/mstr.js');

(async ()=>{
  const baseUrl = 'http://10.23.3.162:8080/MicroStrategyLibrary/api';
  const mstrApi = new mstr.REST({
      baseUrl: baseUrl
  });

  await mstrApi.login({
    username: 'Administrator',
    password: '',
    loginMode: 1
  });
  // MicroStrategy Tutorial
  const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  mstrApi.setProjectId(projectId);

  const DatasetsAPI = mstrApi.datasets;

  try {
      //const objectId = '5F399A3DA18A4D378F25B2AFF6D48B0F';
      const objectId = 'F955A29B4DC3975298606E94AFA05D4D';
      const cubeDefinition = await DatasetsAPI.getDatasetDefinition(objectId);
      console.log('res: ', JSON.stringify(cubeDefinition, null, 2));

      console.log('EOF');
  } catch (e) {
      console.log(e);
  }

  await mstrApi.logout();

})();