<template lang="pug">
#profile
  #info
    #infoHeader {{firstName}}
    #infoBody
      p(v-if="!editDesc") {{description}}
      textarea.editDescInput( v-if="editDesc" v-model="description" rows="6" cols="100")
    button.editDescriptionButton(v-on:click="editDesc=true" v-if="!editDesc") Edit
    button.editDescriptionButton(v-on:click="editDesc=false" v-if="editDesc") Submit
  br
  #menu
    #menuHeader
      button.button.profile(v-on:click="clickOnProfile()") Profile
      button.button.security(v-on:click="clickOnNewAd()") New Ad
      button.button.myDogs(v-on:click="clickOnMyDogs()") My Dogs
      button.button.myReports(v-on:click="clickOnMyReports()") My Reports
      button.button.myConersations(v-on:click="clickOnMyConvos()") My conversations
    #menuBody
      ProfileWindow(v-if="profileActive" :necessaryInfo="{firstName,lastName}")
      NewAdWindow(v-if="newAdActive")
      MyDogsWindow(v-if="myDogsActive")
      MyReportsWindow(v-if="myReportsActive")
      MyConvosWindow(v-if="myConvosActive")

</template>

<script>
import ProfileWindow from "../components/ProfileWindow.vue";
import NewAdWindow from "../components/NewAdWindow.vue";
import MyDogsWindow from "../components/MyDogsWindow.vue";
import MyReportsWindow from "../components/MyReportsWindow";
import MyConvosWindow from "../components/MyConvosWindow";
export default {
  name: "Profile",
  components: {ProfileWindow, NewAdWindow, MyDogsWindow, MyReportsWindow, MyConvosWindow},
  data: function() {
    return {
      profileActive: true,
      newAdActive: false,
      myDogsActive: false,
      myReportsActive: false,
      myConvosActive: false,
      firstName: "Ime",
      lastName: "Priimek",
      editProfile: false,
      editDesc: false,
      description: "Hi there, I am a dog lover from Slovenia. I love dogs! XD",
    }
  },
  methods: {
    submitChanges() {
      console.log(this.firstName)
    },
    clickOnProfile(){
      this.profileActive = true;
      this.newAdActive = false;
      this.myDogsActive = false;
      this.myReportsActive = false;
      this.myConvosActive = false;
    },
    clickOnNewAd(){
      this.newAdActive = true;
      this.profileActive = false;
      this.myDogsActive = false;
      this.myReportsActive = false;
      this.myConvosActive = false;
    },
    clickOnMyDogs(){
      this.newAdActive = false;
      this.profileActive = false;
      this.myDogsActive = true;
      this.myReportsActive = false;
      this.myConvosActive = false;
    },
    clickOnMyReports(){
      this.newAdActive = false;
      this.profileActive = false;
      this.myDogsActive = false;
      this.myReportsActive = true;
      this.myConvosActive = false;
    },
    clickOnMyConvos(){
      this.myConvosActive = true;
      this.newAdActive = false;
      this.profileActive = false;
      this.myDogsActive = false;
      this.myReportsActive = false;
    }
  }
};

</script>

<style lang="sass">
#profile
  text-align: center

  .editDescriptionButton
    display: inline-block
    width: 10%

  .editDescInput
    color: black
    background-color: lightgray

  #info
    margin-top: 5%
    width: 70%
    display: inline-block

    #infoHeader
      border-color: gray
      border-width: 0.05em
      border-style: solid
      background-color: #008040
      color: white
      line-height: 2em


    #infoBody
      border-color: gray
      border-width: 0.05em
      border-style: solid

      padding-left: 10%
      padding-top: 2%
      padding-bottom: 2%
      text-align: left
      font-size: 0.7em

  #menu
    margin-top: 5%
    width: 70%
    display: inline-block

    #menuHeader
      border-color: gray
      border-width: 0.05em
      border-style: solid
      background-color: #008040
      height: 2em



      .button
        border: none
        display: inline-block
        background-color: #008040
        width: 20%
        height: 2em
        margin-top: 0em
        padding-top: 0.3em

      .button:hover
        cursor: pointer
        color: white
        background: rgba(0, 0, 0, 0.1)

      .button:focus
        color: #800040
        background: rgba(0, 0, 0, 0.1)


    #menuBody
      border-color: gray
      border-width: 0.05em
      border-style: solid
      height: 30em

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
        height: 30em
        display: inline-block

      #basicUserInfo
        border-color: gray
        border-width: 0.05em
        border-style: solid
        display: inline-block
        width: 48.25%
        height: 28.5em
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
        height: 28.5em
        margin-left: auto
        margin-right: 1%
        text-align: right

        .changePasswordTitle
          text-align: left
          margin-left: 2%
          margin-top: 2%

</style>