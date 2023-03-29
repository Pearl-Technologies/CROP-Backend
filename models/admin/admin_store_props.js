const mongoose = require('mongoose');
const adminStoreProp = mongoose.model('admin_store_prop',{
    propId:{type:Number, required:true},
    value:{type:Number, required:true},
    user:{type:mongoose.Schema.Types.ObjectId,
        ref:"admin_admins"        
    }
});

module.exports = adminStoreProp;