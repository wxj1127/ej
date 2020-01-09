<template>
<!-- 员工管理 -->
    <div>
        <!-- 按钮 -->
        <el-button  size="small"  type="primary" @click="toAddHandler">添加</el-button>
        <el-button  size="small" type="danger" >删除</el-button>
        <!-- 按钮结束 -->
        <!-- 表格 -->
        <el-table :data="employees">
        <el-table-column fixed="left" prop = "id" label="编号"></el-table-column>
        <el-table-column fixed="left" prop = "username" label="用户名"></el-table-column>
        <el-table-column prop = "realname" label="姓名"></el-table-column>
        <el-table-column prop = "password" label="密码"></el-table-column>
        <el-table-column prop = "gender" label="性别"></el-table-column>
        <el-table-column width="120" prop = "telephone" label="手机号"></el-table-column>
        <el-table-column width="200" prop = "bankCard" label="银行卡号"></el-table-column>

        <el-table-column fixed="right" label="操作">
            <template v-slot="slot">
                <a href="" @click.prevent="toDeleteHandler(slot.row.id)">删除</a>
                <a href="" @click.prevent="toUpdateHandler(slot.row)">修改</a>

            </template>
        </el-table-column>
        </el-table>
        <!-- 表格结束 -->
        <!-- 分页 -->
        <el-pagination
           layout="prev, pager, next"
          :total="50">
          </el-pagination>
        <!-- 分页 -->
        <!-- 模态框 -->
         <el-dialog
           :title="title"
           :visible.sync="visible"
            width="60%"
          >
          <el-form :model="form" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="form.username">
              </el-input>
            </el-form-item>
             <el-form-item label="密码">
              <el-input type="password" v-model="form.password">
              </el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="form.realname">
              </el-input>
            </el-form-item>
             <el-form-item label="姓别">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
                </el-radio-group>             
            </el-form-item>
             <el-form-item label="手机号" >
              <el-input v-model="form.telephone">
              </el-input>
            </el-form-item>
             <el-form-item label="银行卡号">
              <el-input v-model="form.bankCard">
              </el-input>
            </el-form-item>
          </el-form>
        <span>录入员工信息</span>
        <span slot="footer" class="dialog-footer">
        <el-button size="small"  @click="closeModalHandler">取 消</el-button>
        <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 模态框 -->

    </div>
</template>
<script>
import request from '@/utils/request'
import querystring from 'querystring'
// import { url } from 'inspector';
export default {
   created(){
    //在页面出来的时候加载数据
    this.loadData();
   },
   data(){
       return{
           title:"title",
           visible:false,
           employees:[],
           form:{
             type:"waiter"
           }
           }
          },
       
    methods:{
    submitHandler(){
        let url = "http://localhost:6677/waiter/saveOrUpdate";
        //前端向后台发送请求，完成数据的保存操作
        request({  
          url,
          method:"post",
          //告诉后台我的请求体中放的是查询字符串
          headers:{
           "Content-Type":"application/x-www-form-urlencoded"
          },
          //请求体中的数据，将this.form转换为查询字符串发送给后台
          data:querystring.stringify(this.form)
        }).then((response)=>{
          this.closeModalHandler();
          this.loadData();
          this.$message({          
            type:"success",
            message:response.message
            })
        })
      },
      //重载员工数据
    loadData(){
        let url = "http://localhost:6677/waiter/findAll"
        request.get(url).then((response)=>{
          //箭头函数中的this指向外部函数中的this
          this.employees = response.data;
        })
      },
    closeModalHandler(){
           this.visible=false;
       },
    toAddHandler(){
      this.form = {
        type:"employee"
      }
       this.title="录入员工信息";
       this.visible=true;
       },
    toDeleteHandler(id){

          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            //调用后台接口，完成删除操作。
            let url = "http://localhost:6677/waiter/deleteById?id="+id;
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
        },
    toUpdateHandler(row){
      //模态框表单中显示出当前行的信息
        this.title="更新员工信息";
        this.visible=true;
        this.form = row;
       }
   }

    
}
</script>
<style scoped>

</style>