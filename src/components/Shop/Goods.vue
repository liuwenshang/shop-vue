<template>

  <div>

    <el-form :inline="true" :model="goodsVo" class="demo-form-inline">
      <el-form-item label="名称查询">
        <el-input v-model="goodsVo.goodsName" placeholder="请输入品牌名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" circle type="primary" @click="onSubmit" ></el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="goodsName"
        label="商品名称"
        >
      </el-table-column>
      <el-table-column
        prop="goodsTitle"
        label="商品标题"
        >
      </el-table-column>
      <el-table-column
        prop="brandId"
        :formatter="brandId"
        label="商品品牌">
      </el-table-column>
      <el-table-column
        prop="productdecs"

        label="商品描述">
      </el-table-column>
      <el-table-column
        prop="price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="stock"
        label="商品库存">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="商品等级">
      </el-table-column>
      <el-table-column
        prop="typeId"
        :formatter="typeId"
        label="商品类型">
      </el-table-column>
      <el-table-column
        prop="logo"
        label="品牌商标">
        <template slot-scope="scorp">
          <img :src="scorp.row.logo" style= "width: 50px;">
        </template>
      </el-table-column>
    </el-table>
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="sizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>


</template>

<script>
  import axios from "axios"
    export default {
        name: "Goods",
      data(){
         return{
          tableData:[],
           count:0,
           pageSize:2,
           sizes:[2,3,5],
           page:1,
           goodsVo:{startIndex:0,size:2},
           brand:[],
           ajaxTypeData:[]



         }
      },methods:{
        typeId:function(a,b,c){
          for (var i = 0; i <this.ajaxTypeData.length ; i++) {
            if(c==this.ajaxTypeData[i].id){
              return this.ajaxTypeData[i].name;
            }

          }



        },
        brandId:function(a,b,c){
          for (var i = 0; i <this.brand.length ; i++) {
            if(c==this.brand[i].brandId){
              return this.brand[i].brandName;
            }

          }



        },

        queryBrand:function () {
          var athis = this;
          axios.get("http://localhost:8080/GoodsController/queryBrand").then(function (res) {
            athis.brand=res.data.data;
          })
        },
      onSubmit:function(){
        this.goodsVo.startIndex= (this.page-1)*this.pageSize;
        this.goodsVo.size=this.pageSize
        this.queryGoods(this.goodsVo);

      },
          queryGoods:function () {
            var goodsVo = new URLSearchParams(this.goodsVo);
            var athis = this;
            axios.post("http://localhost:8080/GoodsController/queryGoods",goodsVo).then(function (res) {
              athis.tableData = res.data.data.data;
              athis.count=res.data.data.count;

            })


          },
        handleSizeChange:function(size){
          this.goodsVo.size=size;
          this.goodsVo.startIndex= (this.page-1)*this.pageSize;
          this.queryGoods(this.goodsVo);

        },handleCurrentChange:function(page){
          this.goodsVo.size=this.size;
          this.goodsVo.startIndex= (page-1)*this.pageSize;
          this.queryGoods(this.goodsVo);

        },formaterTypeData:function () {
        var athis = this;
        axios.get("http://localhost:8080/api/natur/queryType").then(function (res) {
          athis.ajaxTypeData=res.data.data;
        })
      },

      },created:function () {
        this.queryGoods(this.goodsVo);
          this.queryBrand();
          this.formaterTypeData();





      }
    }
</script>

<style scoped>

</style>
