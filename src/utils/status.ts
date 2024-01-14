// define a consistant json response for all errors and success messages

export const jsonResponse = (
    status: string,
    statusCode: number,
    message: string,
    details?: any,
) => {
    return {
        status,
        statusCode,
        message,
        details,
    };
};
