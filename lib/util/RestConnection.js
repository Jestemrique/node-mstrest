const axios = require('axios');
const qs = require('querystring');
const assert = require('assert');

module.exports = class RestConnection {
    constructor({
        baseUrl = 'https://demo.microstrategy.com/MicroStrategyLibrary/api',
        skipValidateResponseStatusCode = false,
        skipTrhowOnHTTPException = false
    }) {
        this._baseUrl;
        this.setBaseUrl(baseUrl);

        this.defaultHeaders = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
        };

        this.sessionHeaders = {};
        this.sessionCredentials;

        this.globalRequestOptions = {
            withCredentials: true,
            timeout: 1000 * 60 * 10 //10 minute timeout by default
        };

        //Flag to skip checking the HTTP response status code in any request
        this.skipValidateResponseStatusCode = !!skipValidateResponseStatusCode

        //Flag to treat HTTP exceptions as a resolved promise (instead of rejecting)
        this.skipTrhowOnHTTPException = !!skipTrhowOnHTTPException;
    };

    /**
     * @returns {Object} default headers required by almost every request
     */
    getDefaultHeaders() {
        return this.defaultHeaders;
    }

    /**
     * @public Get reequest options included with every requeste. See for detailed list of options: https://github.com/axios/axios#request-config
     * @returns {Object} with default options included with every axios request. Modify with care.
     */
    getRequestOptions() {
        return this.globalRequestOptions;
    }

    /**
     * @returns URL pointing to MicroStrategy Library REST API base
     */
    getBaseUrl() {
        return this._baseUrl;
    }

    /**
     * @param {String} newUrl - URL pointing to MicroStrategy Library REST API base
     */
    setBaseUrl(newUrl) {
        this._baseUrl = newUrl;
        // Ensure URL ends in backslash
        if (this.getBaseUrl().substr(-1) != '/') {
            this._baseUrl += '/';
        }
        return this;
    }

    /**
     * Get stored auth token from memory. Assumes token was preciously stored via atuh.login() or serSessionHeaders()
     * @returns {String} authToken
     */
    getAuthToken() {
        if (!this.sessionHeaders) {
            throw new Error(
                'No stored session headers - create session first via auth.login()'
            );
        }

        const token = this.sessionHeaders['X-MSTR-AuthToken'];
        if (!token) {
            throw new Error(
                'No stored auth token - create session first via auth.login()'
            );
        }

        return token;
    }

    /**
     * Store auth token in-memory for future executions. Other methods will automaticatlly try to use this token
     */
    setAuthToken(tokenValue) {
        this.sessionHeaders['X-MSTR-AuthToken'] = tokenValue;
        return this;
    }

    getSessionHeaders() {
        return this.sessionHeaders;
    }

    setSessionHeaders(sessionHeaders) {
        if (!sessionHeaders) {
            this.sessionHeaderss = {};
        } else {
            this.sessionHeaders = {
                ...sessionHeaders
            };
        }
        return this;
    }

    getSessionCredentials() {
        return this.sessionCredentials;
    }

    setSessionCredentials(requestParams = {}) {
        this.sessionCredentials = requestParams;
        return this;
    }

    getProjectId() {
        return this.projectID;
    }

    setProjectId(projectID) {
        this.projectID = projectID;
        return this;
    }

    /**
     * Get header used to dictate which project to use.
     * 
     * @param {String} projecId
     * @param {Object} [mergeHEaders={}] Optional, other headers to include in returned object.
     * @returns {Object} containing header to specify this project in a request
     */
    getProjectHeader(projectId = this.getProjectId(), mergeHeaders = {}) {
        if (typeof projectId == 'boolean' && !!projectId) {
            projectId = this.getProjectId();
        }

        assert(projectId, 'No projectId provided. Provide it as a function parameter or pre-set it universally using restApi.serProjectId');

        return {
            'X-MSTR-ProjectID': projectId,
            ...mergeHeaders,
        };
    }

    /**
     * Make HTTP request to MicroStrategy REST API
     * 
     * @param {String} endpoint - example: 'auth/login'
     * @param {Object} params - request parameters
     * @param {String} [method='GET'] - HTTP method (GET/POST/PUT/DELETE/etc)
     * @param {Object} customHeaders - optional: extra headers to merge into request
     * @param {Object} [additionalOptions={}] - Additional query parameters used in specific endpoints
     * @returns {promise} resolving with axios request response
     */
    _makeRequest(
        endpoint,
        params,
        method = 'GET',
        customHeaders,
        additionalOptions = {}
    ) {
        const fullUrl = this.getBaseUrl() + endpoint;

        switch (method.toUpperCase()) {
            case 'GET':
                return this.get(fullUrl, params, customHeaders);
            case 'HEAD':
                return this.get(fullUrl, params, customHeaders, true, 'HEAD');
            case 'POST':
                return this.post(fullUrl, params, additionalOptions, customHeaders)
            case 'PATCH':
                return this.post(
                    fullUrl,
                    params,
                    additionalOptions,
                    customHeaders,
                    'PATCH'
                );
            case 'DELETE':
                return this.post(
                    fullUrl,
                    params,
                    additionalOptions,
                    customHEaders,
                    'DELETE'
                );
            case 'PUT':
                return this.post(
                    fullUrl,
                    params,
                    additionalOptions,
                    customHeaders,
                    'PUT'
                );
        }
    }

    get(
        url,
        queryParams,
        customHeaders = {},
        mergeHeaders = true,
        requestMethod = 'GET'
    ) {
        const options = {
            method: requestMethod,
            headers: this._getHeaders(customHeaders, mergeHeaders),
            url: url,
            ...this.getRequestOptions()
        };

        if (queryParams) {
            options.url += '?' + qs.stringify(queryParams);
        }

        return axios(options);
    }

    post(
        url,
        requestBody,
        queryParams,
        customHeaders = {},
        requestMethod = 'POST',
        mergeHeaders = true
    ) {
        const options = {
            method: requestMethod,
            headers: this._getHeaders(customHeaders, mergeHeaders),
            data: requestBody,
            url: url,
            ...this.getRequestOptions()
        };

        if (queryParams) {
            options.url += '?' + qs.stringify(queryParams);
        }

        if (requestBody) {
            options.data = requestBody;
        }

        return axios(options);
    }

    /**
     * @private Merge headers and automatically append sessionHeaders if available
     * 
     * @param {Object} [cutomHeaders={}]
     * @param {boolean} mergeHeaders@returns {Object} contiaining desired headers merged into single object
     */
    _getHeaders(customHeaders = {}, mergeHeaders) {
        const defaultHeaders = this.getDefaultHeaders();
        const sessionHeaders = this.getSessionHeaders();
        if (mergeHeaders) {
            return {
                ...customHeaders,
                ...defaultHeaders,
                ...sessionHeaders,
            };
        }
        return Object.keys(customHeaders).length ? customHeaders : defaultHeaders;
    }
};