const CLIENT_ID = '494975398068-vi9qiiitoloa4khsbtarhtkteu18cibl.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDt7M_cXwy-axpxYxioKUlr-5pcayA5KiY';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

let auth2;

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: SCOPES.join(' ')
    }).then(() => {
        auth2 = gapi.auth2.getAuthInstance();
        auth2.isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(auth2.isSignedIn.get());
        document.getElementById('authorize-button').onclick = handleAuthClick;
        document.getElementById('transfer-button').onclick = transferOwnership;
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('authorize-button').style.display = 'none';
        document.getElementById('transfer-button').style.display = 'inline';
    } else {
        document.getElementById('authorize-button').style.display = 'inline';
        document.getElementById('transfer-button').style.display = 'none';
    }
}

function handleAuthClick() {
    auth2.signIn();
}

function transferOwnership() {
    const fileId = document.getElementById('file-id').value;
    const newOwnerEmail = document.getElementById('new-owner-email').value;

    gapi.client.drive.permissions.create({
        'fileId': fileId,
        'resource': {
            'type': 'user',
            'role': 'owner',
            'emailAddress': newOwnerEmail
        }
    }).then(response => {
        console.log('Ownership transferred:', response);
        alert('Ownership transferred successfully!');
    }).catch(error => {
        console.error('Error transferring ownership:', error);
        alert('Error transferring ownership.');
    });
}

document.addEventListener('DOMContentLoaded', handleClientLoad);
