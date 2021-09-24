const getApiResponse = (statusCode, responseBody) => {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseBody)
    };
}

module.exports = getApiResponse