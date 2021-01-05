import { compareSync } from "bcrypt";
import { lookup } from "geoip-lite";
import { v4 as uuidv4 } from "uuid";

import { JOB_NAME } from "../../config/rabbit.config";
import RABBIT from "../../connector/rabbitmq/init/index";
import * as Redis from "../../connector/redis/index";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/jwt/generate.jwt";
import { logger } from "../../utils/log/logger.mixed";
import { IUser, IUserSession } from "./user.interface";
import {
    USER_ERROR_CODE,
    USER_ERROR_MESSAGE,
    USER_SUCCESS_CODE,
    USER_SUCCESS_MESSAGE,
} from "./user.message";
import * as UserRepository from "./user.repository";
import * as UserSessionRepository from "./user.session.repository";

/**
 *
 * @param {Object} userInfo
 */
export async function login(userInfo: IUser, userAgent: any, ip: string) {
    try {
        let uuid: any = uuidv4();

        let user: IUser | null = await UserRepository.createModelEmpty();

        if (userInfo?.username) {
            let myKey: string = `LOGIN:username_${userInfo?.username}`;
            user = await Redis.getJson(myKey);

            if (!user) {
                user = await UserRepository.findOne({
                    username: userInfo?.username?.toLowerCase(),
                });
                if (user) {
                    await Redis.setJson(myKey, user?.toObject(), 60);
                }
            } else user = await UserRepository.createModel(user);
        }
        if (userInfo?.email) {
            let myKey: string = `LOGIN:email_${userInfo?.email}`;
            user = await Redis.getJson(myKey);

            if (!user) {
                user = await UserRepository.findByEmail(userInfo?.email);
                if (user) {
                    await Redis.setJson(myKey, user?.toObject(), 60);
                }
            } else user = await UserRepository.createModel(user);
        }

        if (!user) {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.USERNAME_NOT_FOUND,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.USERNAME_NOT_FOUND,
            });
        }

        if (user?.status !== "active") {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.USER_HAS_BEED_ + user?.status,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.USER_HAS_BEED_,
            });
        }

        let passwordCorrect = await compareSync(
            userInfo?.password,
            user?.password
        );

        if (!passwordCorrect) {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.PASSWORD_INCORRECT,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.PASSWORD_INCORRECT,
            });
        }

        let accessToken: any = await generateAccessToken({
            _id: user?._id,
            ip: ip,
            uuid: uuid,
        });

        let myKey: string = `AToken_UserId_${user?._id}_uuid_${uuid}`;

        await Redis.setJson(myKey, accessToken, 60 * 60);

        let refreshToken: any = await generateRefreshToken({
            _id: user?._id,
            ip: ip,
            uuid: uuid,
        });

        await RABBIT.sendDataToRabbit(JOB_NAME.USER_SESSION_WRITE, {
            user: user?._id,
            userAgent: userAgent?.getResult(),
            ip: ip,
            uuid: uuid,
        });

        return Promise.resolve({
            user: user?.toJSON(),
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

        // return Promise.reject({
        //     message: USER_ERROR_MESSAGE.USER_LOGIN_FAILED,
        //     statusCode: 417,
        //     statusCodeResponse: USER_ERROR_CODE.USER_LOGIN_FAILED,
        // });
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

/**
 *
 * @param {Object} userInfo
 */
export async function register(userInfo: IUser) {
    try {
        let checkEmail: IUser | null = await UserRepository.findByEmail(
            userInfo?.email
        );

        if (checkEmail) {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.EMAIL_EXIST,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.EMAIL_EXIST,
            });
        }
        let checkUsername: IUser | null = await UserRepository.findOne({
            username: userInfo?.username?.toLowerCase(),
        });
        if (checkUsername) {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.USERNAME_EXIST,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.USERNAME_EXIST,
            });
        }
        let data: IUser = await UserRepository.create(userInfo);
        return Promise.resolve(data);
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

/**
 *
 * @param locals
 */
