<template>
  <div >
    <img src="../../assets/p0.png">
    <div id="box">

    </div>
    <div id="input_box">
      <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <p>Register</p>
        <a-form-item
            label="Name"
            name="name"
            :rules="[
                {validator:nameValidator,trigger:'change'}
                ]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item
            label="Phone"
            name="phone"
            :rules="[
                {validator:phoneValidator,trigger:'change'}
                ]"
        >
          <a-input v-model:value="formState.phone" />
        </a-form-item>

        <a-form-item
            label="Password"
            name="password"
            :rules="[{validator:passwordValidator}]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <!--        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">-->
        <!--          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>-->
        <!--        </a-form-item>-->

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
        Or
        <router-link to="/login">Login now!</router-link>
      </a-form>
      {{formState.username}}
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { Modal } from 'ant-design-vue';
import router from "@/router";
export default {
  name: "signup",
  data(){
    return {
      formState:{
        name:"",
        phone:"",
        password:"",
      },
    }
  },
  components: {

  },
  methods:{
    modal_click(){
      this.modal_visible =false
    },
    phoneValidator(ruleObj,v){
      if (!v) return Promise.reject('please input phone number')
      for(let i=0;i<v.length;i++){
        // console.log(v[i])
        if (v[i]>'9'||v[i]<'0')  return Promise.reject('Please input digits')
      }
      if(v.length!=11) return  Promise.reject('phone number length must be 11')
      return Promise.resolve()
    },
    passwordValidator(ruleObj,v){
      if(!v) return Promise.reject('password would not be empty' )
      return Promise.resolve()
    },
    nameValidator(ruleObj,v){
      if(!v) return Promise.reject('name would not be empty' )
      return Promise.resolve()
    }
    ,
    onFinish (values){
      console.log('validator');
      console.log('submiting');
      request(
          {
            url:'/signup',
            method: 'post',
            data: {
              "name": this.formState.name,
              "phone": this.formState.phone,
              "password": this.formState.password,
            }
          }).then(
          res => {
            if (res.data.code!=200){
              // alert(res.data.message)
              let msg =  res.data.message
              Modal.error({
                title:"Warning",
                content:msg,
              });
              return
            }
            // console.log(res.data.data)
            let msg = res.data.message+"     click below button to login"
            Modal.success({
              title:'Congratulations',
              content: msg,
              onOk(){
                router.replace("/login")
              }
            })
            // this.$store.commit('setUserInfo',)
            // console.log(this.$store.getters.getUserInfo)
            // console.log(this.$store.getters.getToken)
          }
      ).catch(err => {console.log("err",err)})
      console.log('finished');
    },
    onFinishFailed(errorInfo){
      console.log('Failed:', errorInfo);
    },
  },

}
</script>

<style scoped>
p{
  font-size: xx-large;
  text-align: center;
}

img{
  position: fixed;
}
#input_box{
  /*height: 100%;*/
  /*width: 100%;*/
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%,-50%);
}
#box{
  position: absolute;
  height: 100%;
  width: 100%;
  /*background-color: blanchedalmond;*/
  backdrop-filter: blur(18px);
}
</style>
