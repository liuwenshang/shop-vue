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
        <el-button type="text" size="small" @click="roleper(scope.$index, scope.row)">角色赋权</el-button>
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

  <el-dialog title="角色赋权" :visible.sync="showPer"  :before-close="handleClose">

    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      :default-checked-keys="checkNode"
      :expand-on-click-node="false"
      :check-strictly="systemNodeFlag"
      ref="menuTree"
      @check-change="handleCheckChange"
    >
      <span class="custom-tree-node" slot-scope="{node,data}">
        <span>{{ node.label }}</span>
      </span>
    </el-tree>

    <el-button @click="showPer=false">取 消</el-button>
    <el-button type="primary" @click="perRole" >点击提交</el-button>
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
          role:{},
          showPer:false,
          ajaxData:[],
          jsonStr:"",
          data:[],
          checkNode:[],
          systemNodeFlag:true,
          roleId:{},
          ids:[],
        }
      },methods:{
        handleCheckChange:function(){
          let res = this.$refs.menuTree.getCheckedNodes()

          let arr = []

          res.forEach((item) => {

            arr.push(item.id)

          })

          let menuArr = this.unique(arr); // 去除重复的节点

          this.ids = menuArr.join(',')


        },
// 数组去重
        unique (arr) {

          let newArr = []

          let len = arr.length

          for (let i = 0; i < len; i++) {

            if (newArr.indexOf(arr[i]) == -1) {

              newArr.push(arr[i])

            }

          }
          return newArr;

        },
        perRole:function(){

         axios.get("http://localhost:8080/api/role/perRole?roleId="+this.roleId+"&ids="+this.ids).then(res=>{
           if(res.data.code==200){
             this.$message("赋权成功！");
             this.roleId={};
             this.ids=[];
             this.showPer=false;
           }

         })


        },

        roleper:function(a,b){

          this.showPer=true;
          this.data=[];
          this.jsonStr="";
          this.queryPermission();
          this.queryRolePerByRid(b.roleId);


        },queryRolePerByRid:function (roleId) {
          this.roleId=roleId;
          axios.get("http://localhost:8080/api/role/queryRolePerByRid?roleId="+roleId).then(res=>{
            var a = [];
            console.log(res.data.data);
            for (var i = 0; i <res.data.data.length; i++) {
              this.checkNode.push(res.data.data[i].perId);
            }
            this.$refs.menuTree.setCheckedKeys(this.checkNode);
            this.checkNode=[];
            console.log(this.checkNode)

          })


        },queryPermission:function () {
          axios.get("http://localhost:8080/api/per/queryPermission").then(res=>{
            this.ajaxData=res.data.data;
            this.formater();

          })


        },formater:function () {
          var arr = this.ajaxData;
          for (var i = 0; i <arr.length; i++) {
            if(arr[i].pId==0){
              var node=arr[i];
              this.dataFor(node);
              break;
            }


          }
          this.data.push(JSON.parse(this.jsonStr));



        },dataFor:function (node) {
          var isP= this.isParent(node);
          if(isP==true){
            this.jsonStr+='{"id":'+node.permissionId+',"label":"'+node.permissionName+'","children":[';
            var count = 0;
            for (var i = 0; i <this.ajaxData.length ; i++) {
              if(node.permissionId==this.ajaxData[i].pId){
                count++;
                this.dataFor(this.ajaxData[i]);
                this.jsonStr+=",";

              }
            }


            if(count!=0){
              this.jsonStr=this.jsonStr.substr(0,this.jsonStr.length-1);

            }
            this.jsonStr+=']}';

          }else {
            this.jsonStr+='{"id":'+node.permissionId+',"label":"'+node.permissionName+'"}';


          }


        },isParent:function (node) {
          for (var  i = 0; i <this.ajaxData.length ; i++) {
            if(node.permissionId==this.ajaxData[i].pId){

              return true;
            }
          }

          return false;


        },
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
