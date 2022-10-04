<template lang="pug">
#message
  .content
    span.circle
    h1(v-show="loaded") {{sender}}
    p(v-show="loaded") {{message_text}}
  .reply-box
    button.reply(v-if="!sent_message" v-on:click="sendMessage()") Reply
</template>

<script>
import MessageService from "../services/messages"
export default {
name: "Message",
  props:{
    message: Object,
    sent_message: Boolean,
  },
  data: function (){
    return {
      loaded: false,
      sender: null,
      message_text: null,
    }
  },
  mounted() {
    if(this.message != undefined){
      //console.log("Message:" + JSON.stringify(this.message))
      this.loaded = true
      this.sender = this.message.sender_id
      this.message_text = this.message.text
    }
  },
  methods: {
    sendMessage(){
      var message = {
        sender_id: this.$parent.getUserId(),
        recipient_id: this.sender,
        text: this.$parent.getInputText()
      }
      MessageService.createMessage(message, response=>{
        //TODO: message created
        this.$parent.refreshSentMessages()
      })
    }
  }
}
</script>

<style scoped lang="sass">
#message
  position: relative
  width: 100%
  height: 6em
  background: #eaeaea
  border: 0.1em solid black
  padding: 0.4em 0.4em 0.4em 2em
  .content
    overflow: hidden
    .circle
      display: block
      height: 4.7em
      width: 4.7em
      background: white
      border-radius: 50%
    h1
      position: absolute
      left: 8em
      top: 1em
    p
      position: absolute
      left: 8em
      top: 3em
  .reply-box
    position: absolute
    right: 0
    bottom: 0
    .reply
      width: 4em
      height: 2em
      background: blue
      border-radius: 0.4em

</style>