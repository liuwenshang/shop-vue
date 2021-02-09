<template>
  <div>

    <el-tree
      :data="data"
      node-key="id"
      :expand-on-click-node="false"
    >
      <span class="custom-tree-node" slot-scope="{node, data}">
        <span>{{ node.label }}</span>
        <span>
           <el-button type="danger" size="mini" icon="el-icon-folder-add" circle @click="toAdd(node, data)" ></el-button>
          <el-button type="danger" size="mini" icon="el-icon-set-up" circle @click="update(node, data)" ></el-button>

        </span>
      </span>
    </el-tree>


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
            permission:{},
            data:[],
            jsonStr:"",
            ajaxData:[],
            nodeData:{}

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



        update:function(a,b){
          this.showForm=true;
         var permissionId=b.id;
         axios.get("http://localhost:8080/api/per/queryByPid?permissionId="+permissionId).then(res=>{
           this.permission=res.data.data;

         })

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


        },closeShow:function(){
            this.showForm=false;
            this.permission={};

        },toAdd:function (a,b) {
            this.showForm=true;
            this.permission.pId=a.data.id;


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
                location.reload();
              }

            })

          }else{
            var permission = new URLSearchParams(this.permission);
            axios.post("http://localhost:8080/api/per/perUpd",permission).then(res=>{
              if(res.data.code==200){
                this.$message("修改成功！");
                this.closeShow();
               location.reload();
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
