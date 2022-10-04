<template lang="pug">
#user-profile
  .userbox
    .reportblock
      h1 {{ime}} {{priimek}}'s Profile page
      button.rate-user(v-on:click="setRateUserFocus()")
        span.rate-rext {{rating_message}}
      button.report-user(v-on:click="setReportUserFocus()") {{report_message}}
    .infoblock
      .header-message
        h1 {{prompt}}
      Oglas(v-if="oglasiFocus" v-for="o in userAds" :key="o.id" :ad="o")
      UserRatingWindow(v-if="ratingsFocus" :user_id="userId" :user_name="ime")
      UserReportWindow(v-if="reportFocus" :reported_user_id="userId" :reported_user_name="ime")

</template>

<script>
import UserService from "../services/users"
import AdService from "../services/ad2"
import Oglas from "@/components/Oglas";
import UserRatingWindow from "@/components/UserRatingWindow";
import UserReportWindow from "@/components/UserReportWindow";
export default {
name: "UserProfile",
  components: {UserReportWindow, UserRatingWindow, Oglas},
  data: function(){
    return {
      ime: null,
      priimek: null,
      userId: null,
      ratings: null,
      rating_message: "Ocena: 0",
      report_message: "Report user",
      userAds: null,
      oglasiFocus: true,
      ratingsFocus: false,
      reportFocus: false,
      prompt: null,
      ad_prompt: null,
      report_prompt: null,
      rating_prompt: null,
      average_rating: 0,
    }
  },
  mounted() {
    this.userId = this.$route.params.userId.toString()
    UserService.getUserByID(this.userId, (data) => {
      if(data.message === undefined){
        this.ime = data.name
        this.priimek = data.surname
        this.ratings = data.ratings_list
        this.ad_prompt = this.ime+"'s Ads"
        this.report_prompt = "Why does "+ this.ime+ " deserve to be banned?"
        this.rating_prompt = "Rate "+ this.ime
        if(data.average_rating === undefined){
          this.average_rating = 0
        }else{
          this.average_rating = data.average_rating
        }
        this.setRatingsMessage(this.average_rating.toFixed(2))
        AdService.getUserAds(this.userId, (data) => {
          this.userAds = data
          //this.setRatingsMessage()
        })
      }else{
        this.ime = "Deleted"
        this.priimek = "User"
      }
    })
  },
  methods: {
    resetViews(){
      this.ratingsFocus = false
      this.oglasiFocus = false
      this.reportFocus = false
    },
    setRateUserFocus(){
      this.report_message = "Report user"
      if(this.ratingsFocus){
        this.setOglasiFocus()
        this.setRatingsMessage(this.average_rating)
        //this.setRatingsMessage()
      }else{
        this.prompt = this.rating_prompt
        this.rating_message = "Cancel"
        this.resetViews()
        this.ratingsFocus = true
      }
    },
    setOglasiFocus(){
      this.resetViews()
      this.prompt = this.ad_prompt
      this.oglasiFocus = true
    },
    setReportUserFocus(){
      this.setRatingsMessage(this.average_rating)
      if(this.reportFocus){
        this.report_message = "Report user"
        this.setOglasiFocus()
      }else{
        this.prompt = this.report_prompt
        this.report_message = "Cancel"
        this.resetViews()
        this.reportFocus = true
      }
    },
    setRatingsMessage(avg){
      this.average_rating = parseFloat(avg)
      this.rating_message = "Ocena: "+this.average_rating.toFixed(2)
    }
  }
}
</script>

<style scoped lang="sass">
#user-profile
  .userbox
    margin: auto
    width: 61vw
    padding-top: 10em
  .reportblock
    border-top-left-radius: 0.5em
    border-top-right-radius: 0.5em
    background: green
    line-height: 3.5em
    button, h1, span
      display: inline-block
    h1
      width: 60%
      text-align: center!important
      color: white
    span
      color: black
  .report-user
    background: red
    padding: 0
    margin: 0
    width: 8em
    float: right
  .rate-user
    background: yellow
    padding: 0
    margin: 0
    width: 8em
    float: right
    border-top-right-radius: 0.5em
  .header-message
    background: #f1f1f1
  .infoblock
    padding-top: 0
    height: 30em
    border-bottom-right-radius: 0.5em
    border-bottom-left-radius: 0.5em
    border: 0.3em solid green
    background: white
    overflow: scroll
</style>