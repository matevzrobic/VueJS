<template lang="pug">
#oglas
  div.card
    div.header
      img.dog(:src="ad.image")
      .title {{ad.title}}
      .meta
        router-link(:to="{ name: 'UserProfile', params: { userId: ad.author_id}}") {{ad.author_id}}
        |  posted {{formattedTime}}


    div.body {{ad.description}}
    div.footer
      .meta region: {{ad.location}}
      .meta when: {{ad.dateNeeded}}
      .meta {{formatDogs}}
  button.prijavi_se(v-on:click="sendApplication()", :style="{background:this.button_color}") {{application_message}}
</template>

<script>
import * as moment from 'moment';
import AdService from '../services/ad2';
import UserService from '../services/users';
import MessageService from "../services/messages"
export default {
        name: 'Oglas',
        data: function () {
                return {
                        application_message: 'Prijavi se',
                        button_color: 'green',
                };
        },
        props: {
                ad: Object,
        },
        computed: {
                formattedTime: function () {
                        return moment(this.ad.dateCreated).fromNow();
                },
                formatDogs: function () {
                        let dog = 'dogs: ';
                        console.log(this.ad.dogs)
                        for( const i in this.ad.dogs){
                                console.log(i);
                                if(i==0){
                                        dog = dog + `${this.ad.dogs[i]["name"]}(${this.ad.dogs[i]["breed"]})`;
                                }else{
                                        dog = dog + `, ${this.ad.dogs[i]["name"]}(${this.ad.dogs[i]["breed"]})`;
                                }
                                //console.log(`, ${this.ad.dogs[i]["name"]}(${this.ad.dogs[i]["breed"]})`)
                        }
                        console.log(dog)
                        return dog;
                }
                //TODO: formatirat datum na lepsi nacin
                /*formattedTimeAsigned: function() {
      return moment(this.ad.dateNeeded).fromNow()
    }*/
        },
        methods: {
                sendApplication() {
                        if (!this.ad.done) {
                                var user = UserService.checkLogin();
                                if (user != null) {
                                        const adId = this.ad.ad_id;
                                        const data = {
                                                active: true,
                                        };
                                        AdService.updateAd(
                                                adId,
                                                data,
                                                (response) => {
                                                        if (response == 200) {
                                                                this.application_message =
                                                                        'Prijava oddana';
                                                                this.button_color =
                                                                        'orange';
                                                        } else {
                                                                this.application_message =
                                                                        'Nemogoče';
                                                        }
                                                }
                                        );
                                        var message = {
                                          sender_id: user._id,
                                          recipient_id: this.ad.author_id,
                                          text: user._id + " se je prijavil"
                                        }
                                        MessageService.createMessage(message, response => {
                                          console.log(response)
                                        })
                                } else {
                                        alert('najprej se morete prijaviti');
                                }
                        } else {
                                this.application_message = 'Nemogoče';
                        }
                },
        },
        mounted() {
                if (this.ad.done) {
                        this.application_message = 'Končano';
                        this.button_color = 'red';
                } else if (this.ad.active) {
                        this.application_message = 'Pending';
                        this.button_color = 'orange';
                }
                //TODO: poglej če ima ad že prijavo in ga obarvaj/disablaj pravilno
        },
};
</script>

<style lang="sass">
*
  margin: 0
  padding: 0
  box-sizing: border-box
#oglas
  width: 15em
  border: 0.2em solid #f1f1f1
  margin: 0.4em
  float: left
  .card
    position: relative
    width: 100%
    height: 16em
    display: inline-block
    $img-size: 4em
    .header
      overflow: hidden
      text-align: right
      border: none
      background: #f1f1f1
      width: 100%
      height: 3em
      color: #800040
      padding-left: $img-size
      min-height: $img-size
      position: relative
      img.dog
        border-radius: 10%
        height: $img-size
        width: $img-size
        position: absolute
        left: 0
        top: 0
        float: left
        object-fit: cover
    .footer
      position: absolute
      height: 4em
      overflow: scroll
      bottom: 0
      width: 100%
      -ms-overflow-style: none
      scrollbar-width: none
    .body
      padding: 1em
      overflow: scroll
      -ms-overflow-style: none
      scrollbar-width: none
  .inline
    display: inline-block
  .meta
    font-size: 60%
    margin-right: 1em
    margin-top: 0.2em
  .dog
    width: 3em
  .left
    text-align: left
</style>
