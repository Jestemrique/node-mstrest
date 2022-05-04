const mstr = require('../../lib/mstr.js');
const convertStatusToString = require('./convertStatusToString');

(async () => {
  const baseUrl = 'http://10.23.3.162:8080/MicroStrategyLibrary/api';
  const mstrApi = new mstr.REST({
      baseUrl: baseUrl
  });

  await mstrApi.login({
      username: 'Administrator',
      password: '',
      loginMode: 1
  });

  //MicroStrategy Tutorial
  const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  mstrApi.setProjectId(projectId);

  const cubeID = 'F3A8DE7844B308E8A13F7A90AD4C6544';

  const CubesAPI = mstrApi.cubes;

  try{
    const cubeStatus = await CubesAPI.getStatus(cubeID);
    const states = convertStatusToString(cubeStatus);
    
    if (!states.ready){
      await CubesAPI.publishCube(cubeID);
    }
    

    //Begin test
    //if (states.ready){
    //  await CubesAPI.publishCube(cubeID);
    //}
    //End test

    const instanceResponse = await CubesAPI.createCubeInstance(cubeID);
    const instanceID = instanceResponse.instanceId;

    const cubeData = await CubesAPI.getInstanceResults(cubeID, instanceID);
    console.log(cubeData);
  } catch (e) {
    console.log(e);
  }

  await mstrApi.logout();
  

})();