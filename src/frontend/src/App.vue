<template lang="pug">
#app
    #nav
        ul.left
            li: router-link(to='/')
                span.material-icons home
                span Home
            li: router-link(to='/profile')
                span.material-icons account_circle
                span Profile
            li: router-link(to='/ads')
                span.material-icons list
                span My Ads
            li: router-link(to='/help')
                span.material-icons help
                span Help
            li: router-link(to='/reports')
                span.material-icons report
                span Reports
        ul.right(v-if="!loggedIn")
            li: router-link(to='/login')
                span.material-icons login
                span Login
            li: router-link(to="/register")
                span.material-icons add_shopping_cart
                span Register
        ul.right(v-if="loggedIn")
            li.name: span {{firstname}} {{surname}}
            li: router-link(to="/login" v-on:click="logout")
                span.material-icons logout
                span Logout
    router-view
</template>

<script>
import UserService from './services/users';

export default {

    data: function () {
        return {
            loggedIn: false,
            firstname: "",
            surname: ""
        }
    },

    mounted() {
        this.checkLogin();
    },
    methods: {
        logout() {
            UserService.logOut();
            this.firstname = "";
            this.surname = "";
            this.loggedIn = false;
        },
        checkLogin() {
            let user = UserService.checkLogin();
            if (user != null) {
                this.firstname = user.name;
                this.surname = user.surname;
                this.loggedIn = true;
            }
        }
    }
}

</script>

<style lang="sass">
 @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap')
 @import url('https://fonts.googleapis.com/icon?family=Material+Icons')

*
    padding: 0
    margin: 0
    border: 0
    list-style: none
    font: inherit
    color: inherit
    text-decoration: inherit

.material-icons
    font-size: inherit!important
    padding-right: 0.3em
    position: relative
    top: 0.1em

#app
    font-family: 'Open Sans'
    // This is the only place where px is allowed
    // This sets the relative size for em
    font-size: 16px
    // Do not use px anywhere else
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    color: #2c3e50

#nav
    font-size: 150%
    background: #008040
    color: #FFFFFF
    line-height: 2em
    ul.left
        text-align: left
        display: inline-block
    ul.right
        text-align: right
        display: inline-block
        float: right
    li
        display: inline-block
    a
        display: inline-block
        text-align: center
        width: 6em
        line-height: 2em
    a:hover
        cursor: pointer
        color: #800040
        background: rgba(0, 0, 0, 0.1)
</style>