export async function getAccessToken(locals: any) {
    try {
        let checkUserSession: IUserSession | null = await UserSessionRepository.findOne(
            {
                uuid: locals?.user?.uuid,
                user: locals?.user?._id,
                status: "active",
                // ip: locals?.user?.ip,
            }
        );

        if (!checkUserSession) {
            return Promise.reject({
                message:
                    USER_ERROR_MESSAGE.YOUR_DEVICE_IS_NOT_ALLOWED_TO_GET_ACCESS_TOKEN,
                statusCode: 406,
                statusCodeResponse:
                    USER_ERROR_CODE.YOUR_DEVICE_IS_NOT_ALLOWED_TO_GET_ACCESS_TOKEN,
            });
        }

        let accessToken: any = await generateAccessToken({
            _id: locals?.user?._id,
            ip: locals?.ip,
            uuid: locals?.user?.uuid,
        });
        let accessTokenKey: string = `AToken_UserId_${locals?.user?._id}_uuid_${locals?.user?.uuid}`;

        await Redis.setJson(accessTokenKey, accessToken, 60 * 60);

        let checkUserSessionExist: IUserSession | null = await UserSessionRepository.findOne(
            {
                uuid: locals?.user?.uuid,
                user: locals?.user?._id,
                status: "active",
                ip: locals?.ip,
            }
        );

        if (checkUserSessionExist) {
            await UserSessionRepository.save(checkUserSessionExist);
        } else {
            let data = await UserSessionRepository.create({
                userAgent: checkUserSession?.userAgent,
                user: locals?.user?._id,
                uuid: locals?.user?.uuid,
                status: "active",
                ip: locals?.ip,
                location: lookup(locals?.ip),
            });

            //TODO: Send email to get AccessToken form new location
            await RABBIT.sendDataToRabbit(
                JOB_NAME.ACCESS_TOKEN_FROM_NEW_LOCATION,
                data
            );
        }

        return Promise.resolve({ accessToken });
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

/**
 *
 * @param token
 */
export async function logout(token: any) {
    try {
        await UserSessionRepository.updateMany(
            {
                uuid: token?.uuid,
            },
            {
                status: "logout",
            }
        );
        let accessTokenKey: string = `AToken_UserId_${token?._id}_uuid_${token?.uuid}`;

        await Redis.deleteKey(accessTokenKey);

        return Promise.resolve({
            message: USER_SUCCESS_MESSAGE.USER_HAVE_BEEN_LOGGED_OUT,
            statusCodeResponse: USER_SUCCESS_CODE.USER_HAVE_BEEN_LOGGED_OUT,
        });
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}

/**
 *
 * @param userInfo
 * @param payload
 */
export async function changePassword(userInfo: IUser, payload: any) {
    try {
        if (payload?.oldPassword === payload?.newPassword) {
            return Promise.reject({
                message:
                    USER_ERROR_MESSAGE.THE_NEW_PASSWORD_CANNOT_BE_THE_SAME_AS_THE_OLD_ONE,
                statusCode: 410,
                statusCodeResponse:
                    USER_ERROR_CODE.THE_NEW_PASSWORD_CANNOT_BE_THE_SAME_AS_THE_OLD_ONE,
            });
        }

        let userData: IUser | null = await UserRepository.findById(
            userInfo?._id
        );

        let passwordCorrect = await compareSync(
            payload?.oldPassword,
            userData?.password
        );

        if (!passwordCorrect) {
            return Promise.reject({
                message: USER_ERROR_MESSAGE.PASSWORD_INCORRECT,
                statusCode: 410,
                statusCodeResponse: USER_ERROR_CODE.PASSWORD_INCORRECT,
            });
        }

        userData?.set("password", payload?.newPassword);

        await UserRepository.save(userData);

        return Promise.resolve({
            message: USER_SUCCESS_MESSAGE.PASSWORD_HAVE_BEEN_CHANGED,
            statusCodeResponse: USER_SUCCESS_CODE.PASSWORD_HAVE_BEEN_CHANGED,
        });
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
}
