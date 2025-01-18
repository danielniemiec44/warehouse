function useCustomFetch(endpoint, method = "GET", body = null) {
    return async () => {
        const response = await fetch(`/api/${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    };
}

export default useCustomFetch;