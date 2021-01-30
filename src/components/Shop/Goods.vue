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
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toUpd(scope.$index, scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="aaa(scope.$index, scope.row)">属性值修改</el-button>
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

    <!-- 修改页面 -->
    <el-dialog title="属性修改" :visible.sync="dialogFormVisible"  :before-close="handleClose">
        <el-form ref="form" :model="goods" label-width="80px" >
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="goods.goodsName" prop="price"></el-input>
          </el-form-item>

          <el-form-item label="商品标题" prop="goodsTitle">
            <el-input v-model="goods.goodsTitle"></el-input>
          </el-form-item>


          <el-form-item label="商品品牌" prop="brandId">
            <el-select v-model="goods.brandId" placeholder="请选择商品品牌">
              <el-option v-for="item in brand" :key="item.brandId" :label="item.brandName" :value="item.brandId"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="商品描述" prop="productdecs">
            <el-input type="textarea" v-model="goods.productdecs"></el-input>
          </el-form-item>


          <el-form-item label="商品主图" >
            <el-upload
              class="avatar-uploader"
              v-model="goods.logo"
              action="http://localhost:8080/api/brand/filePath"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" >
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>



          <el-form-item label="商品售价" prop="price">
            <el-input v-model.number="goods.price"></el-input>
          </el-form-item>

          <el-form-item label="商品库存" prop="stock">
            <el-input v-model.number="goods.stock"></el-input>
          </el-form-item>

          <el-form-item label="商品展示等级" prop="sort">
            <el-input v-model.number="goods.sort"></el-input>
          </el-form-item>


          <el-form-item>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="next" >点击提交</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>




    <el-dialog title="参数修改" :visible.sync="showForm "  :before-close="handleClose">
    <el-form ref="form" :model="goodsAttr" label-width="80px" >
      <el-form-item label="商品分类" >
        <el-select v-model="goodsAttr.typeId" placeholder="请选择商品分类">
          <el-option label="请选择" :value="-1"></el-option>
          <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <div >


        <el-form-item label="商品规格"  v-if="skuData.length>0" >
          <el-form-item v-for="a in  skuData" :key="a.naturId" :label="a.nameCH">

            <el-checkbox-group  v-if="a.type==2 " v-model="a.cks">
              <el-checkbox v-for="b in a.valueData" :key="b.valueId" :label="b.valueNameCH" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form-item>
        <!-- 表单内的表格-->
        <el-table :data="skuDataTable"  border v-if="showTable">

          <el-table-column v-for="t in cksData" :key="t.naturId" :prop="t.natruNameE"  :label="t.nameCH" >

          </el-table-column>
          <el-table-column
            label="库存">

            <template slot-scope="scope">
              <el-input   v-model="scope.row.stock"/>
            </template>

          </el-table-column>
          <el-table-column
            label="价格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"/>
            </template>
          </el-table-column>
        </el-table>


        <el-form-item label="商品参数"  v-if="naturData.length>0" >
          <el-form-item v-for="a  in  naturData" :key="a.naturId" :label="a.nameCH">
            <template slot-scope="scope">

              <el-select v-if="a.type==3 "  placeholder="请选择" v-model="a.cks">
                <el-option v-for="b in a.valueData" :key="b.valueId"  :label="b.valueNameCH" value="b.valueId"></el-option>
              </el-select>

              <el-radio-group v-if="a.type==1 "   v-model="a.cks">
                <el-radio v-for="b in a.valueData" :key="b.valueId" :label="b.valueNameCH" :prop="b.valueNameE"></el-radio>
              </el-radio-group>


              <el-checkbox-group  v-if="a.type==2 " v-model="a.cks">
                <el-checkbox v-for="b in a.valueData" :key="b.valueId" :label="b.valueNameCH"  :prop="b.valueNameE"></el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
        </el-form-item>
      </div>


      <el-form-item>
        <el-button @click="showForm = false">取 消</el-button>
        <el-button type="primary" @click="updValue" >点击提交</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>






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
           ajaxTypeData:[],
           goodUpd:false,
           goods:{goodsId:""},
           imageUrl:"",
           dialogFormVisible:false,
           goodsAttr:{},
           typeName:"",
           types:[],
           naturData:[],
           naturDatas:[],
           skuData:[],
           natur:[],
           cks:[],
           skuDataTable:[],
           cksData:[],
           colData:[],
           showForm:false,
           showTable:false,
           goodsData:[]



         }
      },methods:{
        aaa:function(a,b){
          this.goodsAttr={};
          this.showForm=true;
          this.goodsAttr=b;
          this.queryNaturByTypeId(b.typeId);
          this.queryGoodsValueByGid(b.goodsId);

        },
        queryNaturByTypeId(typeId){
          var athis= this;
          axios.get("http://localhost:8080/api/natur/queryNaturByTypeId?typeId="+typeId).then(function (res) {
            athis.naturDatas=res.data.data.naturData;
          })
        },
        queryGoodsValueByGid:function (goodsId) {
          var athis = this;
          axios.get("http://localhost:8080/GoodsController/queryGoodsValueByGid?goodsId="+goodsId).then(function (res) {
            athis.goodsData=res.data.data;
            athis.naturData=[];
            athis.skuData=[];
            for (var i = 0; i <athis.goodsData.length ; i++) {

               athis.getValue(athis.goodsData[i]);
            }
            console.log(athis.naturData);
          })
        },getValue:function (value) {
          for (var j = 0; j <this.naturDatas.length ; j++) {
            if(value.goodsPrice==null && this.naturDatas[j].isSku!=1){
              //代表这不是SKU属性
              var keys = this.naturDatas[j].natruNameE;
              var obje = JSON.parse(value.valueData);
              this.naturDatas[j].cks=obje[keys];
              this.naturData.push(this.naturDatas[j]);
            }else if(this.naturDatas[j].isSku==1 && value.goodsPrice!=null){
              this.naturDatas[j].cks=this.cks;
                var ku = this.naturDatas[j].natruNameE;
                var objec = JSON.parse(value.valueData);
              this.naturDatas[j].cks.push(objec[ku]);
              this.skuData.push(this.naturDatas[j]);
              }
          }
        }
      ,calcDescartes:function(array) {
          if (array.length < 2) return array[0] || [];
          return [].reduce.call(array, function (col, set) {
            var res = [];
            col.forEach(function (c) {
              set.forEach(function (s) {
                var t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
              })
            });
            return res;
          });
        },
        formaterTypeData:function () {
          var athis = this;
          axios.get("http://localhost:8080/api/natur/queryType").then(function (res) {
            athis.ajaxTypeData=res.data.data;
            athis.getChildrenType();

            for (let i = 0; i <athis.types.length ; i++) {
              athis.typeName=""; // 全局变量   临时存 层级名称
              //处理子节点的name属性
              athis.chandleName(athis.types[i]);
              //   a/b/c/f/d/e
              //给name重新赋值
              athis.types[i].name=athis.typeName.split("/").reverse().join("/").substring(0,athis.typeName.length-1);
            }
          })
        },
        chandleName:function(node){
          if(node.pid!=0){ //临界值
            this.typeName+="/"+node.name;
            //上级节点
            for (let i = 0; i <this.ajaxTypeData.length ; i++) {
              if(node.pid==this.ajaxTypeData[i].id){
                this.chandleName(this.ajaxTypeData[i]);
                break;
              }
            }
          }else{
            this.typeName+="/"+node.name;
          }
        },
        //得到types的数据      遍历所有ajaxtypedata
        getChildrenType:function(){
          //遍历所有的节点数据
          for (let i = 0; i <this.ajaxTypeData.length ; i++) {
            let  node=this.ajaxTypeData[i];
            this.isChildrenNode(node);
          }
        },

        isChildrenNode:function(node){
          let rs=true; //标示
          for (let i = 0; i <this.ajaxTypeData.length ; i++) {
            if(node.id==this.ajaxTypeData[i].pid){
              rs=false;
              break;
            }
          }
          if(rs==true){
            this.types.push(node);
          }
        },
          updValue:function(){
          },
        next() {
          this.$refs.form.validate(valid => {
            if (valid) { //表单验证通过
              this.goodAdd=false;
              this.goodAttr=true;
              if (this.active++ > 1) this.active = 0;
            } else {
              alert("请输入正确格式！");
              return false;
            }
          });
        },upReturn(){
          this.$refs.form.validate(valid => {
            if (valid) { //表单验证通过
              this.goodAdd=true;
              this.goodAttr=false;

              if (this.active-- < 1) this.active = 0;
            } else {
              alert("请输入正确格式！");
              return false;
            }
          });
        },
        queryData:function () {
          var athis = this;
          var naturVo  =new URLSearchParams(naturVo)
          axios.post("http://localhost:8080/api/natur/queryNatur",naturVo).then(function (res) {

          })
        },formaterTypeData:function () {
          var athis = this;
          axios.get("http://localhost:8080/api/natur/queryType").then(function (res) {
            athis.ajaxTypeData=res.data.data;
            athis.getChildrenType();

            for (let i = 0; i <athis.types.length ; i++) {
              athis.typeName=""; // 全局变量   临时存 层级名称
              //处理子节点的name属性
              athis.chandleName(athis.types[i]);
              //   a/b/c/f/d/e
              //给name重新赋值
              athis.types[i].name=athis.typeName.split("/").reverse().join("/").substring(0,athis.typeName.length-1);
            }
          })
        },chandleName:function(node){
          if(node.pid!=0){ //临界值
            this.typeName+="/"+node.name;
            //上级节点
            for (let i = 0; i <this.ajaxTypeData.length ; i++) {
              if(node.pid==this.ajaxTypeData[i].id){
                this.chandleName(this.ajaxTypeData[i]);
                break;
              }
            }
          }else{
            this.typeName+="/"+node.name;
          }
        },
        //得到types的数据      遍历所有ajaxtypedata
        getChildrenType:function(){
          //遍历所有的节点数据
          for (let i = 0; i <this.ajaxTypeData.length ; i++) {
            let  node=this.ajaxTypeData[i];
            this.isChildrenNode(node);
          }
        },
        isChildrenNode:function(node){
          let rs=true; //标示
          for (let i = 0; i <this.ajaxTypeData.length ; i++) {
            if(node.id==this.ajaxTypeData[i].pid){
              rs=false;
              break;
            }
          }
          if(rs==true){
            this.types.push(node);
          }
        },
        queryBrand:function () {
          var athis = this;
          axios.get("http://localhost:8080/GoodsController/queryBrand").then(function (res) {
            athis.brand=res.data.data;

          })

        },
        toUpdValue:function(a,b){



        },
        next:function(){
          var goods = new URLSearchParams(this.goods);
          var athis = this;
          axios.post("http://localhost:8080/GoodsController/updGoods",goods).then(function (res) {
            if(res.data.code==200){
              athis.$message("修改成功！");
              athis.dialogFormVisible=false;

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
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.goods.logo=file.response.filePath;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG 或者 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return (isJPG || isPNG) && isLt2M;
      },
        toUpd:function(a,b){
          this.imageUrl=b.logo;
         this.dialogFormVisible=true;
         this.goods=b;
        },


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

        },
      },created:function () {
        this.queryGoods(this.goodsVo);
          this.queryBrand();
          this.formaterTypeData();


        this.queryBrand();
      },watch:{
        goodsAttr:{//深度监听，可监听到对象、数组的变化
          handler(val, oldVal){
            this.queryNaturByTypeId(val.typeId)

          },
          deep:true
        },
        skuData:{
          handler(val, oldVal){
            this.skuDataTable=[];
            this.colData=[];
            var flag=true;


            for (var i = 0; i <val.length ; i++) {
              if(val[i].cks.length==0){
                flag=false;
                break;
              }
            }
            if(flag==true){
              this.cksData=val;

              for (var i = 0; i <val.length ; i++) {

                this.colData.push(val[i].cks)
              }

              var manyData= this.calcDescartes(this.colData);
              for (var i = 0; i <manyData.length ; i++) {
                var jsonData={};
                for (var j = 0; j <manyData[i].length ; j++) {
                  var key=this.cksData[j].natruNameE;
                  jsonData[key]=manyData[i][j];
                }
                this.skuDataTable.push(jsonData);
              }
            }
            this.showTable=flag;
          },
          deep:true

        }
      }
    }
</script>

<style scoped>


  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 360px;
    height: 178px;
    display: block;}

</style>
