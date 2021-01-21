<template>
  <div style="padding-left: 350px">

    <el-card class="box-card" >
      <div  class="text item ">
        <el-steps :active="active" finish-status="success"  >
          <el-step title="填写商品信息">  </el-step>
          <el-step title="填写商品属性" > </el-step>
        </el-steps>

        <el-form ref="form" :model="goods" label-width="80px" :rules="rules" v-show="goodAdd">
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
            <el-button type="primary" @click="next(goods)" >下一步,填写商品属性</el-button>
          </el-form-item>
        </el-form>
      </div>





    <!--这是商品属性 -->
      <el-form ref="form" :model="goodsAttr" label-width="80px" :rules="rules" v-show="goodAttr">
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
          <el-button type="primary" @click="upReturn" >返回上一页</el-button>
          <el-button type="primary" @click="addGoods" >提交</el-button>
        </el-form-item>
      </el-form>

    </el-card>

  </div>


</template>

<script>
  import axios from "axios"
    export default {
        name: "GoodsAdd",
      data(){
       return {

         path:"/goodsAttr",
         active:0,
         goods:{},
         goodAdd:true,
         goodAttr:false,
         goodsAttr:{},
         naturVo:{startIndex:0,size:2},
         tableData:[],
         typeName:"",
         types:[],
         ajaxTypeData:[],
         naturData:[],
         naturDatas:[],
         skuData:[],
         natur:[],
         cks:[],
         skuDataTable:[],
         cksData:[],
         colData:[],
         imageUrl:"",
         brand:[],
         showTable:false,
         rules:{
           goodsName: [{ required: true, message: "请输入商品名称", trigger: "blur" }, { min: 2, max: 10, message: '长度在 2 到 5 个字符', trigger: 'blur' }],
           goodsTitle: [{ required: true, message: "请输入商品标题", trigger: "blur" }, { min: 2, max: 10, message: '长度在 2 到 5 个字符', trigger: 'blur' }],
           brandId: [{  required: true, message: '请选择商品品牌', trigger: 'change' }],
           price: [{ required: true, message: '价格不能为空' },{ type: 'number', message: '价格必须为数字值'}],
           stock: [{ required: true, message: '库存不能为空' },{ type: 'number', message: '库存必须为数字值'}],
           sort: [{ required: true, message: '级别不能为空' },{ type: 'number', message: '级别必须为数字值'}],
           productdecs: [{ required: true, message: '请填写商品描述', trigger: 'blur' },{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }]
         }
       }
      },  methods: {
        addGoods:function(){
          this.goods.typeId=this.goodsAttr.typeId;
          var naturJson={};
          for (var i = 0; i <this.naturData.length ; i++) {

               naturJson[this.naturData[i].natruNameE]=this.naturData[i].cks;
          }
          this.goods.skuDataTable=JSON.stringify(this.skuDataTable);
            this.goods.noSkuData=JSON.stringify(naturJson);

             var goods = new URLSearchParams(this.goods);
                  var athis=this;
          axios.post("http://localhost:8080/GoodsController/addGoods",goods).then(function (res) {
             if(res.data.code==200){
                athis.$message("新增成功！")

             }
          })
          


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
        calcDescartes:function(array) {
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
            athis.tableData=res.data.data.data;
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
        },queryNaturByTypeId(typeId){
          var athis= this;
          axios.get("http://localhost:8080/api/natur/queryNaturByTypeId?typeId="+typeId).then(function (res) {
                 athis.naturDatas=res.data.data.naturData;
                 athis.naturData=[];
                 athis.skuData=[];
            for (var i = 0; i <athis.naturDatas.length ; i++) {
              athis.naturDatas[i].cks=athis.cks;
              if(athis.naturDatas[i].isSku==1){
                    athis.skuData.push(athis.naturDatas[i]);
              }else{
                athis.naturData.push(athis.naturDatas[i]);
              }

            }


          })
        },queryBrand:function () {
            var athis = this;
          axios.get("http://localhost:8080/GoodsController/queryBrand").then(function (res) {
               athis.brand=res.data.data;

          })

        }

      },created:function () {
        this.queryData();
        //处理类型数据
        this.formaterTypeData();

        this.queryBrand();
      },watch:{
        goodsAttr:{//深度监听，可监听到对象、数组的变化
          handler(val, oldVal){
            this.queryNaturByTypeId(val.typeId)
            console.log(val, oldVal);
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

  .text {
    font-size: 14px;
  }



  .box-card {
    width: 500px;
  }
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
