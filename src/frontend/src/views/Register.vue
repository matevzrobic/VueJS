<template lang="pug">
#register
  div.register_form.row
    ul.navigation#type_chooser(role="tablist")
      li: a.link.active#sprehajalec(role="tab") Sprehajalec
      li: a.link#lastnik(role="tab") Lastnik
    //TODO split these into two columns
    div.col-6
      label(for="name") Name *
      input.full_width(type="text", placeholder="Your First name", name="name", id="name" v-model="firstName" required)
      label(for="surname") Surname *
      input.full_width(type="text", placeholder="Your Surname", name="surname", id="surname" v-model="lastName" required)
      label(for="phone") Phone number
      input.full_width(type="number", placeholder="Your Phone number", name="phone", id="phone" required)
      label(for="address") Address
      input.full_width(type="text", placeholder="Your Address", name="address", id="address" required)
    div.col-6
      label(for="username") Username
      input.full_width(type="text", placeholder="Your Username", name="username", id="username" required)
      label(for="email") Email *
      input.full_width(type="email", placeholder="Your Email", name="email", id="email" v-model="email" required)
      label(for="password") Password *
      input.full_width(type="password", placeholder="Your Password", name="password", id="password" v-model="pass1" required)
      label(for="password2") Repeat password *
      input.full_width(type="password", placeholder="Repeat password", name="password2", id="password2" v-model="pass2" required)
      button(type="submit" v-on:click="register") Register
    .alert(v-if="required") Please put in the required fields!
    .alert(v-if="diffPass") The passwords do not match!
    .alert(v-if="sameMail") An account with this email address alredy exists!
</template>

<script>
import UserService from '../services/users.ts';
import router from '../router/index.ts'

export default {
  name: "Register",
  data: function() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      pass1: "",
      pass2: "",
      required: false,
      diffPass: false,
      sameMail: false
    }
  },
  methods: {
    register() {
      if(this.firstName.length > 0 && this.lastName.length > 0 && this.email.length > 0 && this.pass1.length > 0 && this.pass2.length > 0 ) {
        this.required = false
        if(this.pass1 === this.pass2) {
          this.diffPass = false
          UserService.createUser({
            name: this.firstName,
            surname: this.lastName,
            email: this.email,
            password: this.pass1
          }, (status) => {
            if (status === 409) {
              this.sameMail = true;
            }
            else if(status === 200) {
              router.push("/");
            }
          })
        }
        else {
          this.diffPass = true
        }
      }
      else {
        this.required = true
      }
    }
  }
}
</script>

<style lang="sass">
#register
  a
    cursor: pointer
.navigation
  background: #008040
  border-radius: 0.2rem
  width: 33%
  float: right
  display: inline-block
.link
  color: #f1f1f1
  border-top-right-radius: 0.2rem
  border-bottom-right-radius: 0.2rem
  height: 1.2em
  &:hover
    background: rgba(0, 0, 0, 0.1)
  &:active
    color: #800040
    border: 0.2em solid #800040
    border-top-left-radius: 0.2rem
    border-bottom-left-radius: 0.2rem
    background: rgba(0, 0, 0, 0.1)

.register_form
  padding-left: 12em
  padding-right: 12em
  padding-top: 2em
  border: 0.2em solid #f1f1f1
.block
  display: block

.full_width
  color: black
</style>