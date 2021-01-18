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
        <template slot-scope="scorp">
          <img :src="scorp.row.logo" style= "width: 50px;">
        </template>



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


    <el-dialog title="品牌添加" :visible.sync="dialogFormVisible"  :before-close="handleClose">
      <el-form ref="form"
               :model="brand"
               label-width="80px"
               :rules="rules"
               label-position="left" style="width:400px">

        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="brand.brandName"></el-input>
        </el-form-item>

        <el-form-item label="英文名称" prop="bandE" >
          <el-input v-model="brand.bandE"></el-input>
        </el-form-item>

        <el-form-item label="品牌级别" prop="ord" >
          <el-input v-model.number="brand.ord"></el-input>
        </el-form-item>

        <el-form-item label="品牌描述" prop="bandDesc" >
          <el-input type="textarea" v-model="brand.bandDesc" maxLength='100'></el-input>

        </el-form-item>




        <el-form-item label="是否上架" prop="isDel">
          <el-radio-group v-model="brand.isDel">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="品牌Logo" >
          <el-upload
            class="avatar-uploader"
            v-model="brand.logo"
            action="http://localhost:8080/api/brand/filePath"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddUser(brand)">确 定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>










  </div>
</template>

<script>
  import BrandAdd from "../brand/BrandAdd"
  import axios from "axios";
    export default {
        name: "Brand",
      data(){
        return {
          rules: {   //表单验证
            brandName: [{ required: true, message: "请输入品牌名称", trigger: "blur" }, { min: 2, max: 10, message: '长度在 2 到 5 个字符', trigger: 'blur' }],
            isDel: [{  required: true, message: '请选择是否上架', trigger: 'change' }],
            bandE: [{ required: true, message: '请选择英文名称', trigger: 'blur' },{ min: 1, max: 1, message: '信息为一个英文字母', trigger: 'blur' }],
            ord: [{ required: true, message: '级别不能为空' },{ type: 'number', message: '级别必须为数字值'}],
            bandDesc: [{ required: true, message: '请填写品牌描述', trigger: 'blur' },{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }]
          },
          tableData:[],
          page:1,
          pageSizes:[2,3,5],
          count:0,
          size:2,
          brandVo:{startIndex:0,
            size:2},
          addShow:false,
          keys:"",
          dialogFormVisible:false,
          brand:{brandId:""},
          imageUrl:""
        }
      }, methods: {

        toUpd:function(index,row){
          this.dialogFormVisible=true;
          this.imageUrl=row.logo;
            this.brand=row;

        },
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
        handleAvatarSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
          this.brand.logo=file.response.filePath;
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
        }, handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },confirmAddUser:function (brand) {
          this.$refs.form.validate(valid => {
            if (valid) { //表单验证通过
              console.log(brand); //form就是form表单对象
              this.loading = true;
              var brand = new URLSearchParams(this.brand);
              axios.post("http://localhost:8080/api/brand/updBrand",brand).then(res => {
                this.loading = false;
                this.dialogFormVisible = false;
                this.$message({ message: "修改成功！", type: "success" });
                this.queryBrand(this.brandVo);
                this.imageUrl="";
              });
            } else {
              alert("请输入正确格式！");
              return false;
            }
          });
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
       handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
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
