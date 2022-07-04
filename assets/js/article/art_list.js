$(function() {

    var layer = layui.layer
    var laypage = layui.laypage;


    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y+'-'+m+'-'+d+''+hh+':'+mm+':'+ss
    }


    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()

    function initTable(){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败!')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                renderPage(res.total)
            }
        })
    }

    initCate()
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败!')
                }

                var htmlStr = template('tpl-cate', res)

                $('[name=cate_id]').html(htmlStr)

                layui.form.render()
            }
        })
    }

    $('#form-search').on('submit', function(e){
        e.preventDefault()

        var cate_id = $('[name=cate_id]').val()

        var state = $('[name=state]').val()

        q.cate_id = cate_id
        q.state = state



        initTable()

    })

    function renderPage(total) {

        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count','limit', 'prev', 'page', 'next','skip'],
            limits:[2,3,5,10],
            jump: function(obj, first) {
                q.pagenum = obj.curr
            
                q.pagesize = obj.limit
                if(!first){
                    initTable()
                }
            }
        })
    }


    $('tbody').on('click', '.btn-delete', function(){

        var len = $('.btn-delete').length

        var id = $(this).attr('data-id')

        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/'+id,
                success: function(res){
                    if(res.status !== 0){
                        return layui.layer.msg('删除文章失败!')
                    }
                    layui.layer.msg('删除文章成功!')

                    if(len === 1){
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }


                    initTable()
                }
            })
            layer.close(index);
        });
    })



    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {

        

       
        indexEdit = layui.layer.open({
            title: '修改文章',
            type: 1,
            area: ['1350px', '660px'],
            content: $('#dialog-edit').html()
          })


          var layer = layui.layer

          initCate()
            // 初始化富文本编辑器
          initEditor()


          function initCate(){
            $.ajax({
                method: 'GET',
                url: '/my/article/cates',
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('初始化文章类别失败!')
                    }
    
                    let htmlStr = template('tpl-cate', res)
                    $('[name=cate_id]').html(htmlStr)
                    layui.form.render()
                }
            })
        }

              // 1. 初始化图片裁剪器
      var $image = $('#image')
  
      // 2. 裁剪选项
      var options = {
          aspectRatio: 400 / 280,
          preview: '.img-preview'
      }
    
       // 3. 初始化裁剪区域
      $image.cropper(options)
  
  
      $('#btnChooseImage').on('click' ,function() {
          $('#coverFile').click()
      })
  
  
      $('#coverFile').on('change', function(e) {
          var files = e.target.files
          if(files.length === 0){
              return
          }
  
          var newImgURL = URL.createObjectURL(files[0])
  
          $image
          .cropper('destroy')      // 销毁旧的裁剪区域
          .attr('src', newImgURL)  // 重新设置图片路径
          .cropper(options)        // 重新初始化裁剪区域
      })
  
  
          var art_state = '已发布'
  
          $('#btnSave2').on('click', function(){
              art_state = '草稿'
          })
  
          $('#form-pub').on('submit', function(e){
              e.preventDefault()
  
              var fd = new FormData($(this)[0])
  
              fd.append('state', art_state)
  
              $image
              .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                   width: 400,
                   height: 280
              })
              .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                       // 得到文件对象后，进行后续的操作
                       fd.append('cover_img', blob)
                       publishArticle(fd)
               })
          })
  
  
          function publishArticle(fd){
              $.ajax({
                  method: 'POST',
                  url: '/my/article/add',
                  data: fd,
                  contentType: false,
                  processData: false,
                  success: function(res) {
                      if(res.status !== 0){
                          return layer.msg('发布文章失败!')
                      }
  
                      layer.msg('发布文章成功!')
                      location.href = '/article/art_list.html'
                  }
              })
          }
        
        let id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/'+id,
            success: function(res){
                layui.form.val('form-edit', res.data)
            }
        })

    })



})