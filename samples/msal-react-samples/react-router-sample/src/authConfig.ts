import { LogLevel } from "@azure/msal-browser";
// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0; // Only needed if you need to support the redirect flow in Firefox incognito

// Config object to be passed to Msal on creation
export const msalConfig = {
    auth: {
        clientId: `${process.env.REACT_APP_MSAL_CLIENT_ID}`,
        authority: `https://${process.env.REACT_APP_MSAL_TENANT_NAME}.b2clogin.com/${process.env.REACT_APP_MSAL_TENANT_NAME}.onmicrosoft.com/${process.env.REACT_APP_MSAL_SIGNIN_POLICY}`,
        knownAuthorities: [
            `${process.env.REACT_APP_MSAL_TENANT_NAME}.b2clogin.com`
        ],
        postLogoutRedirectUri: `/`,
        redirectUri: `/`,
        navigateToLoginRequestUrl: false
    },
    cache: {
        storeAuthStateInCookie: isIE || isEdge || isFirefox
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: any, message: any, containsPii: any) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
};

export const MSAL_SCOPES = {
    MMG: `https://${process.env.REACT_APP_MSAL_TENANT_NAME}.onmicrosoft.com/${process.env.REACT_APP_MSAL_APP_ID_URI}/read`,
    OPENID: 'openid'
};

export const loginRequest = {
    scopes: [MSAL_SCOPES.MMG]
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
// export const loginRequest = {
//     scopes: ["User.Read"]
// };

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft-ppe.com/v1.0/me"
};
