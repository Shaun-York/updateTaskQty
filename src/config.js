const GQL = process.env.GQL_SERVER
const HEADERS = {
    'Content-Type': 'application/json',
}
const ACTIONS = {
    MK: 'mk',
    RM: 'rm'
}

const GQL_RETRYS = 4

module.exports = {
    HEADERS,
    ACTIONS,
    GQL_RETRYS,
    GQL,
}