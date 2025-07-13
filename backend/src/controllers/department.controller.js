import { Department } from "../models/department.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

const createDepartment = asyncHandler(async (req,res) => {

    const{name,description} = req.body;

    if(!name){
        throw new ApiError(400,'Name is required')
    }

    const dept = await Department.create({
        name:name.toLowerCase(),
        description
    })

    const createdDepartment = await Department.findById(dept._id)

    if(!createdDepartment){
        throw new ApiError(500,'Department not created')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,createdDepartment,'Department Created Successfully')
    )
})

export {
    createDepartment
}