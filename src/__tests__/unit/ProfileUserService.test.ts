import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/cjs/Mock';
import { ProfileUserService } from '../../services/ProfileUserService';

import prismaClient from "../../prisma";

jest.mock('../../prisma', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>()
}))

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>

describe('GetLast3MessagesService', () => {
    beforeEach(async () => {
        jest.resetAllMocks();
    });

    describe('execute', () => {
        it('should return the logged in user data', async () => {
            const mockUser = {
                id: '1234',
                name: 'Mocked User',
                github_id: 1234123,
                avatar_url: 'http://mocked.url.com',
                login: 'mockeduser'
            }
            prismaMock.user.findFirst.mockResolvedValueOnce(mockUser);
            const profileUserService = new ProfileUserService();
            const user = await profileUserService.execute('1234');
            expect(prismaMock.user.findFirst).toBeCalledTimes(1);
            expect(user).toMatchObject(mockUser)
        })

        it('should return null when no info is found about the logged in user', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null);
            const profileUserService = new ProfileUserService();
            const user = await profileUserService.execute('1234');
            expect(prismaMock.user.findFirst).toBeCalledTimes(1);
            expect(user).toBe(null)
        })
    })
})