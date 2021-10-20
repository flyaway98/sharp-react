const Mock = require('mockjs');
const Random = Mock.Random;
module.exports = {
    '/api/getUser': (method,queryObj,bodyObj)=>{
        return {
            id: Random.integer(1,100),
            text:`request method:${method},id:${queryObj.id}`
        }
    },
    '/api/update': {
        success:true,
        msg:'hello world'
    }
}