<template lang="pug">
#reportsTable
    p(v-if="!allow") You do not have permission to view this
    table.reportTable(v-if="allow")
        thead.reportTableHead
            tr
                th Reported by
                th Reported
                th Date
                th Details
        tbody
            tr.border-pls(v-for="report in reports")
                td {{report.reported_by_id}}
                td {{report.reported_account_id}}
                td {{report.date}}
                td
                    button(type="button" v-on:click="showDetails(report)") Show details
                    button.disable-account(v-on:click="disableAccount(report.reported_account_id)") Disable
#reportDetails(v-if="showDetailsBool")
    p Reported:
    p ID: {{reported._id}}
    p Name: {{reported.name}}
    p Surname: {{reported.surname}}
    p Email: {{reported.email}}
    p ___________________________
    p Reported by:
    p ID: {{reportedBy._id}}
    p Name: {{reportedBy.name}}
    p Surname: {{reportedBy.surname}}
    p Email: {{reportedBy.email}}
    p _____________________________
    p Date: {{selectedReport.date.substring(0, 10)}}
    p Reason: {{selectedReport.reason}}
    #buttonCont
        button(v-on:click="hideDetails()") Back to all reports
</template>

<script>
import ReportService from '@/services/reports';
import UserService from '@/services/users';
import reports from "@/services/reports";

export default {
    name: 'Reports.vue',
    data: function() {
        return {
            reports: [],
            showDetailsBool: false,
            selectedReport: null,
            allow: false,
            reported: null,
            reportedBy: null
        }
    }, mounted() {
        var user = UserService.checkLogin()
        if(user !== undefined){
          if(user.role == "admin" || user.role == "moderator"){
            this.allow = true
          }
        }
        ReportService.getReports((status, reports) => {
            if (status === 200) {
                this.reports = reports;
            }
        })
    },
    methods: {
        showDetails(report) {
            UserService.getUserByID(report.reported_account_id, (user, status) => {
                if(status === 200 && user) {
                    this.reported = user;
                }
            });
            UserService.getUserByID(report.reported_by_id, (user, status) => {
                if(status === 200 && user) {
                    this.reportedBy = user;
                    if(user.role == "admin" || user.role == "moderator"){
                      console.log(user.role)
                      this.showDetailsBool = true;
                    }else{
                      console.log("NO PERMISSION")
                    }
                    this.selectedReport = report;
                }
            });
        },
        hideDetails() {
            this.showDetailsBool = false;
            this.selectedReport = null;
            this.reported = null;
            this.reportedBy = null;
        },
        disableAccount(account_id){
          var user = {
            enabled: false,
          }
          UserService.updateUser(user,account_id, response=>{
            console.log(response)
          })
        }
    }
};
</script>

<style lang="sass">
#reportsTable
    .reportTable
        margin-top: 2%
        width: 90%
        margin-left: auto
        margin-right: auto
        border: thin black solid
        tr
          border: 2em solid black
          .disable-account
            background: red
    .reportTableHead
        background-color: lightgray
    td
        text-align: center
#buttonCont
    text-align: center
</style>
