const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Manager = require('../models/Manager');
const {ObjectId} = require('mongodb');
const CryptoJS = require('crypto-js');

// @desc      generate password
// @route     POST /api/v1/manager/generatePassword
// @access    Private
exports.generatePassword = asyncHandler(async(req,res,next) => {

    let length = req.body.rounds,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    if(length < 8){
        return next(new ErrorResponse('Rounds should be greater than 8', 400));
    }
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    
    res.status(200).json({
        success:true,
        password:retVal
    })
})

// @desc      Save password
// @route     POST /api/v1/manager/savePassword
// @access    Private
exports.savePassword = asyncHandler(async(req,res,next) => {

    let {
        name,
        email,
        password,
    } = req.body;
    
    let userId = req.user.id

    password = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password))

    // const salt = await bcrypt.genSalt(10);
    // password = await bcrypt.hash(password, salt);

    await Manager.create({
        name,
        email,
        password,
        userId
    })

    res.status(200).json({
        success:true,
        message:"Password saved successfully"
    })

})

// @desc      get all manager
// @route     POST /api/v1/manager/getall
// @access    Private
exports.getall = asyncHandler(async(req,res,next) => {

    let query;

    // Finding resource
    query = Manager.find();
    
    // query = query.sort('-createdAt');
    
    // Pagination
    const page = parseInt(req.body.page, 10) || 1;
    const limit = parseInt(req.body.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Manager.countDocuments();

    query = Manager.aggregate([
        {
            $match:{

            }
        },
        {
            $lookup:{
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as:"userData"
            }
        },
        {
            $sort:{ "name":1 }
        },
        {
            $skip: startIndex
        },
        {
            $limit:limit
        },
        {
            $unwind:{
                path: '$userData',
                preserveNullAndEmptyArrays: true,
              },
        },
        {
            $group:{
                _id:"$userData._id",
                userData:{$first:"$userData"},
                data: { $push: {
                    "_id":"$_id",
                    "name":"$name",
                    "userId": "$userId",
                    "email": "$email",
                    "password": "$password",
                    "createdAt": "$createdAt",
                    "modefiedAt": "$modefiedAt",
                } }, 
            }
        },
  
    ])
    

    // Executing query
    const results = await query;

    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
        pagination.next = {
        page: page + 1,
        limit
        };
    }
    
    if (startIndex > 0) {
        pagination.prev = {
        page: page - 1,
        limit
        };
    }

    res.status(200).json({
        success: true,
        count: results.length,
        pagination,
        data: results
    })

      
})

// @desc      get one manager
// @route     POST /api/v1/manager/getone
// @access    Private
exports.getOne = asyncHandler(async(req,res,next) => {

    let manageId = req.body.manageId

    let query = await Manager.findById(manageId)

    if(!query){
        return next(new ErrorResponse('Data not exist', 404));
    } 

    res.status(200).json({
        success:true,
        result:query
    })

})

// @desc      get one manager
// @route     POST /api/v1/manager/getone
// @access    Private
// pending
exports.viewPassword = asyncHandler(async(req,res,next) => {

    let enc_password = req.body.enc_password;

    let decrypt = CryptoJS.enc.Base64.parse(a).toString(CryptoJS.enc.Utf8)

    res.status(200).json({
        success:true,
        decrypt
    })

})

// @desc      update manager
// @route     POST /api/v1/manager/getone
// @access    Private
exports.updateManager = asyncHandler(async(req,res,next) => {

    let {
        name,
        email,
        password,
        managerId,
    } = req.body;

    let queryFind = await Manager.findOne({
        _id:ObjectId(managerId),
        userId:ObjectId(managerId)
    });

    if(queryFind){
        return next(ErrorResponse('Manage id not found',404))
    }

    password = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password))

    await Manager.findByIdAndUpdate(managerId,{
        name,
        email,
        password
    })

    res.status(200).json({
        success:true,
        message:"Successfully updated"
    })

})