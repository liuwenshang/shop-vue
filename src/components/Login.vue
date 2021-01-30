<template>
      <div style="margin-top:15%; margin-left:40%;">


        <div class="login_box">
          <!-- 登录logo区域 -->
          <div class="avator_box">
            <div class="wave"></div>
          </div>
          <!-- 登录表单区域 -->
          <el-form class="form_wrapper" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" name="username" placeholder="Username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.passWord" type="password" name="passWord" placeholder="passWord"></el-input>
            </el-form-item>
            <input type="button" class="btn" value="Login" @click="confirmAddUser">
            <!--<div class="btn">Login</div>-->
            <div class="msg">
              Don't have account?
              <el-button type="info" @click='zhuce'>Sign up</el-button>
            </div>
          </el-form>
        </div>v



  <!-- ---------------------------------------------- 这是注册---------------------------------------------------------------------- -->
  <el-dialog title="用户注册" :visible.sync="dialogFormVisible"  :before-close="handleClose">
    <el-form ref="form" :model="user" label-width="80px" >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="user.userName" prop="price"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="user.passWord" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="user.realName"></el-input>
      </el-form-item>


      <el-form-item label="学历" prop="eduId">
        <el-select v-model="user.eduId" placeholder="请选择学历">
          <el-option v-for="item in edu" :key="item.eduId" :label="item.eduName" :value="item.eduId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所在部门" prop="deptId">
        <el-select v-model="user.deptId" placeholder="请输入用户所在部门">
          <el-option v-for="item in dept" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="user.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="user.phone"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="user.email"></el-input>
      </el-form-item>

      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="user.idCard"></el-input>
      </el-form-item>

      <el-form-item label="出生日期" >
      <el-date-picker
        v-model="user.birthday"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        placeholder="请选择出生日期">
      </el-date-picker>
      </el-form-item>


      <el-form-item label="商品主图" >
        <el-upload
          class="avatar-uploader"
          v-model="user.imgUrl"
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
        <el-button @click="noZhuCe">取 消</el-button>
        <el-button type="primary" @click="next" >点击提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

    </div>
</template>

<script>
  import axios from "axios";
export default {
    data() {
        return {
            loginFormRules:{
                // 一个数组是一个校验规则，数组名就是要验证的属性名，不可改
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                 ],
              passWord:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
                ]
            },
          dialogFormVisible:false,
          user:{},
          imageUrl:"",
          dept:[],
          edu:[],
          loginForm:{},
        }
    },
    methods:{

      confirmAddUser:function () {
        this.$refs.loginFormRef.validate(valid => {
          if (valid) { //表单验证通过
            this.loading = true;
            axios.post("http://localhost:8080/api/user/login?userName="+this.loginForm.username+"&passWord="+this.loginForm.passWord).then(res => {
              if(res.data.code==400){
                this.$message("用户不存在！")
              }
              if(res.data.code==500){
                this.$message("密码错误!")
              }
              if(res.data.code==200){
                this.$message("登录成功！")
              }

            });
          } else {
            this.$message("请输入正确的格式！")

            return false;
          }
        });
      },
      noZhuCe:function(){
        this.dialogFormVisible=false;
        this.user={};
        this.imageUrl="";

      },
      zhuce:function(){
       this.dialogFormVisible=true;

},
      next:function(){
        var athis = this;
        var user = new URLSearchParams(this.user);
        axios.post("http://localhost:8080/api/user/addUser",user).then(function (res) {
          if(res.data.code==300){
            athis.$message("用户名已存在！请重新输入！")
          }
          if(res.data.code==200){
            athis.$message("注册成功！");
            athis.user={};
            athis.imageUrl="";
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
        this.user.imageUrl=file.response.filePath;
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
      },queryDept:function () {
        var athis = this;
        axios.get("http://localhost:8080/api/user/queryDept").then(function (res) {
          athis.dept=res.data.data;

        })


      },queryEdu:function () {
        var athis=this;
        axios.get("http://localhost:8080/api/user/queryEdu").then(function (res) {
          athis.edu=res.data.data;

        })

      }
    },created:function () {
      this.queryDept();
      this.queryEdu();

  }
}
</script>

<style>

  .login_box {
    width: 350px;
    height: 400px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);}

  .avator_box, .wave {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    position: absolute;
    left: 50%;
  }

  .avator_box {
    border: 1px solid #fff;
    padding: 5px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 0 10px #faf8ff;
  }

  .wave {
    /*background-color: #9bd7ff;*/
    background: linear-gradient(to left, #86a8e7, #91eae4);
    overflow: hidden;
    transform: translate(-50%)
  }

  .wave:after {
    content: '';
    width: 130px;
    height: 130px;
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -55%);
    border-radius: 40%;
    animation: wave 5s linear infinite;
  }

  .wave::before {
    content: 'RX';
    position: absolute;
    left: 50%;
    top: 0;
    background-image: -webkit-linear-gradient(45deg, #86a8e7, #ee9ca7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 20px;
    z-index: 99;
    transform: translate(-50%, 25px)
  }

  @keyframes wave {
    100% {
      transform: translate(-50%, -55%) rotate(360deg);
    }
  }

  .form_wrapper {
    width: 100%;
    height: 250px;
    position: absolute;
    bottom: 5px;
    display: block;
    box-sizing: border-box;
    padding: 0 30px;
  }

  /*.input_item, el-form-item {*/
  /*    display: block;*/
  /*    width: 100%;*/
  /*    margin-bottom: 20px;*/
  /*    border: 0;*/
  /*    padding: 5px;*/
  /*    border-bottom: 1px solid #a4a3a8;*/
  /*    font-size: 15px;*/
  /*    !*text-transform: uppercase;*!*/
  /*    outline: none;*/
  /*    box-sizing: border-box;*/
  /*}*/

  .btn {
    display: block;
    width: 100%;
    height: 30px;
    text-align: center;
    padding: 2px;
    margin-top: 50px;
    background: linear-gradient(to left, #86a8e7, #91eae4);
    border: 0;
    border-radius: 2px;
    box-shadow: 0 0 5px #c9cfcd;
    color: #fff;
    font-size: 15px;
    box-sizing: border-box;
    outline: none;
    cursor: pointer;
  }

  .msg {
    text-align: center;
    line-height: 40px;
    box-sizing: border-box;
    font-size: 12px;
  }

  a {
    text-decoration: none;
    color: #86a8e7;
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
