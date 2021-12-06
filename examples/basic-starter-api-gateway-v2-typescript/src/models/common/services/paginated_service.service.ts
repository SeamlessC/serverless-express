class PaginatedService {

    public paginate(start: number, limit: number, length: number) {
        if (!start || start < 0) {
            start = 0;
        }
        if (!limit || limit < 0) {
            limit = 0;
        }

        //  if (start <= length) {
        //     let end : number = 0;
        //     if (limit === 0) {
        //         end = length;
        //     } else if (length > start + limit) {
        //         end = start + limit;
        //     } else {
        //         end = length;
        //     }
        //     return {start , end};
        // }
        const end = limit
        return { start, end }
    }
}
export default new PaginatedService().paginate;