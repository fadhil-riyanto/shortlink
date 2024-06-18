export class RouteNotFound extends Error {
    public constructor(name: string, message: string) {
        super();
        this.name = name;
        this.message = message;
    }
}