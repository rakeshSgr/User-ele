/**
 * name : files.js
 * author : Aman Gupta
 * created-date : 03-Nov-2021
 * Description : files helper.
 */

// Dependencies
const cloudServices = require('../../generics/cloud-services');
const apiResponses = require('../../constants/api-responses');
const httpStatusCode = require('../../generics/http-status');
const common = require('../../constants/common');

module.exports = class FilesHelper {

    /**
      * Get Signed Url
      * @method
      * @name getSignedUrl
      * @param {JSON} req  request body.
      * @param {string} req.query.fileName - name of the file
      * @param {string} _id  -  userId
      * @returns {JSON} - Response contains signed url
    */
    static async getSignedUrl(fileName, _id) {
        try {
            const destFilePath = `users/${_id}-${new Date().getTime()}-${fileName}`;
            let response;
            if (process.env.CLOUD_STORAGE === 'GCP') {
                response = await cloudServices.getGcpSignedUrl(destFilePath);
            } else if (process.env.CLOUD_STORAGE === 'AWS') {
                response = await cloudServices.getAwsSignedUrl(destFilePath);
            } else if (process.env.CLOUD_STORAGE === 'AZURE') {
                response = await cloudServices.getAzureSignedUrl(destFilePath);
            }
            response.destFilePath = destFilePath
            return common.successResponse({ message: apiResponses.SIGNED_URL_GENERATED_SUCCESSFULLY, statusCode: httpStatusCode.ok, responseCode: 'OK', result: response });
        } catch (error) {
            throw error;
        }
    }

}