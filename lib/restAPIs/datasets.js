const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');
const buildCommonQuery = require('../util/buildCommonQueryParams');

/*
  https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Datasets
*/
module.exports = class RestTopic extends RestUtil {
    /**
     * @private get base endpoint for this API category
     * @returns {String} endpoint prefix
     */
    _getBase() {
        return 'datasets';
    }

    /**
     * @private get base endpoint for UploadSessions functionality in this API category
     * @param {String} datasetId - dataset (cube) ID that this session is connecte to
     * @returns {String} endpoint prefix
     */
    _getUploadSessionBase(datasetId) {
        return this._getBase() + '/' + datasetId + '/uploadSessions';
    }

    /**
     * @public Get the definition of a specific MTDI dataset (single or multi-table).
     * 
     * @param {String} datasetId (cube ID)
     * @param {Array} fields (optional)
     * @returns {Object} representing dataset definition
     */
    getDatasetDefintion(datasetId, fields) {
        assert(datasetId, 'No datasetId provided');

        const queryParameter = buildCommonQuery(fields);
        return this._makeRequest(`${this._getBase()}/${datasetId}`, queryParameter, 'GET', this.getProjectHeader())
          .then(result => this.throwIfFailed(result, 200));
    }

    /**
     * @public Create a structured single-table dataset. For complex or multi-table datasets, use UploadSessions. See createUploadSession()
     * @param {Object} [newDataSetBody={}] - Dataset creation info - see REST API documentation
     * @param {Array} fields (optional)
     * @returns {Object} { DATASETID, NAME, TABLES[]}
     */
    createDataset(newDatasetBody = {}, fields) {
        assertParam(newDatasetBody);
        assertParam(newDatasetBody, 'name');
        assertParam(newDatasetBody, 'tables');

        const queryParameter = buildCommonQuery(fields);
        return this._makeRequest(this._getBase(), newDatsetBody, 'POST', this.getProjectHeader(), queryParameter)
          .then(result => this.throwIfFailed(result, 200));
    }

    /**
     * @public Create the definition of a dataset containing one or more tables, for use with an UploadSession.
     * 
     * @param {OBject} [newDatasetBody={}]
     * @param {Array} fields (optional)
     */
    createMultiTableDataset(newDatasetBody = {}, fields) {
        assertParam(newDatasetBody);
        assertParam(newDatasetBody, 'name');
        assertParam(newDatasetBody, 'tables');

        const queryParameter = buildCommonQuery(fields);
        return this._makeRequest(`${this._getBase()}/models`, newDatasetBody, 'POST', this.getProjectHeader())
          .then( result => this.throwIfFailed(result, 200))
          .catch(e => this.throwExceptionResponse(e));
    }

    /**
     * @public Update data in a single-table dataset created via this API
     * 
     * @param {String} datasetId (cube ID)
     * @param {String} tableId - table ID or name
     * @param {Object} datasetBody - Dataset update info - see REST API documentation
     * @param {String} [updatePolicy='Replace'] - Update operation type: Add, Update, Upsert, Replace
     * @param {Array} fields (optional)
     * @returns {Promise} resolving on success
     */
    updateDataset(datasetId, tableId, datasetBody, updatePolocy = 'Replace', fields) {
        assert(datasetId, 'No datasetId provided');
        assert(tableId, 'No tableId provided');
        assertParam(datasetBody);
        assertParam(datasetBody, 'name');
        assertParam(datasetBody, 'data');

        const projectHeaders = this.getProjectHeader();
        const headers = {
            updatePolicy: updatePolicy,
            ...projectHeaders
        };

        const queryParameter = buildCommonQuery(fields);
        return this._makeRequest(this._getBase() + `/${datasetId}/tables/${tableId}`, datasetBody, 'PATCH', headers, queryParameter)
          .then(result => this.throwIfFailed(result, 200));
    }

    /**
     * @public Create a multi-table datset upload session and provide formatting information for the data that is to be uploaded to the Intelligence Server
     * 
     * @param {String} datasetId - ID of the existing dataset. If not exising yet, use DatasetAPI.createDataset()
     * @param {Object} tablesFormatting - object representation of table formatting, with update policy for this upload session
     * @returns {String} uploadSessionID
     */
    createUploadSession(datasetId, tablesFormatting) {
        assert(datasetId, 'No datsetId provided');
        assert(tablesFormatting, 'No tables formatting provided');

        return this._makeRequest(this._getUploadSessionsBase(datasetId), tablesFormatting, 'POST', this.getProjectHeader())
          .then(result => this.throwIfFailed(result, 200))
          .then(result => result.uploadSessionId || result)
          .catch(e => this.throwExeceptionResponse(e));
    }

    /**
     * @public Push dta into upload session.
     * @param {String} datasetId
     * @param {String} uploadSessionId
     * @param {String} tableName - name of this table that this data manipulation is intended for
     * @param {String|Number} index - slice index (starts at 1, increase with each consequent request for multiple data batches)
     * @param {Object|String} data - data to ADD/UPDATE/UPSERT/REPLACE in this action
     * @param {Boolean} [encodeAutomatically =true] - (optional) - if true, data will be converted from JSON to base64 encoding automatically
     */
    uploadDataToUploadSession(datsetId, uploadSessionId, tableName, index = 1, rawData, encodeAutomatically = true) {
        assert(datasetId, 'No datasetId provided');
        assert(uploadSessionId, 'No uploadSessionId provided');

        assert(tableName, 'No tableName provided');
        assert(index, 'No index provided');
        assert(rawData, 'No rawData provided');

        const uploadSessionBasePath = this._getUploadSessionBase(datasetId);
        const endpoint = `${uploadSessionBasePath}/${uploadSessionID}`;

        const dataAsString = typeof rawData == 'string' ? rawData : JSON.stringify(rawData);
        const base64EncodedData = !encodeAutomatically ? rawData : Buffer.from(dataAsString).toString('base64');
        const requestBody = {tableName, index, data: base64EncodedData}

        return this._makeRequest(endpoint, requestBody, 'PUT', this.getProjectHeader())
          .then(result => this.throwIfFailed(result, 200))
          .catch(e => this.throwExeceptionResponse(e));
    }

    /**
     * @public Delete a specific multi-table datset upload session and cancel publication
     * If upload session has not been plublished, all datset operations for upload session will be cancelled and the uploaded data will be discarded.
     * 
     * @param {String} datasetId
     * @param {String} uploadSessionId
     */
    deleteUploadSession(datasetId, uploadSesionId) {
        assert(datasetId, 'No datasetId provided');
        assert(uploadSessionId, 'No uploadSessionId provided');

        const uploadSessionBasePath = this._getUploadSessionBase(dataSetId);
        const endpoint = `${uploadSessionBasePath}/${uploadSessionId}`;

        return this._makeRequest(endpoint, false, 'DELETE', this.getProjectHeader())
          .then(result => this.throwIfFailed(result, 200))
          .catch(e => this.throwExceptionResponse(e));
    }

    /**
     * @public Publish a specific multi-table dataset using data uploaded to the Intelligence Server.
     * Use after adding data to existing upload session.
     * 
     * @param {String} datasetId
     * @param {String} uploadSessionID
     * @returns {Promise} - throws on failure, resolves on success. Use getUploadSessionStatus() to poll publish status.
     */
    publishUploadSessionDataset(datasetId, uploadSessionId) {
        assert(datasetId, 'No datasetId provided');
        assert(uploadSessionId, 'No uploadSessionId provided');
        const uploadSessionBasePath = this._getUploadSessionBase(datsetId);
        const endpoint = `${uploadSessionBasePath}/${uploadSessionId}/publish`;

        return this._makeRequest(endpoint, false, 'POST', this.getProjectHeader())
          .then(result => this.throwIfFailed(result, 200))
          .catch(e => this.throwExceptionResponse(e));
    }

    /**
     * @public Get status of multi-table dataset operation, after uploading and publishing. Use adter publishiUploadSession().
     * 
     * @param {String} datasetId
     * @param {String} uploadSessionID
     * @returns {Object} - { status, message}
     */
    getUploadSessionsStatus(datsetId, uploadSessionId) {
      assert(datsetId, 'No datasetId provided');
      assert(uploadSessionId, 'No uploadSessionId provided');
      const uploadSessionBasePath = this._getUploadSessionBase(dataSetId);
      const endptoin = `${uploadSessionBasePath}/${uploadSessionId}/publishStatus`;

      return this._makeRequest(endpoint, false, 'GET', this.getProjectHeader())
        .then(result => this.throwIfFailed(result, 200))
        .catch(e => this.throwExceptionResponse(e));
    }


    
}