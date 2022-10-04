<template lang="pug">
#report-window
  .reason-why-user-deserves-to-be-banned
    textarea(type="textarea", placeholder="Reasons why this account should be banned", rows="5" id="why-should-be-banned")
  .button-report-box
    button.button-report(id="report_user" v-on:click="sendReport()") Report user
  .message
    p.message-success {{message}}
</template>

<script>
import UserService from "../services/users"
import ReportService from "../services/reports"
export default {
  name: "UserReportWindow",
  props: {
    reported_user_id: String,
    reported_user_name: String
  },
  data: function (){
    return {
      reporting_user_id: null,
      message: null,
    }
  },
  mounted() {
    this.message = null
    var user = UserService.checkLogin()
    if(user!=null){
      this.reporting_user_id = user._id
    }
    //console.log("Reported: "+this.reported_user_id+"\nReporter: "+user_id)
  },
  methods:{
    sendReport(){
      if(this.reported_user_name!="Deleted"){
        const reportReason = document.getElementById("why-should-be-banned").value
        const reportData = {
          reported_account_id: this.reported_user_id,
          reported_by_id: this.reporting_user_id,
          reason: reportReason,
          date: new Date(),
        }
        console.log(JSON.stringify(reportData))
        ReportService.createReport(reportData, response => {
          if(response==201){
            this.message = "Report sent successfully"
          }
        })
      }else {
        this.message = "This user was deleted and cannot be reported"
      }
    }
  }
}
</script>

<style lang="sass" scoped>
#report-window
  .message
    width: 100%
    padding-top: 1em
  .message-success
    color: green
    margin: auto
    text-align: center
  .reason-why-user-deserves-to-be-banned
    width: 100%
    padding: 2em
    resize: none
    textarea
      width: 80%
      resize: none
      outline: none
      display: block
      margin: auto
      border: 0.1em solid black
      border-radius: 0.4em
  .button-report
    width: 75%
    display: block
    margin: auto
    background: red

</style>