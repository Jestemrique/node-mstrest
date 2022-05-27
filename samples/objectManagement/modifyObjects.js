const mstr = require('../../lib/mstr.js');

(async () => {
    const baseUrl = 'http://10.23.3.162:8080/MicroStrategyLibrary/api';
    const mstrApi = new mstr.REST({
        baseUrl: baseUrl
    });

    await mstrApi.login({
        username: 'Administrator',
        password: '',
        loginMode: 1,
    });

    //MicroStrategy Tutorial
    const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
    mstrApi.setProjectId(projectId);

    const ObjectManagementAPI = mstrApi.objectManagement;

    const objectID = '70641736451AD090CE148AB314DE1B79';
    const type = 8; // Integer from EnumDSSXMLObjectTypes

    const copyObjectBody = {
        name: 'Copied from NPM package',
        folderId: 'B0923C34402DF0DFB685C7B398E0636A'
    };

    const updateObjectBody = {
        name: 'Updated from NPM Package'
    };

    try {
        const newObject = await ObjectManagementAPI.copyObject(objectID, type, copyObjectBody);
        const newObjectId = newObject.id;
        console.log('New Object ID: ', newObjectId);

        await ObjectManagementAPI.updateObject(newObjectId, type, updateObjectBody, 70);
        const objectInfo = await ObjectManagementAPI.getObject(newObjectId, type);

    } catch (e) {
        console.error(e);
    }

    await mstrApi.logout();

})();