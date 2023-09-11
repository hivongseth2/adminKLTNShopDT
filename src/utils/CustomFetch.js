const CustomFetch = async (path, method, body, headers) => {
  try {
    const url = process.env.REACT_APP_API_ENDPOINT + path;
    console.log(url);
    const requestOptions = {
      method,
      headers,
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export { CustomFetch };
