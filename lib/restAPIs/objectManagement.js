const assert = require('assert');

const RestUtil = require('../util/RestUtil');
const buildCommonQuery = require('../util/bildCommonQueryParams');

module.exports = class RestTopic extends RestUtil {
    _getBase(){
        return 'objects';
    }

    getObject(objectId, type, fields) {
        assert(objectId, 'No object Id provided');
        assert(type, 'No type provided');

        const queryParameter = buildCommonQuery(fields);
        queryParameter.type = type;

        return this._makeRequest(`${this._getBase}/${objectId}`, queryParameter, 'GET', this.getProjectHeader())
          .then(result => this.throwIfFailed(result, 200));
    }

    updateObject(objectId, type, objectsBody, flags, fields) {
        assert(objectId, 'No objectId provided');
        assert(type, 'No type provided');
        assert(objectsBody, 'No objects body provided');

        const queryParameter = buildCommonQuery(fields);
        queryParameter.type = type;
        if (flags) {
            queryParameter.flags = flags;
        }

        return this._makeRequest(`${this._getBase()}/${objectId}`, objectsBody, 'PUT', this.getProjectHeader(), queryParameter)
          .then(result => this.throwIfFailed(result, 200));
    }
}
