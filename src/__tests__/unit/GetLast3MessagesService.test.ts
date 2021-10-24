import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/cjs/Mock';
import { GetLast3MessagesService } from '../../services/GetLast3MessagesService';

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
        it('should retrieve a list of max 3 messages', async () => {
            const message = {
                id: '123',
                text: 'Message Mock',
                created_at: 'mock_date' as unknown as Date,
                user_id: '120938123',
                user: {
                    id: '1',
                    name: 'Mocked User',
                    github_id: 1234123,
                    avatar_url: 'http://mocked.url.com',
                    login: 'mockeduser'
                }
            }
            prismaMock.message.findMany.mockResolvedValueOnce([message]);
            const getLast3MessagesService = new GetLast3MessagesService();
            const messages = await getLast3MessagesService.execute();
            expect(prismaMock.message.findMany).toBeCalledTimes(1);
            expect(messages).toEqual([message]);
        })

        it('should return a empty list when no message is found', async () => {
            prismaMock.message.findMany.mockResolvedValueOnce([]);
            const getLast3MessagesService = new GetLast3MessagesService();
            const messages = await getLast3MessagesService.execute();
            expect(prismaMock.message.findMany).toBeCalledTimes(1);
            expect(messages).toEqual([])
        })
    })
})