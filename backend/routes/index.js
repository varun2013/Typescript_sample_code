/*
 * @description: This file defines all the staff accounts routes
 * @date:21-JAN-2019
 * @author: Talentelgia
 * */


// include utils module

var Utils = require('../../../utils/index');
var staffService = require('../services/index');

module.exports = [
    /**
     * Route for adding new Staff Account
     */
    {
        method: 'POST',
        path: '/v1/Manage-Staff-Accounts/addStaffAccount',
        config: {
            description: 'API for adding new account, role = 1=> Super Admin, 2=> Staff Account ',
            notes: 'API for adding new account',
            tags: ['api'],
            pre: [
                { method: Utils.universalFunctions.verifyAdminLoginToken, assign: "userDetails" }
            ],
            validate: {
                headers: Utils.Joi.object({
                    'x-logintoken': Utils.Joi.string().required().trim()
                }).options({ allowUnknown: true }),
                payload: {
                    firstName: Utils.Joi.string().required().regex(/^[a-zA-Z0-9!@#$%^&*]{3,20}$/).options({ language: { string: { regex: { base: 'must be valid and should be of minimum 3 characters' } } } }).label('name'),
                    lastName: Utils.Joi.string().required().regex(/^[a-zA-Z0-9!@#$%^&*]{3,20}$/).options({ language: { string: { regex: { base: 'must be valid and should be of minimum 3 characters' } } } }).label('name'),
                    email: Utils.Joi.string().email().lowercase().required().label('email'),
                    role: Utils.Joi.number().required().valid(1, 2)
                }
            }
        },
        handler: function (request, reply) {
            request.payload.token = request.headers['x-logintoken'];
            staffService.addStaffAccount(request.payload, function (err, res) {
                if (err) {
                    Utils.response.error(reply, err.message);
                } else {
                    Utils.response.success(reply, res.message);
                }
            });
        }
    },
    /**
     * Route for Updating Particular Staff Account
     */
    {
        method: 'POST',
        path: '/v1/Manage-Staff-Accounts/updateStaffAccount',
        config: {
            description: 'API for update Staff Account, role = 1=> Super Admin, 2=> Staff Account ',
            notes: 'API for update Staff Account',
            tags: ['api'],
            pre: [
                { method: Utils.universalFunctions.verifyAdminLoginToken, assign: "userDetails" }
            ],
            validate: {
                headers: Utils.Joi.object({
                    'x-logintoken': Utils.Joi.string().required().trim()
                }).options({ allowUnknown: true }),
                payload: {
                    userId: Utils.Joi.string().required().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).label('User Id'),
                    firstName: Utils.Joi.string().required().regex(/^[a-zA-Z0-9!@#$%^&*]{3,20}$/).options({ language: { string: { regex: { base: 'must be valid and should be of minimum 3 characters' } } } }).label('firstName'),
                    lastName: Utils.Joi.string().required().regex(/^[a-zA-Z0-9!@#$%^&*]{3,20}$/).options({ language: { string: { regex: { base: 'must be valid and should be of minimum 3 characters' } } } }).label('lastName'),
                    role: Utils.Joi.number().required().valid(1, 2)
                }
            }
        },
        handler: function (request, reply) {
            request.payload.token = request.headers['x-logintoken'];
            staffService.updateStaffAccount(request.payload, function (err, res) {
                console.log("***************^^^^^**************1", err, res);
                if (err) {
                    Utils.response.error(reply, err.message);
                } else {
                    Utils.response.success(reply, res.message);
                }
            });
        }
    },
    /**
     * Route for Listing Staff accounts based on skip and limit values
     */
    {
        method: 'POST',
        path: '/v1/Manage-Staff-Accounts/getStaffList',
        config: {
            description: 'API for update Staff Account, role = 1=> Super Admin, 2=> Staff Account ',
            notes: 'API for update Staff Account',
            tags: ['api'],
            pre: [
                { method: Utils.universalFunctions.verifyAdminLoginToken, assign: "userDetails" }
            ],
            validate: {
                headers: Utils.Joi.object({
                    'x-logintoken': Utils.Joi.string().required().trim()
                }).options({ allowUnknown: true }),
                payload: {
                    skip: Utils.Joi.number().optional(),
                    limit: Utils.Joi.number().optional(),
                    firstName: Utils.Joi.string().optional(),
                    lastName: Utils.Joi.string().optional(),
                    email: Utils.Joi.string().optional(),
                    role: Utils.Joi.string().optional(),
                    flag: Utils.Joi.string().optional()
                }
            }
        },
        handler: function (request, reply) {
            request.payload.token = request.headers['x-logintoken'];
            request.payload.userId = request.pre.userDetails[0]._id;
            staffService.getStaffList(request.payload, function (err, res) {
                console.log("***************^^^^^**************1", err, res);
                if (err) {
                    Utils.response.error(reply, err.message);
                } else {
                    Utils.response.successWithCount(reply, res.count, res.message.message, res.data);
                }
            });
        }
    },
    /**
     * Route for deleting particular Staff Account
     */
    {
        method: 'DELETE',
        path: '/v1/Manage-Staff-Accounts/deleteStaffAccount',
        config: {
            description: 'API for delete Staff Account, role = 1=> Super Admin, 2=> Staff Account ',
            notes: 'API for delete Staff Account',
            tags: ['api'],
            pre: [
                { method: Utils.universalFunctions.verifyAdminLoginToken, assign: "userDetails" }
            ],
            validate: {
                headers: Utils.Joi.object({
                    'x-logintoken': Utils.Joi.string().required().trim()
                }).options({ allowUnknown: true }),
                query: {
                    userId: Utils.Joi.string().required().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).label('User Id'),
                }
            }
        },
        handler: function (request, reply) {
            request.query.token = request.headers['x-logintoken'];
            staffService.deleteStaffAccount(request.query, function (err, res) {
                console.log("***************^^^^^**************1", err, res);
                if (err) {
                    Utils.response.error(reply, err.message);
                } else {
                    Utils.response.success(reply, res.message);
                }
            });
        }
    },

    /**
     * Route to update Status of Particular Staff 
     */
    {
        method: 'POST',
        path: '/v1/Manage-Staff-Accounts/toggleStatusOfUser',
        config: {
            description: 'API for active/deactive Staff Account, role = 1=> Super Admin, 2=> Staff Account ',
            notes: 'API for active/deactive Staff Account',
            tags: ['api'],
            pre: [
                { method: Utils.universalFunctions.verifyAdminLoginToken, assign: "userDetails" }
            ],
            validate: {
                headers: Utils.Joi.object({
                    'x-logintoken': Utils.Joi.string().required().trim()
                }).options({ allowUnknown: true }),
                payload: {
                    userId: Utils.Joi.string().required().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).label('User Id'),
                    active: Utils.Joi.boolean().required()
                }
            }
        },
        handler: function (request, reply) {
            request.payload.token = request.headers['x-logintoken'];
            staffService.toggleStatusOfUser(request.payload, function (err, res) {
                if (err) {
                    Utils.response.error(reply, err.message);
                } else {
                    Utils.response.success(reply, res.message);
                }
            });
        }
    }

]