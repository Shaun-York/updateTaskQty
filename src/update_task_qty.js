const {
    GQL_RETRYS
} = require('./config')
const {
    get_current_operation_qty,
    set_current_operation_qty
} = require('./gql.resolvers')

module.exports = async (record, delivery_info) => {
    const TASKS_TABLE_PK = `${record.workorder_id}${record.operation_sequence}`
    const ACTION_QUANITIY = parseInt(record.completedQty)
    const UPDATE_DB = delivery_info === 0

    try {
        const get_current = await get_current_operation_qty(TASKS_TABLE_PK, GQL_RETRYS)

        if (get_current.failed) {
            console.info('get_current_operation_qty, failed')
            throw new Error('get_current_operation_qty, failed')
        } else {
            const new_qty_mk = get_current.qty + ((UPDATE_DB) ? ACTION_QUANITIY : 0)
            console.info('mk ', new_qty_mk, { update_db: UPDATE_DB})
            const set_mk = await set_current_operation_qty(TASKS_TABLE_PK, new_qty_mk, GQL_RETRYS)

            if (set_mk.failed) {
                console.info('set_current_operation_qty, failed')
                throw new Error('set_current_operation_qty, failed')
            } else {
                return {success: true, ...record}
            }

        }
    } catch (error) {
        console.info(error.message)
        throw new Error(error.message)
    }
}