<template>


<div>

  <el-button  size="small" @click="toAdd">新增</el-button>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="roleName"
      label="角色名称"
    >
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

  <el-dialog title="角色新增" :visible.sync="showForm"  :before-close="handleClose">
    <el-form ref="form" :model="role" label-width="80px" >




      <el-form-item label="角色名称">
        <el-input v-model="role.roleName" ></el-input>
      </el-form-item>


      <el-form-item>
        <el-button @click="closeShow">取 消</el-button>
        <el-button type="primary" @click="roleAdd" >点击提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>



</div>

    
</template>

<script>
  import axios from "axios";
    export default {
        name: "Role",
      data(){
        return{
          tableData:[],
          showForm:false,
          role:{}
        }
      },methods:{
        toAdd:function () {
          this.showForm=true;

        }, handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },closeShow:function(){
          this.showForm=false;
          this.role={};

        },roleAdd:function () {
          if(this.role.roleId==null){
            var role = new URLSearchParams(this.role);
            axios.post("http://localhost:8080/api/role/roleAdd",role).then(res=>{
              if(res.data.code==200){
                this.$message("新增成功！");
                this.closeShow();
                this.queryRole()
              }

            })

          }


          var role = new URLSearchParams(this.role);
          axios.post("http://localhost:8080/api/role/roleUpd",role).then(res=>{
            if(res.data.code==200){
              this.$message("修改成功！");
              this.closeShow();
              this.queryRole();
            }
          })
        },queryRole:function () {
         axios.get("http://localhost:8080/api/role/queryRole").then(res=>{
           this.tableData=res.data.data;

         })


        },toUpd:function (a,b) {
          this.role=b;
          this.showForm=true;

        },delP:function (a,b) {
          this.$confirm("您确定要删除吗","提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(res=>{
            var roleId = b.roleId;
            axios.delete("http://localhost:8080/api/role/delRole?roleId="+roleId).then(res=>{
              if(res.data.code==200){
                this.$message("删除成功！");
                this.queryRole();
              }
            })
          }) .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });









        }


      },created:function () {
        this.queryRole();
      }
    }
</script>

<style scoped>

</style>
