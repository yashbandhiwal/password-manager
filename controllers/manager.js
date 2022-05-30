const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Manager = require('../models/Manager')

// @desc      generate password
// @route     POST /api/v1/manager/generate
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
// @route     POST /api/v1/manager/save
// @access    Private
exports.savePassword = asyncHandler(async(req,res,next) => {

    let {
        name,
        email,
        password,
    } = req.body;
    
    let userId = req.user.id

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

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
