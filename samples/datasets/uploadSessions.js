const mstr = require('../../lib/mstr.js');

// Simple util function that resolves a promise after a timerout in MS;
const promiseSleep = timeoutMS => {
    return new Promise(resolve => setTimeout(resolve, timeoutMS));
};

/*
  Upload Sesion Sample - Multi-Table Dataset

  This demonstration:
  - createes a multi-table dataset (cube) and saves it in the "Shared Reports" folder.
  - prepares an upload session for this dataset
  - adds some data to this dataset in 2 chunks
  - publishes the cube
  */

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

    // MicroStrategy Tutorial
    mstrApi.setProjectId('B19DEDCC11D4E0EFC000EB9495D0F44F');

    const DatasetsAPI = mstrApi.datasets;

    try {
        //shared reports folder
        const targetFolderID = 'D3C7D461F69C4610AA6BAA5EF51F4125';

        // Prepare tables for our new dataset
        const table1 = {
            name: 'EXAMPLE_TABLE_1',
            columnHeaders: [
              {
                name: 'PRODUCT_ID',
                dataType: 'STRING'
              },
              {
                name: 'SALES',
                dataType: 'DOUBLE'
              }
            ]
          };
          const table2 = {
            name: 'EXAMPLE_TABLE_2',
            columnHeaders: [
              {
                name: 'PRODUCT_ID',
                dataType: 'STRING'
              },
              {
                name: 'DOWNLOADS',
                dataType: 'DOUBLE'
              }
            ]
          };

          // metric definitions
    const metric1 = {
        name: 'Sales',
        expressions: [
          {
            tableName: 'EXAMPLE_TABLE_1',
            columnName: 'SALES',
          }
        ]
      };
      const metric2 = {
        name: 'Downloads',
        expressions: [
          {
            tableName: 'EXAMPLE_TABLE_2',
            columnName: 'DOWNLOADS',
          }
        ]
      };

      // attribute definitions
    const attribute1 = {
        name: "Product ID",
        attributeForms: [
          {
            category: 'ID',
            expressions: [
              { tableName: 'EXAMPLE_TABLE_1', columnName: 'PRODUCT_ID' },
              { tableName: 'EXAMPLE_TABLE_2', columnName: 'PRODUCT_ID' },
            ]
          }
        ]
      };

      const tables = [table1, table2];
      const metrics = [metric1, metric2];
      const attributes = [attribute1];

      //Schema of new dataset
      const newMultiTableDataset = {
        name: 'Cube created via node.js upload session',
        description: 'Example from node module',
        folderId: targetFolderID,
        tables: tables,
        metrics: metrics,
        attributes: attributes
      };

      console.log(`Creating cube with definition: `, JSON.stringify(newMultiTableDataset, null, 2));

      // Trigger API to create dataset
      const datasetCreationResult = await DatasetsAPI.createMultiTableDataset(newMultiTableDataset);
      console.log(`Multi-table dataset createdwith result: `, datsetCreationResult);

      const datasetId = datasetCreationResult.id;
      //const dataseName = datasetCreationResult.name;

      //Prepare upload session to add data ro our new datset:
      const targetTableName = 'EXAMPLE_TABLE_2';
      const tablesFormatting = {
        tables: [
            {
                name: targetTableName,
                updatePolicy: 'ADD',//[ ADD, UPDATE, UPSERT, REPLACE ]
                orientation: 'ROW', // or column
                columnHeaders: ['PRODUCT_ID', 'DOWNLOADS']
            }
        ]
      };

      const uploadSessionId = await DatasetsAPI.createUploadSession(datasetId, tablesFormatting);
      console.log(`Multi-table upload session ready with uploadSessionId: ${uploadSessionId}`);

      // Cube created, upload session ready, add some data in chunks, starting with first chungk
      let uploadChunkIndex = 1;

      


    }
  })();

