<template>
  <div>
    <el-button  size="small" @click="toAdd">新增</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="permissionName"
        label="权限名称"
      >
      </el-table-column>
      <el-table-column
        prop="url"
        label="跳转路径"
      >
      </el-table-column>
      <el-table-column
        prop="perType"
        :formatter="perType"
        label="权限类型">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toUpd(scope.$index, scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="delP(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="权限新增" :visible.sync="showForm "  :before-close="handleClose">
      <el-form ref="form" :model="permission" label-width="80px" >




        <el-form-item label="权限名称">
          <el-input v-model="permission.permissionName" ></el-input>
        </el-form-item>

        <el-form-item label="跳转路径">
          <el-input v-model="permission.url"></el-input>
        </el-form-item>

        <el-form-item label="权限类型">
          <el-radio-group v-model="permission.perType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">目录</el-radio>
          </el-radio-group>
        </el-form-item>




        <el-form-item>
          <el-button @click="closeShow">取 消</el-button>
          <el-button type="primary" @click="perAdd" >点击提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>







  </div>
</template>

<script>
  import axios from "axios";
    export default {
        name: "Permission",
      data(){
          return{
            tableData:[],
            showForm:false,
            permission:{}
          }
      },methods:{
        delP:function(a,b){
          var permissionId=b.permissionId;

          axios.delete("http://localhost:8080/api/per/delP?permissionId="+permissionId).then(res=>{
            if(res.data.code==200){
              this.$message("删除成功！");
            }

          })


        },



        toUpd:function(a,b){
          this.permission=b;
          this.showForm=true;

        },
        perType:function (a,b,c) {
            if(c==1){
              return "菜单";
            }
            if(c==2){
              return "目录"
            }
          },queryPermission:function () {
        axios.get("http://localhost:8080/api/per/queryPermission").then(res=>{
          this.tableData=res.data.data;

        })

          
        },closeShow:function(){
            this.showForm=false;
            this.permission={};

        },toAdd:function () {
            this.showForm=true;

        }, handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },perAdd:function () {

          if(this.permission.permissionId==null){
            var permission = new URLSearchParams(this.permission);
            axios.post("http://localhost:8080/api/per/perAdd",permission).then(res=>{
              if(res.data.code==200){
                this.$message("新增成功！");
                this.closeShow();
                this.queryPermission();
              }

            })

          }else{
            var permission = new URLSearchParams(this.permission);
            axios.post("http://localhost:8080/api/per/perUpd",permission).then(res=>{
              if(res.data.code==200){
                this.$message("修改成功！");
                this.closeShow();
                this.queryPermission();
              }

            })


          }






          
        }
      },created:function () {
        this.queryPermission();
      }
    }
</script>

<style scoped>

</style>
