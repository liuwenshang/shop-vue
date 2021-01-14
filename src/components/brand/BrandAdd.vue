<template>

  <div>

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
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddUser(brand)">确 定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog></div>




</template>

<script>
  import axios from "axios";
    export default {
        name: "BrandAdd",


        data(){

          return {
            brand:{},
            rules: {   //表单验证
              brandName: [{ required: true, message: "请输入品牌名称", trigger: "blur" }, { min: 2, max: 10, message: '长度在 2 到 5 个字符', trigger: 'blur' }],
              isDel: [{  required: true, message: '请选择是否上架', trigger: 'change' }],
              bandE: [{ required: true, message: '请选择英文名称', trigger: 'blur' },{ min: 1, max: 1, message: '信息为一个英文字母', trigger: 'blur' }],
              ord: [{ required: true, message: '级别不能为空' },{ type: 'number', message: '级别必须为数字值'}],
              bandDesc: [{ required: true, message: '请填写品牌描述', trigger: 'blur' },{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }]
            },
            imageUrl:"",
            dialogFormVisible: true,
            count:100
          }

        },methods:{
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
              var brand  = new URLSearchParams(this.brand);

              axios.post("http://localhost:8080/api/brand/addBrand",brand).then(res => {
                this.loading = false;
                this.dialogFormVisible = false;
                this.$message({ message: "添加成功", type: "success" });
                this.$emit('childQuery')
                this.brand={};
                this.imageUrl="";
              });
            } else {
              alert("请输入正确格式！");
              return false;
            }
          });
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
    width: 178px;
    height: 178px;
    display: block;}

</style>
