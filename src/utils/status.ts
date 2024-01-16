// define a consistant json response for all errors and success messages

export const jsonResponse = (
    status: string,
    statusCode: number,
    message: string,
    details?: unknown,
) => {
    return {
        status,
        statusCode,
        message,
        details,
    };
};
