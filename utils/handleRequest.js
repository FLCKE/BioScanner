const bcrypt = require('bcryptjs');
function verifyDataNotFound(data, res){
    if (!data) {
        return res.status(404).json({ message: 'Data not  found now' });
    }
    res.status(200).json(data);
}
async function hashData(data){
    if (!data) {
        return ;
    }
    const passwordHash = await bcrypt.hash(data, 10);
    return passwordHash;
}
async function compareData(data, hash) {
    if (!data || !hash) {
        return false;
    }
    const isMatch = await bcrypt.compare(data, hash);
    return isMatch;
}   
module.exports = {
    verifyDataNotFound,
    hashData,
};