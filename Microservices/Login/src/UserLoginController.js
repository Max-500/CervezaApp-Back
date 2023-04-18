import * as UserLoginService from "./UserLoginService.js"

async function loginUserController(user){
    let result = await UserLoginService.loginUserService(user)
    return result
}

export { loginUserController }