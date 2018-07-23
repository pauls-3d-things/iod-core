
export const defaultFetch = (): RequestInit => {
    return {
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" }
    };
};
