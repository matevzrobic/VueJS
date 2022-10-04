<template lang="pug">
#profileBody
    #helper
    #basicUserInfo
        .userInfoTitle Add a new dog
        .userInfoForm
            form
                label.profileLabel(for="dogName") Name:
                input.profileInput(type="text", name="dogName", id="dogName", v-model="newDogName", required)
                br
                label.profileLabel(for="dogBreed") Breed:
                //input.profileInput(type="text", name="dogBreed", id="dogBreed", v-model="newDogBreed", required)
                input.profileInput(id='dogBreed' name="dogBreed" type="text" v-model="newDogBreed" list="breed" required)
                datalist(id='breed')
                    option(v-for="r in breeds") {{r}}
                    
                br
                label.profileLabel(for="dogAge") Age:
                
                input.profileInput(type="number", name="dogAge", id="dogAge", v-model="newDogAge", required)
                br
                button.profileButton(type="button" v-on:click="addDog") Add dog
                
            span {{message}}

    #dogListCont
        .dogListTitle Your Dogs
        .dogList
            table.dogTable
                thead.dogTableHead
                    tr.dogTableHead
                        th Name
                        th Breed
                        th Age
                tbody
                    tr(v-for="dog in userDogs")
                        td {{dog.name}}
                        td {{dog.breed}}
                        td {{dog.age}}

</template>
<script>
import { defineComponent } from 'vue';
import DogService from '../services/dogs';
import UserService from '../services/users';

export default {
    name: 'MyDogsWindow',

    data: function () {
        return {
            newDogName: '',
            newDogBreed: '',
            newDogAge: 0,
            user: null,
            userDogs: null,
            message: '',
            breeds: []
        };
    },
    methods: {
        addDog() {
            if (
                this.newDogName.length > 0 &&
                this.newDogBreed.length > 0 &&
                this.newDogAge >= 0
            ) {
                DogService.createDog(
                    {
                        owner_id: this.user._id,
                        name: this.newDogName,
                        age: this.newDogAge,
                        breed: this.newDogBreed,
                    },
                    (status, dog) => {
                        if (status === 201) {
                            this.message = "Dog successfully added."
                            console.log(this.userDogs);
                            this.userDogs.push(dog);
                            console.log(this.userDogs);
                            this.newDogBreed = '';
                            this.newDogName = '';
                            this.newDogAge = 0;
                        } else if (status === 400) {
                            "Error. Please put in all the fields."
                        }
                    }
                );
            } else {
                this.message = "Please put in all the fields.";
            }
        },
    },
    mounted() {
        this.user = UserService.checkLogin();
        DogService.getBreeds((dogs) => {
            this.breeds = dogs["breed_list"];
        });
        console.log(this.breeds)
        DogService.getUserDogs(this.user._id, (dogs) => {
            this.userDogs = dogs;
        });
    },
};
</script>

<style lang="sass" scoped>


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
    height: 20em
    display: inline-block

  #basicUserInfo
    border-color: gray
    border-width: 0.05em
    border-style: solid
    display: inline-block
    width: 48.25%
    height: 18.5em
    margin-left: 1%
    text-align: right

    p
      font-size: 0.8em
      margin-top: 0.8em
      text-align: left
      margin-left: 15%

    .userInfoTitle
      text-align: left
      margin-left: 2%
      margin-top: 2%

#dogListCont
    border-color: gray
    border-width: 0.05em
    border-style: solid
    display: inline-block
    width: 48.25%
    height: 28.5em
    margin-left: auto
    margin-right: 1%
    text-align: right

    .dogListTitle
        text-align: left
        margin-left: 2%
        margin-top: 2%

    .dogList
        margin-top: 2%

    .dogTable
        width: 100%
        text-align: center

    thead, th
        border: thin solid black
</style>
