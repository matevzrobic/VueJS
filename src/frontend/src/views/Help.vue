<template lang="pug">
#helpForm
    form
        label(for="textArea") Your question:
        br
        textarea(name="textArea" id="textArea" rows="10" cols="70" v-model="message" required)
        br
        label(for="name") Your name:
        br
        input( tpye="text" name="name" id="name" v-model="userName" required)
        br
        label(for="email") Your email address:
        br
        input( tpye="text" name="email" id="email" v-model="email" required)
        br
        button(type="button" v-on:click="sendQuestion") Send question
        span(v-if="success") Mail sent succesfully!
        span(v-if="error") Something went wrong :( Please try again later.
</template>

<script>
import MailService from '../services/emailer';

export default {
    name: 'Help',

    data: function () {
        return {
            message: '',
            userName: '',
            email: '',
            success: false,
            error: false,
        };
    },

    methods: {
        sendQuestion() {
            MailService.sendQuestion(
                {
                    message: this.message,
                    userName: this.userName,
                    email: this.email,
                },
                (status) => {
                    if (status === 201) {
                        this.success = true;
                        this.error = false;
                        this.message = "";
                        this.userName = "";
                        this.email = ""
                    } else {
                        this.success = false;
                        this.error = true;
                    }
                }
            );
        },
    },
};
</script>

<style lang="sass">
#helpForm
    form
        margin-left: 2%
        margin-top: 2%
    textarea
        border: thin black solid
        margin-top: 0.1%
    input
        border: thin black solid
        margin-left: 1%
        margin-top: 0.1%
    button
        width: 15%
</style>
