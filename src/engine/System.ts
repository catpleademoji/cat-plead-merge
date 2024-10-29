import { Query } from "./Query";
import QueryResult from "./QueryResult";

export default interface System {
    query: Query[]
    execute: (queryResult: QueryResult) => void 
}
