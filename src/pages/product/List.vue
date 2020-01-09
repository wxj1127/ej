<template>
    <div>
        <!-- 按钮 -->
        <el-button type="success" size="small" @click="toAddHandler">添加</el-button>
        <el-button type="danger" size="small">批量删除</el-button>
        <!-- 按钮结束 -->
        <!-- 表格开始 -->
        <el-table :data="products">
        <el-table-column prop = "id" label="编号"></el-table-column>
         <el-table-column prop="name" width="200px" label="产品名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
       <el-table-column prop="description" width="500px" label="描述"></el-table-column>
        <el-table-column prop="categoryId" label="所属栏目"></el-table-column>
            <el-table-column prop="photo" width="650px" label="图片"></el-table-column>

        <el-table-column label="操作" fixed="right">
            <template v-slot="slot">
                <a href=""  @click.prevent="toDeleteHandler(slot.row.id)"><i class="el-icon-delete"></i></a>
                <a href="" @click.prevent="toUpdateHandler(slot.row)"><i class="el-icon-edit-outline"></i></a>
 
            </template>
        </el-table-column>
        </el-table>
        <!-- 表格结束 -->
        <!-- 分页开始 --> 
          <!-- <el-pagination
           layout="prev, pager, next"
          :total="50">
          </el-pagination> -->
         <!-- 分页结束 -->
         <!-- 模态框开始 -->
        <el-dialog
           :title="title"
           :visible.sync="visible"
            width="60%">

          <el-form :model="form" label-width="80px">

             <el-form-item label="产品名称">
                <el-input v-model="form.name">
                </el-input>
            </el-form-item>
             <el-form-item label="价格">
                <el-input  v-model="form.price">
                </el-input>
            </el-form-item>
            
             <el-form-item label="所属栏目">
                <el-select v-model="form.categoryId" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            </el-form-item>

             <el-form-item label="描述">
                <el-input type="textarea" v-model="form.description">
                </el-input>
                 </el-form-item>
            <el-form-item label="图片">
                <el-upload
                    class="upload-demo"
                    action="http://134.175.154.93:6677/file/upload"
                    :file-list="fileList"
                    :on-success="uploadSuccessHandler"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
          </el-form>

        <!-- <span>录入顾客信息信息</span> -->

        <span slot="footer" class="dialog-footer">
        <el-button size="small"  @click="closeModalHandler">取 消</el-button>
        <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 模态框结束 -->
    </div>
</template>
<script>
import request from '@/utils/request'
import querystring from 'querystring'
export default {
    //用于存放网页中需要调用的方法
    methods:{
         //上传成功的事件处理
        uploadSuccessHandler(response){
            console.log(response);
            let photo = "http://134.175.154.93:8888/group1/"+response.data.id
             //将图片设置到form中便于一起提交给后台
            this.form.photo = photo;
            
        },

        loadCategory(){
             let url = "http://localhost:6677/category/findAll"
        request.get(url).then((response)=>{
            //将查询结果设置到products中,this指向外部函数的this
            this.options = response.data;
        })
        },
        loadData(){
             let url = "http://localhost:6677/product/findAll"
        request.get(url).then((response)=>{
            //将查询结果设置到products中,this指向外部函数的this
            this.products = response.data;
        })
        },
        submitHandler(){
            //通过request与后台进行交互，并携带参数
            let url = "http://localhost:6677/product/saveOrUpdate"
            request({
                url,
                method:"POST",
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                data:querystring.stringify(this.form)
            }).then((response)=>{
                //模态框关闭
                this.closeModalHandler();
                this.loadData();
                this.$message({
                    
                    type:"success",
                    message:response.message
                })
            })
        },
        toAddHandler(){
             this.fileList = [];

            this.form = {
                 // type:"product"
        }
            this.title="录入员工信息";
            this.visible = true;
        },
        closeModalHandler(){
            this.visible = false;
        },
        toUpdateHandler(row){
           this.fileList = [];
          this.title = "更新产品信息";
          this.visible = true;
          this.form = row;
        },
        toDeleteHandler(id){
            //确认
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            //调用后台接口，完成删除操作。
            let url = "http://localhost:6677/product/deleteById?id="+id;
            request.get(url).then((response)=>{
                //1.刷新数据
                this.loadData();
                 //2.提示结果
                this.$message({
                type: 'success',
                message: response.message+id
            });  
          })
        })
        }
    },
    //要想网页中显示的数据
    data(){
        return{
            options: [],
            

            title:"title",
            visible:false,
            products:[],
            form:{
        
                // type:"product"
            },
            fileList:[]
        }

    },
    created(){
        //vue实例创建完毕需要执行的
       this.loadData();
       this.loadCategory();
    }
}
</script>
<style scoped>

</style>
