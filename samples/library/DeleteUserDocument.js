const mstr = require('../../lib/mstr');

(async () => {
  const baseUrl = 'http://10.23.3.162:8080/MicroStrategyLibrary/api';
  const mstrApi = new mstr.REST({
    baseUrl: baseUrl,
  });

  await mstrApi.login({
    username: 'Administrator',
    password: '',
    loginMode: 1,
  });

  // MicroStrategy Tutorial
  const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  mstrApi.setProjectId(projectId);

  //Object ID
  const objectId = '104BF6354083AE6F56002F80F86B29E7';

  //User ID
  const userId = '54F3D26011D2896560009A8E67019608';

  const libraryAPI = mstrApi.library;

  try {
    console.log('Deleting object');
    const result = await libraryAPI.deleteUserObject(objectId, userId);
    console.log(`Deleted object with id ${objectId} from user ${userId}`);
  } catch (e) {
    console.error(e);
  }
})();