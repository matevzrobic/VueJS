<template lang="pug">
#profileBody
    #helper
    #basicUserInfo
        .userInfoTitle Basic info
        .userInfoView(v-if="!editProfile")
          p First Name: {{firstName}}
          p Last Name: {{lastName}}
          p Email address: {{email}}
          form.changeButton
            button.profileButton(v-on:click="editProfile = true") Change
        span {{message}}
        .userInfoForm(v-if="editProfile")
          form(v-if="editProfile")
              label.profileLabel(for="firstName") First Name:
              input.profileInput(type="text", name="firstName", id="firstName", v-model="firstNameInput", required)
              br
              label.profileLabel(for="lastName") Last Name:
              input.profileInput(type="text", name="lastName", id="lastName", v-model="lastNameInput", required=true)
              br
              label.profileLabel(for="email") Last Name:
              input.profileInput(type="text", name="email", id="email", v-model="emailInput", required=true)
              br
              button.profileButton(type="button" v-on:click="changeInfo") Change
              br
              span.profileButton(v-if="required") Please put in all the fields!

    #changePassword
        .changePasswordTitle Change Password
        .changePasswordForm
            form
                label.profileLabel(for="newPass1") New Password:
                input.profileInput(type="password", name="newPass1", id="newPass1" required="true" v-model="newPass1")
                br
                label.profileLabel(for="newPass2") Repeat Password:
                input.profileInput(type="password", name="newPass2", id="newPass2" required="true" v-model="newPass2")
                br
                button.profileButton( type="button" v-on:click="changePassword") Change
                br
                span.profileButton(v-if="changedPass") Your password has been changed.
                span.profileButton(v-if="diffPass") The passwords do not match.
                span.profileButton(v-if="requiredPass") Please put in all the fields!
                span.profileButton(v-if="error") There was an error with changing your password. Please try again later!
    
</template>
<script>
import { defineComponent } from 'vue'
import UserService from '../services/users'

export default {
    name: "ProfileWindow",
    props: {
      necessaryInfo: Object,
    },
    data: function() {
        return {
            editProfile: false,
            required: false,
            changedPass: false,
            requiredPass: false,
            diffPass: false,
            error: false,
            firstName: "",
            lastName: "",
            email: "",
            firstNameInput: "",
            lastNameInput: "",
            emailInput: "",
            newPass1: "",
            newPass2: "",
            message: ""
        }
    },
    mounted() {
        this.user = UserService.checkLogin();
        if(this.user != null) {
            this.firstName = this.user.name;
            this.lastName = this.user.surname;
            this.email = this.user.email;
            this.firstNameInput = this.user.name;
            this.lastNameInput = this.user.surname;
            this.emailInput = this.user.email;
        }
    },
    methods: {
        changeInfo() {
            if(this.firstName.length > 0 && this.lastName.length > 0) {
                this.required = false;
                this.editProfile = false;
                this.user.name = this.firstNameInput;
                this.user.surname = this.lastNameInput;
                this.user.email = this.emailInput;
                UserService.updateUser(this.user, this.user._id, (status) => {
                    if(status === 200) {
                        console.log(this.user);
                        this.user = UserService.checkLogin();
                        console.log(this.user);
                        this.firstName = this.user.name;
                        this.lastName = this.user.surname;
                        this.email = this.user.email;
                        this.message = "Your profile was successfully updated!"
                    } else {
                        this.message = "An account with this email address already exists!"
                    }
                });
            }
            else {
                this.required = true;
            }
        },
        changePassword() {
            if(this.newPass1.length > 0 && this.newPass2.length > 0) {
                if(this.newPass1 == this.newPass2) {
                    UserService.updateUser({
                        email: this.user.email,
                        password: this.newPass1
                    }, this.user._id,  (status) => {
                        if(status === 200) {
                            this.changedPass = true;
                        }else {
                            this.error = true;
                        }
                    });
                    this.newPass1 = "";
                    this.newPass2 = "";
                    this.requiredPass = false;
                    this.diffPass = false;
                }
                else {
                    this.diffPass = true;
                    this.changedPass = false;
                    this.requiredPass = false;
                }
            }
            else {
                this.requiredPass = true;
                this.changedPass = false;
                this.diffPass = false;
            }
        }
    }
}
</script>

<style lang="sass" scoped>

    #profileBody
      display: flex
      align-items: center

      .profileLabel
        font-size: 1em
        margin-right: 1em


      .profileInput
        border-color: gray
        border-width: 0.1em
        border-style: solid
        margin-top: 1em
        font-size: 1em
        margin-right: 10em
        text-align: left
        color: black

      .profileButton
        line-height: 0.8em
        width: 25%
        font-size: 1em
        margin-right: 10em
        margin-top: 2%

      #helper
        height: 20em
        display: inline-block

      #basicUserInfo
        border-color: gray
        border-width: 0.05em
        border-style: solid
        display: inline-block
        width: 48.25%
        height: 18.5em
        margin-left: 1%
        text-align: right

        p
          margin-top: 0.8em
          text-align: left
          margin-left: 15%

        .userInfoTitle
          text-align: left
          margin-left: 2%
          margin-top: 2%

      #changePassword
        border-color: gray
        border-width: 0.05em
        border-style: solid
        display: inline-block
        width: 48.25%
        height: 18.5em
        margin-left: auto
        margin-right: 1%
        text-align: right

    .changePasswordTitle
          text-align: left
          margin-left: 2%
          margin-top: 2%
</style>
