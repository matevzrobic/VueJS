<template lang="pug">
#rating-window
  .heading
    h1 {{head_text}}
  .radio-box
    label.box(for="1")
      input(type="radio", name="ocena" value="1" id="1")
      span.checkmark 1
    label.box(for="2")
      input(type="radio", name="ocena" value="2" id="2")
      span.checkmark 2
    label.box(for="3")
      input(type="radio", name="ocena" value="3" id="3")
      span.checkmark 3
    label.box(for="4")
      input(type="radio", name="ocena" value="4" id="4")
      span.checkmark 4
    label.box(for="5")
      input(type="radio", name="ocena" value="5" id="5")
      span.checkmark 5
  .optional-comment-box
    textarea.optional-comment(type="textarea" rows="5" placeholder="Optional comment" id="comment")
  .footer
    button.rate-user(v-on:click="sendRating()") rate user
</template>

<script>
import UserService from "../services/users"
export default {
  name: "UserRatingWindow",
  props: {
    user_id: String,
    user_name: String
  },
  data: function (){
    return{
      head_text: "Please provide a rating and a comment justifying it"
    }
  },
  methods:{
    sendRating(){
      if(this.user_name!="Deleted"){
        var user = UserService.checkLogin()
        if(user!=null){
          var userName = user.name
          var ocena = document.querySelector('input[name="ocena"]:checked').value;
          var komentar = document.getElementById("comment").value
          var dataObject = {
            author_name: userName,
            rating: ocena,
            comment: komentar,
          }
          UserService.sendRatingToUser(dataObject,this.user_id, response =>{
            var result = JSON.parse(response)
            //console.log(result.average_rating)
            this.$parent.setRatingsMessage(result.average_rating)
          })
        }else{
          this.head_text="You must be logged in to rate another user!"
        }
      }else{
        console.log("no")
      }
    }
  }
}
</script>

<style scoped lang="sass">
#rating-window
  position: relative
  height: 100%
  .heading
    padding-bottom: 2em
    h1
      text-align: center
  .optional-comment-box
    width: 100%
  .optional-comment
    width: 70%
    display: block!important
    margin: auto
    border: 0.1em solid black
    border-radius: 0.3em
    outline: none
    resize: none
  .radio-box
    width: 100%
    text-align: center
  .radio-box label,input
    display: inline-block
  .box
    font-size: 180%
    display: flex
    position: relative
    cursor: pointer
    -webkit-user-select: none
    padding: 1.3em
    input
      position: absolute
      opacity: 0
      height: 0
      width: 0
      &:checked ~ .checkmark
        background: blue!important
        color: white
    &:hover input ~ .checkmark
      background: #ccc
  .checkmark
    position: absolute
    border-radius: 0.15em
    top: 0
    left: 0
    background: #eee
    height: 2em
    width: 2em
  .footer
    position: absolute
    bottom: 2em
    width: 100%
    left: 0

</style>