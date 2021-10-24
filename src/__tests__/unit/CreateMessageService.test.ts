import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/cjs/Mock';
import { CreateMessageService } from '../../services/CreateMessageService';
import { Server } from 'socket.io';

import prismaClient from "../../prisma";
import { io } from '../../app';

jest.mock('../../prisma', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>()
}))

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>

jest.mock('../../app', () => ({
    __esModule: true,
    io: mockDeep<Server>()
}))

const ioMock = io as unknown as DeepMockProxy<Server>

describe('CreateMessageService', () => {
    beforeEach(async () => {
        jest.resetAllMocks();
    });

    describe('execute', () => {
        it('should create a message', async () => {
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
            prismaMock.message.create.mockResolvedValueOnce(message);
            const createMessageService = new CreateMessageService();
            await createMessageService.execute("Mock Message", '123');
            expect(prismaMock.message.create).toBeCalledTimes(1);
            expect(ioMock.emit).toBeCalledTimes(1);
        })
    })
})