<template>
  <div>

    <el-dialog
      title="新增商品"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="form" :model="updType" label-width="80px">

        <el-form-item label="商品名称" >
          <el-input v-model="updType.name"></el-input>
        </el-form-item>

        <el-form-item label="是否上架">
          <el-radio-group v-model="updType.isUp">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="upd">确 定</el-button>
        </el-form-item>


      </el-form>

    </el-dialog>

  </div>






</template>

<script>
  import axios from "axios"
    export default {
        name: "TypeUpd",
      props:["uid"],
      data(){
         return {
           updType:{pid:"",id:""},
           dialogVisible:true,


         }


      },methods:{

        handleClose(done){
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },
        upd:function () {
        var type = new URLSearchParams(this.updType);
        var athis = this;
        axios.post("http://localhost:8080/port/api/type/update",type).then(function (res) {
           if(res.data.code==200){
              this.$message("修改成功！")
             athis.dialogVisible=false;
           }
        })

          
        }
      },created:function () {
          var id = this.uid;
          var athis = this;
        axios.get("http://localhost:8080/port/api/type/getDataByPid?id="+id).then(function (res) {
           athis.updType = res.data.data[0];

           console.log("3213")

        })
      }

    }
</script>

<style scoped>

</style>
