import { UsersRoles } from "@/app/API/types/types";

export interface IUser {
    id: number,
    role: UsersRoles,
    username: string
}