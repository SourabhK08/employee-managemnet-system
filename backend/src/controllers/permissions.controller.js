import { userPermissions } from "../constants/permissions.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

const listPermissions = asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200,Object.entries(userPermissions).map(([key,value]) => ({
            key,
            value
        })),'Permissions fetched successfully')
    )
})

export {listPermissions}