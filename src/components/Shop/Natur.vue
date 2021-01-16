<template>

  <div>


    <el-button type="success" round @click="toAdd">属性新增</el-button>
    <el-table
    :data="tableData"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="natruNameE"
      label="英文名称"
    >
    </el-table-column>
    <el-table-column
      prop="nameCH"
      label="中文名称"
    >
    </el-table-column>
    <el-table-column
      prop="typeId"
      label="类型">
    </el-table-column>
    <el-table-column
      prop="type"
      label="展示方式">
    </el-table-column>

    <el-table-column
      prop="isSku"
      label="是否为Sku属性">
    </el-table-column>
    <el-table-column
      prop="isDel"
      label="是否展示">
    </el-table-column>
    <el-table-column
      prop="createDate"
      label="创建时间">
    </el-table-column>
    <el-table-column
      prop="updateDate"
      label="修改时间">
    </el-table-column>
    <el-table-column
      prop="author"
      label="创建人">
    </el-table-column>

    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="toUpd(scope.$index, scope.row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>

    <el-pagination
      align="center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>



    <el-dialog title="属性添加" :visible.sync="dialogFormVisible"  :before-close="handleClose">
      <el-form ref="form"
               :model="natur"
               label-width="80px"
               label-position="left" style="width:400px">

        <el-form-item label="属性名称" >
          <el-input v-model="natur.nameCH"></el-input>
        </el-form-item>

        <el-form-item label="英文名称"  >
          <el-input v-model="natur.natruNameE"></el-input>
        </el-form-item>



        <el-form-item label="属性类型">
          <el-select v-model="natur.typeId" >
            <el-option v-for="type in naturType"
                       :value="type.id"
                       :label="type.name"
            ></el-option>
          </el-select>
        </el-form-item>

          <el-form-item label="展示方式">
            <el-radio-group v-model="natur.type">
              <el-radio :label="1">单选框</el-radio>
              <el-radio :label="2">复选框</el-radio>
              <el-radio :label="3">下拉框</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否为sku" >
            <el-radio-group v-model="natur.isSku">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmAddUser">确 定</el-button>
          </el-form-item>



      </el-form>

    </el-dialog>

    <el-dialog title="属性修改" :visible.sync="updateME"  :before-close="handleClose">
      <el-form ref="form"
               :model="natur"
               label-width="80px"
               label-position="left" style="width:400px">

        <el-form-item label="属性名称" >
          <el-input v-model="natur.nameCH"></el-input>
        </el-form-item>

        <el-form-item label="英文名称"  >
          <el-input v-model="natur.natruNameE"></el-input>
        </el-form-item>



        <el-form-item label="属性类型">
          <el-select v-model="natur.typeId" >
            <el-option v-for="type in naturType"
                       :value="type.id"
                       :label="type.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="展示方式">
          <el-radio-group v-model="natur.type">
            <el-radio :label="1">单选框</el-radio>
            <el-radio :label="2">复选框</el-radio>
            <el-radio :label="3">下拉框</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否为sku" >
          <el-radio-group v-model="natur.isSku">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button @click="updateME = false">取 消</el-button>
          <el-button type="primary" @click="updateNatur">确 定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>


  </div>











</template>

<script>
  import  axios from "axios";
    export default {
        name: "Natur",
      data(){
         return{
           tableData:[],
           page:1,
           pageSizes:[2,3,5],
           count:0,
           size:2,
           naturVo:{startIndex:0,size:2},
           type:[],
           naturType:[],
           dialogFormVisible:false,
           natur:{},
           updateME:false

         }
      },methods:{
        updateNatur:function(){
          var natur = new URLSearchParams(this.natur);
          var athis = this;

          axios.post("http://localhost:8080/api/natur/updateNatur",natur).then(function (res) {
            if(res.data.count==200){
              athis.$message("修改成功！")
              athis.dialogFormVisible=false;
              athis.natur={};
              athis.queryNatur(athis.naturVo)

            }

          })




        },
        toUpd:function(a,b){
          this.updateME=true;
         this.natur=b


        },
        handleSizeChange:function(size){
          this.naturVo.size=size;
          this.naturVo.startIndex= (this.page-1)*this.size;
          this.queryBrand(this.naturVo);

        },handleCurrentChange:function(page){
          this.naturVo.size=this.size;
          this.naturVo.startIndex= (page-1)*this.size;
          this.queryBrand(this.naturVo);

        },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },toAdd:function(){
          this.dialogFormVisible=true;

        },
        confirmAddUser:function(){

          var natur = new URLSearchParams(this.natur);
          var athis = this;
          axios.post("http://localhost:8080/api/natur/addNatur",natur).then(function (res) {
            if(res.data.count==200){
              athis.$message("新增成功！")
              athis.updateME=false;
              athis.natur={};
              athis.queryNatur(athis.naturVo)
            }

          })


        },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },

        queryNatur:function (naturVo) {
          var athis = this;
          var naturVo  =new URLSearchParams(naturVo)
         axios.post("http://localhost:8080/api/natur/queryNatur",naturVo).then(function (res) {
           athis.tableData=res.data.data.data;
         })
        },
        queryType:function () {
          var athis = this;
          axios.get("http://localhost:8080/api/natur/queryType").then(function (res) {
               athis.type=res.data.data;
            for (var i = 0; i <athis.type.length ; i++) {
              if(athis.type[i].pid==-1){
                  athis.diguiType(athis.type[i]);

              }
            }
          })
        },diguiType:function (type) {
           var isP=  this.isParent(type);
          var arr=this.type;
          if(isP==true){
            for (var i = 0; i <arr.length ; i++) {
              if(arr[i].pid==type.id){
                this.diguiType(arr[i]);
              }
            }
          }else{
         this.naturType.push(type);


          }
        },
        isParent:function (type) {
          var arr=this.type;

          for (var  i = 0; i <arr.length ; i++) {
            if(arr[i].pid==type.id){
              return true;
            }
          }

          return false;


        }
      },created:function () {
          this.queryType();
          this.queryNatur(this.naturVo);

        
      }

    }
</script>

<style scoped>

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

</style>
