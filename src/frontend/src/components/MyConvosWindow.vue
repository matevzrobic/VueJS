<template lang="pug">
#convosBody
  .recieved-messages
    h1.heading Recieved messages
    Message(v-if="recLoaded" v-for="o of received_messages" :key="o._id" :message="o")
  .sent-messages
    h1.heading Sent messages
    Message(v-if="senLoaded" v-for="o of sent_messages" :key="o._id" :message="o" :sent_message="true")
  .input-box
    input#message(placeholder="Your message" name="message_text" v-model="message_text")
    
</template>
<script>
import MessageService from "../services/messages"
import UserService from "../services/users"
import { defineComponent } from 'vue'
import Message from "@/components/Message.vue";

export default {
    name: "MyConvosWindow",
  components: {Message},
  data: function (){
    return {
      user_id: null,
      received_messages: null,
      sent_messages: null,
      recLoaded: false,
      senLoaded: false,
      message_text: null
    }
  },
  mounted() {
    var user = UserService.checkLogin()
    if(user!==undefined){
      this.user_id = user._id
      //get received messages
      MessageService.getReceivedMessages(this.user_id, response => {
        this.received_messages = response
        this.recLoaded = true
      })
      //get sent messages
      MessageService.getSentMessages(this.user_id, response => {
        this.sent_messages = response
        this.senLoaded = true
      })
    }else{
      //TODO: kontrola napake
    }
  },
  methods: {
      getUserId(){
        return this.user_id
      },
      getInputText(){
        return this.message_text
      },
      refreshSentMessages(){
        MessageService.getSentMessages(this.user_id, response => {
          this.sent_messages = response
          this.senLoaded = true
        })
      }
  }
}
</script>

<style lang="sass" scoped>
#convosBody
  .recieved-messages, .sent-messages
    width: 48.5%
    overflow: scroll
    border: 0.1em solid black
    margin: 0.5em
    .heading
      background: #eaeaea
    &::-webkit-scrollbar
      visibility: hidden
  .recieved-messages
    height: 26.5em
    float: left
  .sent-messages
    height: 29em
    float: right
  .input-box
    float: left
    width: 35em
    padding-left: 0.5em
    input
      padding-left: 1em
      width: 104%
      border: 0.1em solid black
      outline: none
</style>