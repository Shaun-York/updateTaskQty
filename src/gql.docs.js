const GET_COMPLETED_QTY = `
        query completedQty($internalid: String!) {
            Tasks_by_pk(internalid: $internalid) {
                completedQty
                inputQty
            }
        }
    `;
const UPDATE_OPERATION_COMPLETED_QTY = `
        mutation newCompetedQty($internalid: String!, $completedQty: String!){ 
            update_Tasks_by_pk(
                pk_columns: {internalid: $internalid}, 
                _set: {completedQty: $completedQty}){
                    internalid
                    completedQty
                }
        }`

module.exports = {
    UPDATE_OPERATION_COMPLETED_QTY,
    GET_COMPLETED_QTY,
}