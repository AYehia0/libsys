// define a consistant json response for all errors and success messages

export const jsonResponse = (
    status: string,
    statusCode: number,
    message: string,
    data?: any,
) => {
    return {
        status,
        statusCode,
        message,
        data,
    };
};
