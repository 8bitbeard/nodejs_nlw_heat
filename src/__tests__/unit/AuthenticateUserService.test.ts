import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/cjs/Mock';
import { AuthenticateUserService } from '../../services/AuthenticateUserService';

import prismaClient from "../../prisma";
import { sign } from 'jsonwebtoken';

jest.mock('../../prisma', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>()
}))

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("jsonwebtoken", () => {
    const sign = () => {
        return "token-test"
    }
    return {
        sign
    }
})

describe('AuthenticateUserService', () => {
    beforeEach(async () => {
        jest.resetAllMocks();
    });

    describe('execute', () => {
        it('should return an error when the login with the github client fail', async () => {
            mockedAxios.post.mockResolvedValueOnce({data: {}})

            const authenticateUserService = new AuthenticateUserService();
            await authenticateUserService.execute('1209381032812').catch(error => {
                expect(error).toBeInstanceOf(Error);
                expect(error).toMatchObject({
                    message: "The connection to the Github Client Failed!"
                })
            })
        })

        it('should return an error when authentication with github wuth user access_token fail', async() => {
            mockedAxios.post.mockResolvedValueOnce({data: {access_token: 'mock_access_token'}})
            mockedAxios.get.mockResolvedValueOnce({data: {}})

            const authenticateUserService = new AuthenticateUserService();
            await authenticateUserService.execute('123019230912').catch(error => {
                expect(error).toBeInstanceOf(Error);
                expect(error).toMatchObject({
                    message: "Failed to fetch user data from Github!"
                })
            })
        })

        it('should create and authenticate a user when no record is found with given github_id', async() => {
            const mockedUser = {
                id: '1',
                name: 'Mocked User',
                github_id: 1234123,
                avatar_url: 'http://mocked.url.com',
                login: 'mockeduser'
            }
            mockedAxios.post.mockResolvedValueOnce({data: {access_token: 'mock_access_token'}})
            mockedAxios.get.mockResolvedValueOnce({data: {login: 'mockuser', id: '12', avatar_url: 'http://mock.url.com', name: 'Mock User'}})
            prismaMock.user.findFirst.mockResolvedValueOnce(null)
            prismaMock.user.create.mockResolvedValueOnce(mockedUser)
            const authenticateUserService = new AuthenticateUserService();
            const {token, user} = await authenticateUserService.execute('123019230912')
            expect(token).toEqual('token-test')
            expect(user).toMatchObject(mockedUser)
            expect(prismaMock.user.findFirst).toBeCalledTimes(1)
            expect(prismaMock.user.create).toBeCalledTimes(1)
        })

        it('should only authenticate a user that already exists on the data base', async() => {
            const mockedUser = {
                id: '1',
                name: 'Mocked User',
                github_id: 1234123,
                avatar_url: 'http://mocked.url.com',
                login: 'mockeduser'
            }
            mockedAxios.post.mockResolvedValueOnce({data: {access_token: 'mock_access_token'}})
            mockedAxios.get.mockResolvedValueOnce({data: {login: 'mockuser', id: '12', avatar_url: 'http://mock.url.com', name: 'Mock User'}})
            prismaMock.user.findFirst.mockResolvedValueOnce(mockedUser)
            const authenticateUserService = new AuthenticateUserService();
            const {token, user} = await authenticateUserService.execute('123019230912')
            expect(token).toEqual('token-test')
            expect(user).toMatchObject(mockedUser)
            expect(prismaMock.user.findFirst).toBeCalledTimes(1)
        })
    })
})