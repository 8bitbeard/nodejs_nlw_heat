import { AuthenticateUserController } from "../../controllers/AuthenticateUserController"
import { AuthenticateUserService } from "../../services/AuthenticateUserService"

jest.mock("../../services/AuthenticateUserService")

describe('AuthenticateUserController', () => {
    describe('handle', () => {
        const executeMock = jest.fn();

        beforeAll(() => {
            AuthenticateUserService.prototype.execute = executeMock;
        })

        beforeEach(async () => {
            jest.resetAllMocks();
        });

        const mockRequest: any = {
            body: {
                email: 'example@example.net',
                password: '1234'
            }
        }

        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }

        it('should return an error when the authentication service raise an exception', async () => {
            executeMock.mockRejectedValueOnce(new Error())
            const authenticateUserController = new AuthenticateUserController();
            await authenticateUserController.handle(mockRequest, mockResponse).catch(error => {
                expect(error).toBeInstanceOf(Error)
            })
            expect(executeMock).toBeCalledTimes(1);
        })

        it('should execute the service and return a response', async () => {
            const responseData = {token: 'token', user: {}}
            executeMock.mockResolvedValueOnce(responseData)
            const authenticateUserController = new AuthenticateUserController();
            await authenticateUserController.handle(mockRequest, mockResponse)
            expect(executeMock).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(201);
        })
    })
})