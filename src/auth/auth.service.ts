import { Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dto/createUser.dto";


@Injectable()
export class AuthService {
    getUser(createUserDTO: CreateUserDTO){
        return ({
            status: "success",
            users: createUserDTO
        })
    }
}