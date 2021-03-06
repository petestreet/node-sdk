import objectAssign from "object-assign";
import ApiClient from "./utils/ApiClient";

/**
 * The Hyperwallet SDK Client
 */
export default class Hyperwallet {

    /**
     * Create a instance of the SDK Client
     *
     * @param {Object} config - The API config
     * @param {string} config.username - The API username
     * @param {string} config.password - The API password
     * @param {string} [config.programToken] - The program token that is used for some API calls
     * @param {string} [config.server=https://api.sandbox.hyperwallet.com] - The API server to connect to
     */
    constructor({ username, password, programToken, server = "https://api.sandbox.hyperwallet.com" }) {
        if (!username || !password) {
            throw new Error("You need to specify your API username and password!");
        }

        /**
         * The instance of the ApiClient
         *
         * @type {ApiClient}
         * @protected
         */
        this.client = new ApiClient(username, password, server);

        /**
         * The program token that is used for some API calls
         *
         * @type {string}
         * @protected
         */
        this.programToken = programToken;
    }

    //--------------------------------------
    // Users
    //--------------------------------------

    /**
     * Create a user
     *
     * @param {Object} data - The user data
     * @param {api-callback} callback - The callback for this call
     */
    createUser(data, callback) {
        this.addProgramToken(data);
        this.client.doPost("users", data, {}, callback);
    }

    /**
     * Load a user
     *
     * @param {string} userToken - The user token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    getUser(userToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}`, {}, callback);
    }

    /**
     * Update a user
     *
     * @param {string} userToken - The user token
     * @param {Object} data - The user data that should be updated
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    updateUser(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.addProgramToken(data);
        this.client.doPut(`users/${encodeURIComponent(userToken)}`, data, {}, callback);
    }

    /**
     * List all users
     *
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     */
    listUsers(options, callback) {
        this.client.doGet("users", options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Prepaid Cards
    //--------------------------------------

    /**
     * Create a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {Object} data - The prepaid card data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    createPrepaidCard(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards`, data, {}, callback);
    }

    /**
     * Get a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    getPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}`, {}, callback);
    }

    /**
     * Update a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {Object} data - The prepaid card data to update
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    updatePrepaidCard(userToken, prepaidCardToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}`, data, {}, callback);
    }

    /**
     * List all prepaid cards
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    listPrepaidCards(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Suspend a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    suspendPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "SUSPENDED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Unsuspend a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    unsuspendPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "UNSUSPENDED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Mark a prepaid card as lost or stolen
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    lostOrStolenPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "LOST_OR_STOLEN",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Deactivate a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    deactivatePrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "DE_ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Lock a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    lockPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "LOCKED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Unlock a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    unlockPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "UNLOCKED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Create a prepaid card status transition
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {Object} data - The prepaid card status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    createPrepaidCardStatusTransition(userToken, prepaidCardToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * Get a prepaid card status transition
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {string} statusTransitionToken - The prepaid card status transition token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken, prepaidCardToken or statusTransitionToken is not provided
     */
    getPrepaidCardStatusTransition(userToken, prepaidCardToken, statusTransitionToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }

        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`, {}, callback);
    }

    /**
     * List all prepaid card status transitions
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    listPrepaidCardStatusTransitions(userToken, prepaidCardToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Bank Accounts
    //--------------------------------------

    /**
     * Create a bank account
     *
     * @param {string} userToken - The user token
     * @param {Object} data - The bank account data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    createBankAccount(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-accounts`, data, {}, callback);
    }

