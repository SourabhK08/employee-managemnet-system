import { Department } from "../models/index.js";
import { Employee } from "../models/emp.model.js";
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

const listDepartment = asyncHandler(async (req,res) => {
    const dept = await Department.find().select("-__v")

    if(!dept){
        throw new ApiError(404,'Department list not fetched')
    }

    const count = dept.length;

    return res
    .status(200)
    .json( new ApiResponse(200,{count,dept},"Department list fetched"))
})

const getDepartmentById = asyncHandler(async (req,res) => {
    const {id} = req.params;

    const foundedDepartment = await Department.findById(id).select('-__v');

    if(!foundedDepartment){
        throw new ApiError(404,'Department did not found')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,foundedDepartment,"Department founded successfully")
    )
})

const updateDepartment = asyncHandler(async (req,res) => {
    const {id} = req.params;
    const {name,description} = req.body;

    const updatedDept = await Department.findByIdAndUpdate(
        id,
        {
            $set:{
                name:name.toLowerCase(),
                description
            }
        },
        {
            new:true
        }
    )

    if(!updatedDept){
        throw new ApiError(500,'Can not update department')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedDept,"Department updated successfully")
    )

})

const deleteDepartment = asyncHandler(async (req,res) => {
    const {id} = req.params;

    const assignedEmployees = await Employee.find({department:id})

     if (assignedEmployees.length > 0) {
    throw new ApiError(400, "Cannot delete department. It is assigned to employees.");
  }

    const deletedDept = await Department.findByIdAndDelete(id);

    if (!deletedDept) {
        throw new ApiError(500,'Can not delete department')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,deletedDept,'Dpeartment deleted successfully')
    )
})



export {
    createDepartment,
    listDepartment,
    getDepartmentById,
    deleteDepartment,
    updateDepartment
}