import { IUsersService } from "../../services";
import { User, Page, PageBuilder } from "../../models";
import { PaginationInfo } from "../../middlewares";
import { LoginResponse } from "../../models/_login-response.model";
import { SequelizeUser } from "../models-impl/_sequelize-user.model";

export class SequelizeUsersService implements IUsersService {

    constructor() { }

    create(user: User): Promise<string | User> {
        try {
            return SequelizeUser.create(user);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    bulkCreate(users: User[]): Promise<User[]> {
        try {
            return SequelizeUser.bulkCreate(
                users, { returning: true });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    count(): Promise<number> {
        try {
            return SequelizeUser.count();
        } catch (err) {
            return Promise.reject(err);
        }
    }

    jwtEncode(user: User): Promise<string> {
        throw new Error("Method not implemented.");
    }

    jwtDecode(token: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    findById(id: string | number): Promise<User | null> {
        try {
            return SequelizeUser.findByPk(id);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async findPage(pageInfo: PaginationInfo): Promise<Page<User>> {
        try {
            const { count, rows } = await SequelizeUser.findAndCountAll({
                offset: pageInfo.offset,
                limit: pageInfo.ps
            });
            const page = PageBuilder
                .withPageInfo(pageInfo, rows)
                .totalCount(count)
                .build();
            return Promise.resolve(page);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async login(
        loginId: string,
        password: string,
        validator: (hash: string, pwd: string) => boolean): Promise<LoginResponse> {
        try {
            const user = await SequelizeUser.findOne({
                where: { email: loginId }
            });
            // Reject because we couldn't find record.
            if (user == null) {
                return Promise.reject(new Error("User not found."));
            }
            // check if password is valid
            if (validator(user.password, password)) {
                const accessToken = await this.jwtEncode(user);

                // TODO: add token to the cache

                return Promise.resolve({
                    accessToken
                });
            }

            // reject because password is invalid
            return Promise.reject(new Error("Invalid password"));
        } catch (err) {
            return Promise.reject(err);
        }
    }

    logout(userId: string): Promise<boolean> {
        // TODO: remove user from the cache
        throw new Error("Method not implemented.");
    }

}
