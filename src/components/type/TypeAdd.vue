<template>
  <div>

    <el-dialog
      title="新增商品"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="form" :model="type" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="type.name"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </el-form-item>


      </el-form>

    </el-dialog>
  </div>

</template>

<script>
  import axios from "axios"
    export default {
        name: "TypeAdd",
      props:["id"],
      data(){
        return {
          dialogVisible:true,
          type:{pid:""},
          hide:false
        }

      },methods: {
        handleClose(done){
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },add:function () {

          this.type.pid=this.id;
          var athis = this;
          var type = new URLSearchParams(this.type);
         axios.post("http://localhost:8080/port/api/type/add",type).then(function (res) {
             if(res.data.code==200){
                athis.$message("新增成功！")
               athis.dialogVisible=false;
               athis.$emit("childQuery");
             }
         })


        }
      }
    }
</script>

<style scoped>

</style>
