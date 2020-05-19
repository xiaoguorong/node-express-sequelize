function getOne(table_name,condition_field = 'id',query_fields = '*'){
    console.log(table_name)
    return 'select '+query_fields+' from '+table_name+' where '+condition_field+' =?'
}
function getAll(table_name,query_fields = '*'){
    return 'select '+query_fields+' from '+table_name
}
function insert(table_name,fields = []){
    var str;
    var mark;
    fields.forEach(e=>{
        str+=',`'+e+'`';
        mark+=',?'
    })
    return 'insert into `'+table_name+'` (`id`'+str+') values(0'+mark+')'
}
function update(table_name,query_fields = '*',condition_field = 'id'){
    return 'select '+query_fields+' from '+table_name+' where '+condition_field+' =?'
}
function del(table_name,condition_field = 'id'){
    return 'delete from '+table_name+' where '+condition_field+'=?'
}
module.exports={
    getOne,
    getAll,
    insert,
    update,
    del
}