    /**
     * Get a bank account
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    getBankAccount(userToken, bankAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}`, {}, callback);
    }

    /**
     * Update a bank account
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {Object} data - The bank account data to update
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    updateBankAccount(userToken, bankAccountToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}`, data, {}, callback);
    }

    /**
     * List all bank accounts
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    listBankAccounts(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-accounts`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Deactivate a bank account
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    deactivateBankAccount(userToken, bankAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }

        const transition = {
            transition: "DE-ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Create a bank account status transition
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {Object} data - The bank account status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    createBankAccountStatusTransition(userToken, bankAccountToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * List all bank account status transitions
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    listBankAccountStatusTransitions(userToken, bankAccountToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Balances
    //--------------------------------------

    /**
     * List balances for a user
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    listBalancesForUser(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/balances`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * List balances for a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    listBalancesForPrepaidCard(userToken, prepaidCardToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/balances`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * List balances for a program accounts
     *
     * @param {string} programToken - The program token
     * @param {string} accountToken - The account token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if programToken or accountToken is not provided
     */
    listBalancesForAccount(programToken, accountToken, options, callback) {
        if (!programToken) {
            throw new Error("programToken is required");
        }
        if (!accountToken) {
            throw new Error("accountToken is required");
        }
        this.client.doGet(`programs/${encodeURIComponent(programToken)}/accounts/${encodeURIComponent(accountToken)}/balances`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Payments
    //--------------------------------------

    /**
     * Create a payment
     *
     * @param {Object} data - The payment data
     * @param {api-callback} callback - The callback for this call
     */
    createPayment(data, callback) {
        this.addProgramToken(data);
        this.client.doPost("payments", data, {}, callback);
    }

    /**
     * Get a payment
     *
     * @param {string} paymentToken - The payment token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if paymentToken is not provided
     */
    getPayment(paymentToken, callback) {
        if (!paymentToken) {
            throw new Error("paymentToken is required");
        }
        this.client.doGet(`payments/${encodeURIComponent(paymentToken)}`, {}, callback);
    }

    /**
     * List all payments
     *
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     */
    listPayments(options, callback) {
        this.client.doGet("payments", options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Programs
    //--------------------------------------

    /**
     * Get a program
     *
     * @param {string} programToken - The program token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if programToken is not provided
     */
    getProgram(programToken, callback) {
        if (!programToken) {
            throw new Error("programToken is required");
        }
        this.client.doGet(`programs/${encodeURIComponent(programToken)}`, {}, callback);
    }

    //--------------------------------------
    // Program Accounts
    //--------------------------------------

    /**
     * Get a program account
     *
     * @param {string} programToken - The program token
     * @param {string} accountToken - The account token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if programToken is not provided
     */
    getProgramAccount(programToken, accountToken, callback) {
        if (!programToken) {
            throw new Error("programToken is required");
        }
        if (!accountToken) {
            throw new Error("accountToken is required");
        }
        this.client.doGet(`programs/${encodeURIComponent(programToken)}/accounts/${encodeURIComponent(accountToken)}`, {}, callback);
    }


    //--------------------------------------
    // Transfer Method Configurations
    //--------------------------------------

    /**
     * Get a transfer method configuration
     *
     * @param {string} userToken - The user token
     * @param {string} country - The transfer method country
     * @param {string} currency - The transfer method currency
     * @param {string} type - The transfer method type
     * @param {string} profileType - The profile type
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken, country, currency, type or profileType is not provided
     */
    getTransferMethodConfiguration(userToken, country, currency, type, profileType, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!country) {
            throw new Error("country is required");
        }
        if (!currency) {
            throw new Error("currency is required");
        }
        if (!type) {
            throw new Error("type is required");
        }
        if (!profileType) {
            throw new Error("profileType is required");
        }
        this.client.doGet("transfer-method-configurations", {
            userToken,
            country,
            currency,
            type,
            profileType,
        }, callback);
    }

    /**
     * List all transfer method configurations
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    listTransferMethodConfigurations(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const params = options ? objectAssign({}, options, { userToken }) : { userToken };
        this.client.doGet("transfer-method-configurations", params, Hyperwallet.handle204Response(callback));
    }

    /**
     * Create a transfer method
     *
     * @param {string} userToken The user token
     * @param {string} jsonCacheToken The json cache token supplied by the widget
     * @param {Object} data - Transfer method data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     * @throws Will throw an error if jsonCacheToken is not provided
     */
    createTransferMethod(userToken, jsonCacheToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }

        if (!jsonCacheToken) {
            throw new Error("jsonCacheToken is required");
        }

        const headers = { "Json-Cache-Token": jsonCacheToken };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/transfer-methods`, data, headers, callback);
    }

    //--------------------------------------
    // Receipts
    //--------------------------------------

    /**
     * List all program account receipts
     *
     * @param {string} programToken - The program token
     * @param {string} accountToken - The account token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if programToken or accountToken is not provided
     */
    listReceiptsForProgramAccount(programToken, accountToken, options, callback) {
        if (!programToken) {
            throw new Error("programToken is required");
        }
        if (!accountToken) {
            throw new Error("accountToken is required");
        }
        this.client.doGet(`programs/${encodeURIComponent(programToken)}/accounts/${encodeURIComponent(accountToken)}/receipts`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * List all user receipts
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    listReceiptsForUser(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/receipts`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * List all prepaid card receipts
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    listReceiptsForPrepaidCard(userToken, prepaidCardToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/receipts`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Webhooks: Notifications
    //-------------------------------------

    /**
     * List webhook notifications
     *
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     */
    listWebhookNotifications(options, callback) {
        this.client.doGet("webhook-notifications", options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Get a single webhook notification
     *
     * @param {string} webhookToken - Webhook token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if webhookToken is not provided
     */
    getWebhookNotification(webhookToken, callback) {
        if (!webhookToken) {
            throw new Error("webhookToken is required");
        }
        this.client.doGet(`webhook-notifications/${encodeURIComponent(webhookToken)}`, {}, callback);
    }

    //--------------------------------------
    // Internal utils
    //--------------------------------------

    /**
     * Add program token to data object if not already set
     *
     * @param {Object} data - The data object
     * @returns {Object} - The adjusted object
     *
     * @private
     */
    addProgramToken(data) {
        if (!data || !this.programToken) {
            return data;
        }
        if (data.programToken) {
            return data;
        }

        data.programToken = this.programToken; // eslint-disable-line no-param-reassign
        return data;
    }

    /**
     * Handle 204 response for list calls
     *
     * @param {api-callback} callback - The api callback
     * @returns {api-callback} - A wrapper api callback
     *
     * @private
     */
    static handle204Response(callback) {
        return (err, data, res) => {
            if (!err && res.status === 204) {
                callback(err, {
                    count: 0,
                    data: [],
                }, res);
                return;
            }
            callback(err, data, res);
        };
    }

}
