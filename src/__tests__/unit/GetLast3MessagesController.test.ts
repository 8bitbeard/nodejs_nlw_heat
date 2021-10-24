import { GetLast3MessagesController } from "../../controllers/GetLast3MessagesController"
import { GetLast3MessagesService } from "../../services/GetLast3MessagesService"

jest.mock("../../services/GetLast3MessagesService")

describe('CreateMessageController', () => {
    describe('handle', () => {
        const executeMock = jest.fn();

        beforeAll(() => {
            GetLast3MessagesService.prototype.execute = executeMock;
        })

        beforeEach(async () => {
            jest.resetAllMocks();
        });

        const mockRequest: any = {
            body: {}
        }

        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }

        it('should return an error when the get last 3 messages service raise an exception', async () => {
            executeMock.mockRejectedValueOnce(new Error())
            const getLast3MessagesService = new GetLast3MessagesController();
            await getLast3MessagesService.handle(mockRequest, mockResponse).catch(error => {
                expect(error).toBeInstanceOf(Error)
            })
            expect(executeMock).toBeCalledTimes(1);
        })

        it('should execute the service successfully and return a response', async () => {
            const responseData = {message: 'Success'}
            executeMock.mockResolvedValueOnce(responseData)
            const createMessagecontroller = new GetLast3MessagesController();
            await createMessagecontroller.handle(mockRequest, mockResponse)
            expect(executeMock).toBeCalledTimes(1);
        })
    })
})