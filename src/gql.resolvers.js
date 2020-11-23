const {
    UPDATE_OPERATION_COMPLETED_QTY,
    GET_COMPLETED_QTY,
} = require('./gql.docs')
const {
    HEADERS,
    GQL,
} = require('./config')
const fetch = require('node-fetch');

const get_current_operation_qty = async (pk, n) => {
    try {
        const get_qty_mk = await fetch(GQL, {
            method: 'POST',
            body: JSON.stringify({
                query: GET_COMPLETED_QTY,
                variables: {
                    internalid: pk
                }
            }),
            headers: HEADERS,
        })
        const {
            data
        } = await get_qty_mk.json()
        const current_qty = parseInt(data.Tasks_by_pk.completedQty)
        const current_input_qty = parseInt(data.Tasks_by_pk.inputQty)
        console.info(`get_current_operation_qty\ndata.Tasks_by_pk\n\n current_qty:${current_qty} current_input_qty:${current_input_qty}`)
        return {
            failed: false,
            qty: current_qty,
            input_qty: current_input_qty,
            data
        }

    } catch (error) {
        if (n > 0) {
            await get_current_operation_qty(pk, n - 1)
        }
        return {
            failed: true,
            qty: 0,
            pk,
            try: n,
            error: error.message,
            message: 'get_current_operation_qty'
        }
    }
}

const set_current_operation_qty = async (pk, qty, n) => {
    try {
        if (isNaN(qty)) {
            throw new Error('Not a Number')
        }
        const updated_qty = await fetch(GQL, {
            method: 'POST',
            body: JSON.stringify({
                query: UPDATE_OPERATION_COMPLETED_QTY,
                variables: {
                    internalid: pk,
                    completedQty: qty.toString()
                }
            }),
            headers: HEADERS
        })
        const update = await updated_qty.json()
        return {
            failed: false,
            data: update
        }
    } catch (error) {
        if (n > 0) {
            await set_current_operation_qty(pk, qty, n - 1)
        } else {
            return {
                failed: true,
                data: error,
                message: 'set_current_operation_qty'
            }
        }
    }
}

module.exports = {
    get_current_operation_qty,
    set_current_operation_qty
}