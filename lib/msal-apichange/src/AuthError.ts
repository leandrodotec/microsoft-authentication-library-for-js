/**
  * Copyright (c) Microsoft Corporation
  *  All Rights Reserved
  *  MIT License
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy of this
  * software and associated documentation files (the "Software"), to deal in the Software
  * without restriction, including without limitation the rights to use, copy, modify,
  * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  * permit persons to whom the Software is furnished to do so, subject to the following
  * conditions:
  *
  * The above copyright notice and this permission notice shall be
  * included in all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
  * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
  * OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */

import {Constants} from "./Constants";
import {Utils} from "./Utils";
import {AuthenticationParameters} from "./Request";

/**
 * @hidden
 *
 * General error class thrown by the MSAL.js library.
 */
export class AuthError extends Error {
    tokenRequestType: string;
    userState: string;
    constructor(message: string, tokenRequestType: string, userState: string) {
        super(message);
        this.name = "AuthError";
        this.stack = new Error().stack;
        this.tokenRequestType = tokenRequestType;
        this.userState = userState;

        Object.setPrototypeOf(this, AuthError.prototype);
    }
}

// TODO: Add error codes
// TODO: Create interaction type enum
// TODO: Replace tokenType with enum (4 values: id_token, access_token, id_token_token, unknown/unavailable)
// TODO: Create table of error and error codes

/**
 * @hidden
 *
 * Error thrown when there is an error in the client code running on the browser.
 */
export class ClientAuthError extends AuthError {
    constructor(message: string, tokenRequestType: string, userState: string) {
        super(message, tokenRequestType, userState);
        this.name = "ClientAuthError";
        Object.setPrototypeOf(this, ClientAuthError.prototype);
    }

    static createEndpointResolutionError(errDesc: string, tokenType: string, userState: string) : ClientAuthError {
        var errorMessage = "Error in Could not resolve endpoints. Please check network and try again.";
        if (!Utils.isEmpty(errDesc)) {
            errorMessage += " Details: " + errDesc;
        }
        return new ClientAuthError(errDesc, tokenType, userState);
    }

    static createMultipleMatchingTokensInCacheError(scope: string, tokenType: string, userState: string) : ClientAuthError {
        return new ClientAuthError("Cache error for scope " + scope + ": The cache contains multiple tokens satisfying the requirements. Call AcquireToken again providing more requirements like authority.", tokenType, userState);
    }

    static createMultipleAuthoritiesInCacheError(scope: string, tokenType: string, userState: string) : ClientAuthError {
        return new ClientAuthError("Cache error for scope " + scope + ": Multiple authorities found in the cache. Pass authority in the API overload.", tokenType, userState);
    }

    static createPopupWindowError(tokenType: string, userState: string) : ClientAuthError {
        return new ClientAuthError("Error opening popup window. This can happen if you are using IE or if popups are blocked in the browser.", tokenType, userState);
    }

    static createTokenRenewalTimeoutError(tokenType: string, userState: string) : ClientAuthError {
        return new ClientAuthError("Token renewal operation failed due to timeout.", tokenType, userState);
    }

    static createInvalidStateError(invalidState: string, actualState: string, tokenType: string, userState: string) : ClientAuthError {
        return new ClientAuthError("Invalid state: " + invalidState + ", should be state: " + actualState, tokenType, userState);
    }

    static createNonceMismatchError(invalidNonce: string, actualNonce: string, tokenType: string, userState: string) : ClientAuthError {
        return new ClientAuthError("Invalid nonce: " + invalidNonce + ", should be nonce: " + actualNonce, tokenType, userState);
    }

    static createLoginInProgressError(tokenType: string, userState: string) : ClientAuthError {
        return new ClientAuthError("Login_In_Progress: Error during login call - login is already in progress.", tokenType, userState);
    }

    static createAcquireTokenInProgressError(tokenType: string, userState: string) : ClientAuthError {
        return new ClientAuthError("AcquireToken_In_Progress: Error during login call - login is already in progress.", tokenType, userState);
    }

    static createUserCancelledError(tokenType: string, userState: string) : ClientAuthError {
        return new ClientAuthError("User_Cancelled: User cancelled ", tokenType, userState);
    }
}

/**
 * @hidden
 *
 * Error thrown when there is an error in configuration of the .js library.
 */
export class ConfigurationAuthError extends ClientAuthError {
    constructor(message: string, tokenType: string, userState: string) {
        super(message, tokenType, userState);
        this.name = "ConfigurationAuthError";

        Object.setPrototypeOf(this, ConfigurationAuthError.prototype);
    }

