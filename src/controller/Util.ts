import { JsonController, Get } from "routing-controllers";

@JsonController("/api/util")
export class UtilController {
    @Get("/time")
    getTime() {
        return { millis: (new Date()).getTime() };
    }
}
