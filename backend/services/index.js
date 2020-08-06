/*
 * @description: This file defines all the user services
 * @date:17-JAN-2019
 * @author: Talentelgia
 * */

// include Utils module

var Utils = require('../../../utils/index');
var configs = require('../../../configs');

var jwt = require('jsonwebtoken');
// include all the internal modules

var userModel = require('../../user/models/index');
var async = require('async');


module.exports = {
    /**
     * Function to add New Staff Account
     */
    addStaffAccount: function (req, callback) {
        var password;
        async.waterfall([
            function (cb) {
                // Find if user with same Emaila nd role exist
                userModel.userModel.find({ email: req.email, role: req.role, isDeleted: false }, {}, {}, function (err, res) {
                    if (err)
                        cb(err)
                    else if (res.length > 0) {
                        cb(Utils.responses.EMAIL_ROLE_EXIST);
                    } else {
                        cb(null, null);
                    }
                })
            },
            function (data, cb) {
                // Encrypt Password and save user data in user collection
                password = Utils.md5(configs.configConstants.data.defaultPassword)
                var dataToSave = {
                    firstName: req.firstName,
                    lastName: req.lastName,
                    email: req.email,
                    role: req.role,
                    isEmailVerified: true,
                    password: password
                }
                userModel.userModel(dataToSave).save(function (err, res) {
                    if (err)
                        cb(err)
                    else {
                        cb(null, res)
                    }
                })
            },
            function (data, cb) {
                // Create token and send Email for verification Process
                Utils.universalFunctions.createLoginToken({ //create login token
                    _id: data._id,
                    email: req.email,
                    role: req.role
                },
                    function (err, token) {
                        if (err) {
                            cb(err)
                        } else {
                            var role;
                            if (req.role == 1) {
                                role = "Super Admin";
                            } else if (req.role == 2) {
                                role = "Loading Staff";
                            }
                            var subject = "BCM Coal Registration";
                            var pathlink = Utils.path.join(__dirname, '../../../assets/emailTemplates/')
                            var fileReadStream = Utils.fs.createReadStream(pathlink + 'email.html');
                            var emailTemplate = '';
                            fileReadStream.on('data', function (buffer) {
                                emailTemplate += buffer.toString();
                            });
                            fileReadStream.on('end', function (res) {
                                var name = req.firstName;
                                var sendStr = emailTemplate.replace('{{email}}', req.email).replace('{{name}}', name).replace('{{role}}', role).replace('{{password}}', configs.configConstants.data.defaultPassword)
                                var email_data = { // set email variables
                                    to: req.email,
                                    from: configs.configConstants.data.noReplyEmail,
                                    subject: subject,
                                    html: sendStr
                                }
                                Utils.universalFunctions.sendMail(email_data, function (err, res) {
                                    console.log("*************************Error", err, "********Response- ", res, "******************* Response of Email sending ....")
                                    cb(null, Utils.responses.USER_ADDED);
                                });
                            });
                        }
                    })
            }
        ], function (err, result) {
            callback(err, result)
        })
    },

    /**
     * Function to update Staff Account
     */
    updateStaffAccount: function (req, callback) {
        async.waterfall([
            function (cb) {
                var query = {
                    isDeleted: false,
                    isEmailVerified: true,
                    _id: req.userId
                }
                userModel.userModel.findOne(query)
                    .lean()
                    .exec(function (err, res) {
                        if (err)
                            callback(err);
                        else if (res) {
                            userModel.userModel.findOneAndUpdate(query, { $set: { firstName: req.firstName, lastName: req.lastName, role: req.role, updatedAt: new Date() } }, (e, r) => {
                                if (e)
                                    callback(e)
                                else if (r) {
                                    cb(null, Utils.responses.USER_UPDATED);
                                } else
                                    callback(Utils.responses.ERROR_IN_UPDATING_DATA);
                            })
                        } else {
                            callback(Utils.responses.USER_NOT_FOUND);
                        }
                    })
            }
        ], function (err, result) {
            callback(err, result)
        })
    },
    /**
     * Function to get staff Accounts based on skip limit and others Filters
     */

    getStaffList: function (req, callback) {
        async.waterfall([
            function (cb) {
                    var query = { isDeleted: false, isEmailVerified: true, _id: { $ne: req.userId } };

                    if (req.firstName && req.firstName != "") {
                        query.firstName = { $regex: req.firstName, $options: 'i' }
                    }
                    if (req.lastName && req.lastName != "") {
                        query.lastName = { $regex: req.lastName, $options: 'i' }
                    }
                    if (req.email && req.email != "") {
                        query.email = { $regex: req.email, $options: 'i' }
                    }
                    if (req.role && req.role != "") {
                        req.role = parseInt(req.role);
                        query.role = req.role
                    }
                    // Check how many users Exist with this criteria
                    userModel.userModel.count(query).lean().exec((e, count) => {
                        if (e)
                            cb(e)
                        else {
                            userModel.userModel.find(query, { firstName: 1, isActive: 1, lastName: 1, email: 1, role: 1 })
                                .sort({ createdAt: -1 })
                                .skip(req.skip)
                                .limit(req.limit)
                                .lean()
                                .exec((err, result) => {
                                    if (err)
                                        cb(err)
                                    else {
                                        let dataToSend = {
                                            count: count,
                                            data: result,
                                            message: Utils.responses.DATA_FETCHED
                                        };
                                        //Send finaldata
                                        callback(null, dataToSend);
                                    }
                                })
                        }
                    })
            }

        ], function (err, result) {
            callback(err, result)
        })
    },

    /**
     * Function to delete Particular Staff Account
     */

    deleteStaffAccount: function (req, callback) {
        let userData;
        async.waterfall([
            function (cb) {
                var query = {
                    isDeleted: false,
                    isEmailVerified: true,
                    _id: req.userId
                }
                // Check if user Exist
                userModel.userModel.findOne(query)
                    .lean()
                    .exec(function (err, res) {
                        if (err)
                            callback(err);
                        else if (res) {
                            // If exist then set status of User to deleted
                            userModel.userModel.findOneAndUpdate(query, { isDeleted: true, deletedAt: new Date() }, (e, r) => {
                                if (e)
                                    callback(e)
                                else if (r) {
                                    userData = r;
                                    cb(null, Utils.responses.USER_DELETED);
                                } else
                                    callback(Utils.responses.ERROR_IN_UPDATING_DATA);
                            })
                        } else {
                            callback(Utils.responses.USER_NOT_FOUND);
                        }
                    })
            },
            // Send Email notification to User
            function (data, cb) {
                var subject = "BCM Coal Account Delete";
                var pathlink = Utils.path.join(__dirname, '../../../assets/emailTemplates/')
                var fileReadStream = Utils.fs.createReadStream(pathlink + 'accountDelete.html');
                var emailTemplate = '';
                fileReadStream.on('data', function (buffer) {
                    emailTemplate += buffer.toString();
                });
                fileReadStream.on('end', function (res) {
                    var name = userData.firstName;
                    var sendStr = emailTemplate.replace('{{name}}', name)
                    var email_data = { // set email variables
                        to: userData.email,
                        from: configs.configConstants.data.noReplyEmail,
                        subject: subject,
                        html: sendStr
                    }
                    Utils.universalFunctions.sendMail(email_data, function (err, res) {
                        console.log("*************************Error", err, "********Response- ", res, "******************* Response of Email sending ....")
                        cb(err, data);
                    });
                });
            }
        ], function (err, result) {
            callback(err, result)
        })
    },
    /*
        Function to update status of User if active or inactive
    */

    toggleStatusOfUser: function (req, callback) {
        var query;
        async.waterfall([
            function (cb) {
                query = {
                    isDeleted: false,
                    isEmailVerified: true,
                    _id: req.userId
                }
                //Check if user Exist
                userModel.userModel.findOne(query)
                    .lean()
                    .exec(function (err, res) {
                        if (err)
                            callback(err);
                        else if (res) {
                            cb(null, res);
                        } else {
                            callback(Utils.responses.USER_NOT_FOUND);
                        }

                    })
            },
            function (data, cb) {
                if (data.isActive == req.active && req.active == true) {
                    callback(Utils.responses.ALREADY_ACTIVE);
                }
                else if (data.isActive == req.active && req.active == false) {
                    callback(Utils.responses.ALREADY_DEACTIVE);
                }
                else {
                    // Update Status of User
                    userModel.userModel.findOneAndUpdate(query, { $set: { isActive: req.active } })
                        .exec((err, res) => {
                            if (err)
                                cb(err)
                            else if (res) {
                                cb(null, Utils.responses.USER_UPDATED);
                            }
                            else {
                                cb(Utils.responses.ERROR_IN_UPDATING_DATA);
                            }
                        })
                }

            }
        ],
            function (err, result) {
                callback(err, result)
            })
    }
}