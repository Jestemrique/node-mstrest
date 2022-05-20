const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');
const buildCommonQuery = require('../util/buildCommonQueryParams');

module.exports = class RestTopic extends RestUtil {
    /**
     * Get base endpoint for this API category
     */
    _getBase() {
        return 'library';
    };

    /**
     * REturn object representing the library for the authenticated user.
     * @param {String} outputFlag - Filtered outpu. DEFAULT = include everything, FILTER_TOC = filter out chapters and pages.
     * @param {String} fields - Fields to be included inthe result
     * @returns {Object} Library for the authenticated user
     */
    getLibrary(outputFlag = 'DEFAULT', fields = '') {
        const queryParameter = buildCommonQuery(fields);
        queryParameter.outputFlag = outputFlag;

        return this._makeRequest(
            this._getBase(),
            queryParameter,
            'GET',
        ).then ( result => this.throwIfFailed(result, 200))
        .catch( e => this.throwExceptionResponse(e));

    };

    /**
     * Publish an object (document or dossier) in project defined by projectId.
     * Information about object to publish and recipient are detailed in object 'publishInfo'.
     * https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Library/publishObject
     * @param {Object} publishInfo - Information of the object to be published
     * @param {String} projectId - project ID
     */
    publishObject(publishInfo, projectId) {
        assert(publishInfo, 'No publishInfo provided');

        const customHeaders = this.getProjectHeader(projectId);
        return this._makeRequest(
            this._getBase(),
            publishInfo,
            'POST',
            customHeaders
        ).then( result => this.throwIfFailed(result, 204))
        .catch( e => this.throwExceptionResponse(e));
        
    }

    /**
     * Return object (document or dossier) identified by 'objectId' from project identified by 'projectId'
     * @param {String} projectId
     * @param {String} documentId
     * @param {String} fields - Fields to be included in the result. i.e. 'id,elements'
     * @returns {Object} - Representing the object
     */
    getObject(ObjectId, projectId, fields = '') {
        const queryParameter = buildCommonQuery(fields);
        const endpoint = `${this._getBase()}/${ObjectId}`;
        const customHeaders = this.getProjectHeader(projectId);
        return this._makeRequest(
            endpoint, 
            queryParameter,
            'GET',
            customHeaders
        ).then( result => this.throwIfFailed(result, 200))
        .catch( e => this.throwExceptionResponse(e));
    }

    /**
     * Delete an object (dossier or document) identified by 'objectId' from project identified by 'projectId'
     * @param {string} projectId
     * @param {string} objectId
     */
    deleteObject(objectId, projectId) {
        const endpoint = `${this}._getBase()}/${objectId}`;
        const queryParameter = buildCommonQuery();
        const customHeaders = this.getProjectHeader(projectId);

        return this._makeRequest(
            endpoint,
            queryParameter,
            'DELETE',
            customHeaders
        ).then( result => this.throwIfFailed(result, 204))
        .catch( e => this.throwExceptionResponse(e));
    };

    /**
     * Delete object (dossier or document) identified by 'objectId' from project identified by 'projectId' of user identified by 'userId'
     * @param {String} projectId
     * @param {String} objectId
     * @param {String} userId
     */
    deleteUserObject(objectId, userId, projectId) {
        assert(objectId, 'No objectId provide');
        assert(userId, 'No userId provided');
        const endpoint = `${this._getBase()}/${objectId}/recipients/${userId}`;
        const queryParameter = buildCommonQuery();
        const customHeaders = this.getProjectHeader(projectId);

        return this._makeRequest(
          endpoint,
          queryParameter,
          'DELETE',
          customHeaders
        ).then(result => this.throwIfFailed(result, 204));
    }

}