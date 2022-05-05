const mstr = require('../../lib/mstr.js');

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
//datasetid: 7FC7181347DC74C7910048BF9E9B119A
//tableid: EFD9D9FC2D32462CB8BB75E52E699906



  // MicroStrategy Tutorial
  const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  mstrApi.setProjectId(projectId);

  const DatasetsAPI = mstrApi.datasets;

  try{
      // cube that was created via the REST API   A8188759CDCC4A33AF75C4C9F7A2EF45
      const targetDatasetId = 'F955A29B4DC3975298606E94AFA05D4D';
      const targetTableId = 'A8188759CDCC4A33AF75C4C9F7A2EF45';

      const replacementData = [
        {
          'ID': 'Example3',
          'SALES': 412312.222
        },
        {
          'ID': 'Example4',
          'SALES': 32321.123
        }
      ];

      const rawDataString = JSON.stringify(replacementData);
      const rawDataBase64 = Buffer.from(rawDataString).toString('base64');

      const datasetBody = {
        name: 'EXAMPLE_TABLE_1',
        columnHeaders: [
          {
            name: 'ID',
            dataType: 'STRING'
          },
          {
            name: 'SALES',
            dataType: 'DOUBLE'
          }
        ],
        data: rawDataBase64
      };

      console.log('Replacing datset with body; ', JSON.stringify(datasetBody, null, 2));

      const cubeDefinition = await DatasetsAPI.updateDataset(targetDatasetId, targetTableId, datasetBody, 'Replace');
      console.log('sucess: ', JSON.stringify(cubeDefinition, null, 2));

  } catch (e) {
      console.error(e);
  }

  await mstrApi.logout();

})();