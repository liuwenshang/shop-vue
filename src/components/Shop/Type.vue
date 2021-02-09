<template>
  <div>

  <TypeAdd v-if="addShow" :id="id" :key="keys" v-on:childQuery="queryZrtree()" ></TypeAdd>
    <TypeUpd v-if="updShow" :uid="uid" :key="da" ></TypeUpd>

    <div class="block">


      <el-tree
        :data="data"
        node-key="id"
        :expand-on-click-node="false"
       >
      <span class="custom-tree-node" slot-scope="{node, data}">
        <span>{{ node.label }}</span>
        <span>
           <el-button type="danger" size="mini" icon="el-icon-folder-add" circle @click="addType(node, data)" ></el-button>
          <el-button type="danger" size="mini" icon="el-icon-set-up" circle @click="update(node, data)" ></el-button>

        </span>
      </span>
      </el-tree>
    </div>





  </div>
</template>

<script>
  import TypeUpd from "../type/TypeUpd"
  import TypeAdd from "../type/TypeAdd"
  import axios from "axios"
    export default {
        name: "Type",
      data() {
        return {
          data:[],
          ajaxData:[],
          jsonStr:"",
          addShow:false,
          checkedNode:[],
          id:"",
          keys:"",
          updShow:false,
          uid:"",
          da:""
        };
      },
      methods: {
        update:function(a,b){
          this.da=Math.random();
          this.uid=b.id;
          this.updShow=true;
        },

          addType:function(node,data){
            this.keys=Math.random();
            this.id=data.id;
            this.addShow=true;

          },
          formatter:function () {
          var arr = this.ajaxData;
          for (var  i = 0; i <arr.length ; i++) {
              if(arr[i].pid==-1){
                var a =arr[i];
                this.dataFor(a);
                break;
              }
          }
          this.data.push(JSON.parse(this.jsonStr));

        },dataFor:function (node) {
          var arr = this.ajaxData;
          var isF = this.isParent(node);
          if(isF==true){
            this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'","children":[';
                var count = 0;
            for (var i = 0; i <arr.length ; i++) {
                 if(node.id==arr[i].pid){
                   count++;
                   this.dataFor(arr[i]);
                   this.jsonStr+=",";
                 }
            }
            if(count!=0){
                      this.jsonStr=this.jsonStr.substr(0,this.jsonStr.length-1);

            }
            this.jsonStr+=']}';

          }else {
            this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'"}';


          }

        },isParent:function (node) {
          var arr = this.ajaxData;
          for (var i = 0; i <arr.length ; i++) {
            if(node.id==arr[i].pid){
              return true;
            }
          }
          return false;


        },queryZrtree:function () {
          var athis = this;
          axios.get("http://localhost:8080/port/api/type/getData").then(function (res) {
            athis.ajaxData=res.data.data;
            athis.formatter();

          })
        }
      },created:function () {
         this.queryZrtree();
      },components:{TypeUpd, TypeAdd}
    };
</script>

<style scoped>

</style>
