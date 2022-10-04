<template lang="pug">
#login
  div.login_form
    div.image
      span.material-icons pets
    label(for="username") Email
    input.full_width(type="text", placeholder="Enter username", name="username", id="username" v-model="mail" required)
    label(for="password") Password
    input.full_width(type="password", placeholder="Enter password", name="password", id="password" v-model="pass" required)
    button(type="submit" v-on:click="login") Login
    label
      input(type="checkbox", checked="checked", name="rememberMe")
      span Rememeber me
    div.footer
      span.forgot_password Forgot
        a(href="#")  password?
    .alert(v-if="required") Please put in the required fields!
    .alert(v-if="wrongData") Wrong email or password!
</template>

<script>
import UserService from '../services/users.ts';
import router from '../router/index.ts'
import Nav from '../App.vue';

export default {
  name: 'Login',
  data: function() {
    return {
      mail: "",
      pass: "",
      required: false,
      wrongData: false
    }
  },
  methods: {
    login() {
      if(this.mail.length > 0 && this.pass.length > 0 ) {
        this.required = false;
        UserService.login({
          email: this.mail,
          password: this.pass
        }, (status) => {
          if (status === 400 || status === 401) {
            this.wrongData = true;
          }
          else if(status === 200) {
            router.push("/");
            Nav.methods.checkLogin();
            this.wrongData = false;
          }
        })
      }
      else {
        this.required = true;
      }
    }
  }
};
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap')
@import url('https://fonts.googleapis.com/icon?family=Material+Icons')
.material-icons
  //TODO: Make it bigger pls
  font-size: inherit!important
  padding-right: 0.3em
  position: relative
  top: 0.1em
#login
  li
    display: inline-block
  a
    display: inline-block
button
  background: #008040
  color: white
  padding: 0.5em 1em
  margin: 0.4em 0
  border: none
  cursor: pointer
  width: 100%
  &:hover
    opacity: 0.8
.forgot_password
  float: right
  padding-top: 0.8em
.login_form
  padding-left: 12em
  padding-right: 12em
  padding-top: 2em
  border: 0.2em solid #f1f1f1
.footer
  background: #f1f1f1
.full_width
  width: 100%
  padding: 0.5em 1em
  margin: 0.4em 0
  display: inline-block
  border: 0.1em solid #cccccc
  box-sizing: border-box
.image
  text-align: center
  margin: 1em 0 0.5em 0
</style>
