import { ProfileUserController } from "../../controllers/ProfileUserController"
import { ProfileUserService } from "../../services/ProfileUserService"

jest.mock("../../services/ProfileUserService")

describe('ProfileUserController', () => {
    describe('handle', () => {
        const executeMock = jest.fn();

        beforeAll(() => {
            ProfileUserService.prototype.execute = executeMock;
        })

        beforeEach(async () => {
            jest.resetAllMocks();
        });

        const mockRequest: any = {
            user_id: '1234'
        }

        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }

        it('should return an error when the get last 3 messages service raise an exception', async () => {
            executeMock.mockRejectedValueOnce(new Error())
            const profileUserController = new ProfileUserController();
            await profileUserController.handle(mockRequest, mockResponse).catch(error => {
                expect(error).toBeInstanceOf(Error)
            })
            expect(executeMock).toBeCalledTimes(1);
        })

        it('should execute the service successfully and return a response', async () => {
            const responseData = {message: 'Success'}
            executeMock.mockResolvedValueOnce(responseData)
            const createMessagecontroller = new ProfileUserController();
            await createMessagecontroller.handle(mockRequest, mockResponse)
            expect(executeMock).toBeCalledTimes(1);
        })
    })
})