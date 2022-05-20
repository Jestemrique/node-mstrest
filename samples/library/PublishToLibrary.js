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

    //MicroStrategy Tutorial
    const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
    mstrApi.setProjectId(projectId);

    //Document to publish
    const documentId = '104BF6354083AE6F56002F80F86B29E7';

    //User the document is published to
    //Administrator
    const recipientId = '54F3D26011D2896560009A8E67019608';

    //Prose.
    //const recipientID = 'E96A7AC111D4BBCE10004694316DE8A4';

    const libraryAPI = mstrApi.library;

    try {
        const body = {
            id: documentId,
            recipients: [
                {
                    id: recipientId,
                },
            ],
            isInstance: false,
        };

        console.log('Publishing to Lbirary with body: ');
        const response = await libraryAPI.publishObject(body);
        console.log('Object published to Library');
    } catch (e) {
        console.log(e);
    }

    await mstrApi.logout();

})();