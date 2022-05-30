const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Manager = require('../models/Manager')


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