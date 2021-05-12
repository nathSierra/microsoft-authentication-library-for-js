// Helper function to call MS Graph API endpoint 
// using authorization bearer token scheme
function callMSGraph(endpoint, accessToken, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    console.log('request made to Graph API at: ' + new Date().toString());

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, endpoint))
        .catch(error => console.log(error));
}

async function seeProfile() {
    console.log("SeeProfile");
    const currentAcc = myMSALWidgetObj.getAccountByUsername(username);
    if (currentAcc) {
        const response = await getTokenPopup(loginRequest, currentAcc).catch(error => {
            console.log(error);
        });
        callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
        profileButton.style.display = 'none';
    }
}

async function readMail() {
    console.log("ReadEmail");
    const currentAcc = myMSALWidgetObj.getAccountByUsername(username);
    if (currentAcc) {
        const response = await getTokenPopup(tokenRequest, currentAcc).catch(error => {
            console.log(error);
        });
        callMSGraph(graphConfig.graphMailEndpoint, response.accessToken, updateUI);
        mailButton.style.display = 'none';
    }
}

async function seeProfileRedirect() {
    const currentAcc = myMSALWidgetObj.getAccountByUsername(username);
    if (currentAcc) {
        const response = await getTokenRedirect(loginRequest, currentAcc).catch(error => {
            console.log(error);
        });
        callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
        profileButton.style.display = 'none';
    }
}

async function readMailRedirect() {
    const currentAcc = myMSALWidgetObj.getAccountByUsername(username);
    if (currentAcc) {
        const response = await getTokenRedirect(tokenRequest, currentAcc).catch(error => {
            console.log(error);
        });
        callMSGraph(graphConfig.graphMailEndpoint, response.accessToken, updateUI);
        mailButton.style.display = 'none';
    }
}
