$(function(){
    initArtCateList()

    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }

    let indexAdd = null
    $('#btnAddCate').on('click',function() {
        indexAdd = layui.layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
          })
    })


    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layui.layer.msg('新增分类失败!')
                }

                initArtCateList()

                layui.layer.msg('新增分类成功!')

                layui.layer.close(indexAdd)
            }
        })
    })


    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        
        indexEdit = layui.layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
          })

        let id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/'+id,
            success: function(res){
                layui.form.val('form-edit', res.data)
            }
        })
    })




    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                  return layui.layer.msg('更新分类数据失败!')
                }
                layui.layer.msg('更新分类数据成功!')

                layui.layer.close(indexEdit)

                initArtCateList()
            }
        })
    })


    $('tbody').on('click', '.btn-delete', function() {
        let id = $(this).attr('data-id')

        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/'+id,
                success: function(res){
                    if(res.status !== 0){
                        return layui.layer.msg('删除分类失败!')
                    }
    
                    layui.layer.msg('删除分类成功!')
                    layer.close(index);
                    initArtCateList()
    
                }
            })
            
            
          });

        
    })


})