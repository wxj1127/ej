<template>
    <div>
        <!-- 按钮 -->
        <el-button type="success" size="small" @click="toAddHandler">添加</el-button>
        <el-button type="danger" size="small">批量删除</el-button>
        <!-- 按钮结束 -->
        <!-- 表格开始 -->
        <el-table :data="addresses">
        <el-table-column prop = "id" label="编号"></el-table-column>
        <el-table-column prop="province" label="省"></el-table-column>
        <el-table-column prop="city" label="市"></el-table-column>
        <el-table-column prop="area" label="地区"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作">
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
            <el-form-item label="编号">
                <el-input v-model="form.id">
                </el-input>
            </el-form-item>
             <el-form-item label="省">
                <el-input v-model="form.province">
                </el-input>
            </el-form-item>
             <el-form-item label="市">
                <el-input  v-model="form.city">
                </el-input>
            </el-form-item>
             <el-form-item label="地区">
                <el-input  v-model="form.area">
                </el-input>
            </el-form-item>
             <el-form-item label="地址">
                <el-input  v-model="form.address">
                </el-input>
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
        loadData(){
             let url = "http://localhost:6677/address/findAll"
        request.get(url).then((response)=>{
            //将查询结果设置到addresses中,this指向外部函数的this
            this.addresses = response.data;
        })
        },
        submitHandler(){
            //通过request与后台进行交互，并携带参数
            let url = "http://localhost:6677/address/saveOrUpdate"
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
            this.form = {
        type:"address"
      }
            this.title="录入员工信息";
            this.visible = true;
        },
        closeModalHandler(){
            this.visible = false;
        },
        toUpdateHandler(row){
            this.title = "更新员工信息";
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
            let url = "http://localhost:6677/address/deleteById?id="+id;
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
            title:"title",
            visible:false,
            addresses:[],
            form:{
                type:"address"
            }
        }

    },
    created(){
        //vue实例创建完毕需要执行的
       this.loadData();
    }
}
</script>
<style scoped>

</style>
