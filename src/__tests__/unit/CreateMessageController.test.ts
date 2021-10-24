import { CreateMessageController } from "../../controllers/CreateMessageController"
import { CreateMessageService } from "../../services/CreateMessageService"

jest.mock("../../services/CreateMessageService")

describe('CreateMessageController', () => {
    describe('handle', () => {
        const executeMock = jest.fn();

        beforeAll(() => {
            CreateMessageService.prototype.execute = executeMock;
        })

        beforeEach(async () => {
            jest.resetAllMocks();
        });

        const mockRequest: any = {
            body: {
                message: 'Mock Message',
            },
            user_id: '1234'
        }

        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }

        it('should return an error when the create message service raise an exception', async () => {
            executeMock.mockRejectedValueOnce(new Error())
            const createMessagecontroller = new CreateMessageController();
            await createMessagecontroller.handle(mockRequest, mockResponse).catch(error => {
                expect(error).toBeInstanceOf(Error)
            })
            expect(executeMock).toBeCalledTimes(1);
        })

        it('should execute the service successfully and return a response', async () => {
            const responseData = {message: 'Success'}
            executeMock.mockResolvedValueOnce(responseData)
            const createMessagecontroller = new CreateMessageController();
            await createMessagecontroller.handle(mockRequest, mockResponse)
            expect(executeMock).toBeCalledTimes(1);
        })
    })
})