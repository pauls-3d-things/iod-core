import { Response } from "node-fetch";

export const basicAuth = (user: string, pass: string) => {
    return {
        "Authorization": "Basic " + new Buffer(user + ":" + pass).toString("base64")
    };
};

export const defaultHeaders = () => {
    return {
        ...basicAuth("admin", "admin"),
        "Content-Type": "application/json"
    };
};

export const defaultRequest = (method: string) => {
    return {
        method,
        headers: { ...defaultHeaders() }
    };
};

export const api = (path: string) => {
    const url = "http://localhost:8087" + path;

    if (process.env.DEBUG === "1") {
        console.log(url);
    }
    return url;
};

export const resp2json = (response: Response) => {
    return response.json();
};

export const arrayToPgArrayString = (values: string[] | undefined) => {
    return values ? "{" + values.join(",") + "}" : "{}";
};

export const logJson = (json: any) => {
    console.log(json);
    return json;
};
