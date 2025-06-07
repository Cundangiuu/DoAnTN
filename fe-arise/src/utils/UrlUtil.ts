export const updateSearchParams = (params: URLSearchParams, updates: Record<string, string | null>) => {
    Object.entries(updates).forEach(([key, value]) => {
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
    });
    return params.toString();
};
