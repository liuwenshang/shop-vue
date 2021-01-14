<template>
  <div>





    <el-form :inline="true" :model="brandVo" class="demo-form-inline">
      <el-form-item label="查询">
        <el-input v-model="brandVo.brandName" placeholder="请输入品牌名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"  @click="res">重置</el-button>
        <el-button type="primary" icon="el-icon-search" circle  @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>


    <BrandAdd v-if="addShow" v-on:childQuery="queryBrand(brandVo)" :key="keys"></BrandAdd>


    <el-row>
      <el-button icon="el-icon-zoom-in" circle @click="toAdd"></el-button>
    </el-row>

    <br>
    <el-table
      :data="tableData"
      :row-class-name="tableRowClassName">
      <el-table-column
        prop="brandName"
        label="品牌"
       >
      </el-table-column>
      <el-table-column
        prop="bandDesc"
        label="品牌描述"
        >
      </el-table-column>
      <el-table-column
        prop="ord"
        label="级别">
      </el-table-column>
      <el-table-column
        prop="logo"
        label="品牌商标">
      </el-table-column>

      <el-table-column
        prop="isDel"
        label="是否上架">
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
        prop="bandE"
        label="英文名称">
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



  </div>
</template>

<script>
  import BrandAdd from "../brand/BrandAdd"
  import axios from "axios";
    export default {
        name: "Brand",
      data(){
        return {
          tableData:[],
          page:1,
          pageSizes:[2,3,5],
          count:0,
          size:2,
          brandVo:{startIndex:0,
            size:2},
          addShow:false,
          keys:""


        }
      }, methods: {
        toAdd:function(){
          this.keys=Math.random();
          this.addShow=true;


        },



        res:function(){
          this.brandVo={};
        },

        onSubmit:function(){
          this.brandVo.startIndex= (this.page-1)*this.size;
          this.brandVo.size=this.size
          this.queryBrand(this.brandVo);

        },
        handleSizeChange:function(size){
          this.brandVo.size=size;
          this.brandVo.startIndex= (this.page-1)*this.size;
          this.queryBrand(this.brandVo);

        },handleCurrentChange:function(page){
          this.brandVo.size=this.size;
          this.brandVo.startIndex= (page-1)*this.size;
          this.queryBrand(this.brandVo);

        },
        tableRowClassName({row, rowIndex}) {
          if (rowIndex === 1) {
            return 'warning-row';
          } else if (rowIndex === 3) {
            return 'success-row';
          }
          return '';
        },queryBrand:function (brandVo) {
          var athis = this;
          var brandVo = new URLSearchParams(brandVo);
         axios.post("http://localhost:8080/api/brand/queryBrand",brandVo).then(function (res) {
            athis.tableData=res.data.data.data;
            athis.count=res.data.data.count;

         })

          
        }
      },created:function () {
          this.brandVo.size=this.size;
          this.brandVo.startIndex=(this.page-1)*this.size;
         this.queryBrand(this.brandVo);
          
      },components:{BrandAdd}
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