    static createInvalidCacheLocationConfigError(givenCacheLocation: string, tokenType: string, userState: string) : ConfigurationAuthError {
        return new ConfigurationAuthError("Cache Location is not valid. Provided value:" + givenCacheLocation + ". Possible values are: " + Constants.cacheLocationLocal + ", " + Constants.cacheLocationSession, tokenType, userState);
    }

    static createNoCallbackGivenError(tokenType: string, userState: string) : ConfigurationAuthError {
        return new ConfigurationAuthError("Error in configuration: no callback(s) registered for login/acquireTokenRedirect flows. Plesae call handleRedirectCallbacks() with the appropriate callback signatures. More information is available here: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/-basics", tokenType, userState);
    }

    static createCallbackParametersError(numArgs: number, tokenType: string, userState: string) : ClientAuthError {
        return new ConfigurationAuthError("Error occurred in callback - incorrect number of arguments, expected 2, got " + numArgs + ".", tokenType, userState);
    }

    static createSuccessCallbackParametersError(numArgs: number, tokenType: string, userState: string) : ClientAuthError {
        return new ConfigurationAuthError("Error occurred in callback for successful token response - incorrect number of arguments, expected 1, got " + numArgs + ".", tokenType, userState);
    }

    static createErrorCallbackParametersError(numArgs: number, tokenType: string, userState: string) : ClientAuthError {
        return new ConfigurationAuthError("Error occurred in callback for error response - incorrect number of arguments, expected 1, got " + numArgs + ".", tokenType, userState);
    }

    static createEmptyScopesArrayError(scopesValue: string, tokenType: string, userState: string) {
        return new ConfigurationAuthError("Scopes cannot be passed as empty array. Given value: " + scopesValue, tokenType, userState);
    }

    static createScopesNonArrayError(scopesValue: string, tokenType: string, userState: string) {
        return new ConfigurationAuthError("Scopes cannot be passed as non-array. Given value: " + scopesValue, tokenType, userState);
    }

    static createClientIdSingleScopeError(scopesValue: string, tokenType: string, userState: string) {
        return new ConfigurationAuthError("Client ID can only be provided as a single scope. Given value: " + scopesValue, tokenType, userState);
    }
}

/**
 * @hidden
 *
 * Error thrown when there is an error with the server code, for example, unavailability.
 */
export class ServerError extends AuthError {
    constructor(message: string, tokenType: string, userState: string) {
        super(message, tokenType, userState);
        this.name = "ServerError";

        Object.setPrototypeOf(this, ServerError.prototype);
    }

    static createServerUnavailableError(tokenType: string, userState: string) : ServerError {
        return new ServerError("Server is temporarily unavailable.", tokenType, userState);
    }

    static createUnknownServerError(errorDesc: string, tokenType: string, userState: string) : ServerError {
        return new ServerError("", tokenType, userState);
    }
}

/**
 * @hidden
 *
 * Error thrown when the user is required to perform an interactive token request.
 */
export class InteractionRequiredAuthError extends ServerError {
    interactionType: string;
    constructor(message: string, tokenType: string, userState: string) {
        super(message, tokenType, userState);
        this.name = "InteractionRequiredAuthError";

        Object.setPrototypeOf(this, InteractionRequiredAuthError.prototype);
    }

    setInteractionType(interactionType: string) : void {
        this.interactionType = interactionType;
    }

    static createLoginRequiredAuthError(tokenType: string, userState: string) : InteractionRequiredAuthError {
        return new InteractionRequiredAuthError("login_required: User must login.", tokenType, userState);
    }

    static createInteractionRequiredAuthError(errorDesc: string, tokenType: string, userState: string) : InteractionRequiredAuthError {
        return new InteractionRequiredAuthError("interaction_required: " + errorDesc, tokenType, userState);
    }

    static createConsentRequiredAuthError(errorDesc: string, tokenType: string, userState: string) : InteractionRequiredAuthError {
        return new InteractionRequiredAuthError("consent_required: " + errorDesc, tokenType, userState);
    }
}

/**
 * @hidden
 *
 * Error thrown when the client must provide additional proof to acquire a token. This will be used for conditional access cases.
 */
export class ClaimsRequiredAuthError extends InteractionRequiredAuthError {
    claimsRequired: string;
    constructor(message: string, tokenType: string, userState: string, claimsRequired: string) {
        super(message, tokenType, userState);
        this.name = "ClaimsRequiredAuthError";
        this.claimsRequired = claimsRequired;

        Object.setPrototypeOf(this, ClaimsRequiredAuthError.prototype);
    }
}


