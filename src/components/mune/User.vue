<template>
  <div>
    <el-table
      :data="tableData"
     >
      <el-table-column
        prop="userName"
        label="用户名"
        >
      </el-table-column>
      <el-table-column
        prop="realName"
        label="用户真实名称"
       >
      </el-table-column>
      <el-table-column
        prop="sex"
        label="用户性别"
        :formatter="sex">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证号">
      </el-table-column>
      <el-table-column
        prop="eduId"
        label="学历"
        :formatter="eduId">
      </el-table-column>
      <el-table-column
        prop="deptId"
        label="用户部门"
        :formatter="deptId">
      </el-table-column>
      <el-table-column
        prop="imgUrl"
        label="用户头像">
        <template slot-scope="scorp">
          <img :src="scorp.row.imgUrl" style= "width: 50px;">
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="userRole(scope.$index, scope.row)">用户赋角</el-button>

        </template>
      </el-table-column>/

    </el-table>

    <el-dialog title="角色赋权" :visible.sync="showForm"  :before-close="handleClose">
      <el-form ref="form" :model="userrole" label-width="80px" >
        <el-form-item label="角色选择">
          <el-checkbox-group v-model="userrole.roleIds">
            <el-checkbox :label="2">青铜会员</el-checkbox>
            <el-checkbox :label="3">白银会员</el-checkbox>
            <el-checkbox :label="4">黄金会员</el-checkbox>
            <el-checkbox :label="5">白金会员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="closeForm">取 消</el-button>
          <el-button type="primary" @click="roleAdd" >点击提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
  import axios from "axios";
    export default {
        name: "User",
      data(){
         return {
            tableData:[],
           dept:[],
           edu:[],
           showForm:false,
           userrole:{roleIds:[]},
           userId:[]
         }
      },methods:{



        closeForm:function(){
          this.userrole={roleIds:[]};
          this.showForm=false;
        },
        roleAdd:function(){
          axios.get("http://localhost:8080/api/user/roleAdd?userId="+this.userId+"&roleIds="+this.userrole.roleIds).then(res=>{
            if(res.data.code==200){
              this.$message("用户赋角成功！");
              this.closeForm();
            }
          })
        },
         sex:function (a,b,c) {
           if(c==1){
             return "男"
           }
           if(c==0){
             return "女"
           }

         }, handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },eduId:function (a,b,c) {
          for (let i = 0; i <this.edu.length ; i++) {
            if(c==this.edu[i].eduId){
              return this.edu[i].eduName;
            }
          }

        },deptId:function (a,b,c) {
          for (let i = 0; i <this.dept.length ; i++) {
            if(c==this.dept[i].deptId){
              return this.dept[i].deptName;
            }

          }
        }
         ,queryDept:function () {
          var athis = this;
          axios.get("http://localhost:8080/api/user/queryDept").then(function (res) {
            athis.dept=res.data.data;

          })


        },queryEdu:function () {
          var athis=this;
          axios.get("http://localhost:8080/api/user/queryEdu").then(function (res) {
            athis.edu=res.data.data;

          })

        },userRole:function (a,b) {
         this.showForm=true
          this.queryRoleByUserId(b.userId)
          this.userId=b.userId;


        },queryRoleByUserId:function (userId) {
          axios.get("http://localhost:8080/api/user/queryRoleByUserId?userId="+userId).then(res=>{
              this.userrole.roleIds=res.data.data;
              console.log(this.userrole);

          })
        }

      },created:function () {
        axios.get("http://localhost:8080/api/user/queryUser").then(res=>{
              this.tableData=res.data.data;
        })
        this.queryDept();
        this.queryEdu();



      }
    }
</script>

<style scoped>

</style>
