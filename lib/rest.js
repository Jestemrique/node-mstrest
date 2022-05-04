const RestConnection = require('./util/RestConnection');

const AuthenticationAPI = require('./restAPIs/authentication');
const CubesAPI = require('./restAPIs/cubes');
//const DatasetsAPI = require('./restAPIs/datasets');
//const DossiersAndDocumentsAPI = require('./restAPIs/dossiersAndDocuments');
//const ObjectManagementAPI = require('./restAPIs/objectManagement');
//const ReportsAPI = require('./restAPIs/reports');
//const UserManagementAPI = require('./restAPIs/userManagement');
//const LibraryAPI = require('./restAPIs/library');

module.exports = class MicroStrategyRESTAPI extends RestConnection {
  constructor(...args){
    super(...args);

    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Authentication
    this.authentication = new AuthenticationAPI(this);

    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Cubes
    this.cubes = new CubesAPI(this);

    /*
    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Datasets
    this.datasets = new DatasetsAPI(this);

    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Dossiers%20and%20Documents
    this.dossiersAndDocuments = new DossiersAndDocumentsAPI(this);

    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Library
    this.library = new LibraryAPI(this);

    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Object%20Management
    this.objectManagement = new ObjectManagementAPI(this);

    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Reports
    this.reports = new ReportsAPI(this);

    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/User%20Management
    this.userManagement = new UserManagementAPI(this);
    */

    return this;

  }

  /**
   * Establish a new session with MicroStrategy Library
   * 
   * @param [Object] params
   * @param {boolean} [shouldStoreSession=true]
   * @param {boolean} [useStoredCredentials=false]
   * @return {Promise} resolving with session headers object
   */
  login(...params){
      return this.authentication.login(...params);
  }
  
  /**
   * Terminate a session with MicroStrategy Library - using the auth token as parameter
   * 
   * @param {Stting|Object} token string or object with key 'X-MSTR-AuthToken'
   * @return {Promise} response object
   */
  logout(...params) {
      return this.authentication.logout(...params);
  }

  clearCookies() {
      return this.authentication.clearCookies();
  }



}//End MicroStrategyRESTAPI