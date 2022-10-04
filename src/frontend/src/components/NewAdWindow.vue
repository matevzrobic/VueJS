<template lang="pug">
#profileBody
    #helper
    #basicUserInfo
        .userInfoTitle Create a new ad
        .userInfoForm
            form
                button.profileButton(type="button" v-on:click="createAd") Create ad
                br
                label.newAdLabel(for="adTitle") Title:
                input.adInput(type="text", name="adTitle", id="adTitle", v-model="newAdTitle", required)
                br
                label.newAdLabel(for="adLocation") Location:
                select.adInput(name="adLocation" id="adLocation" v-model="newAdLocation")
                    option(v-for="location in locations" :value="location") {{location}}
                br
                label.newAdLabel(for="adDateNeeded") Date needed:
                input.adInput(type="date", name="adDateNeeded", id="adDateNeeded", v-model="newAdDate", required)
                br
                label.newAdLabel(for="adDescription") Description:
                textarea.adInput(cols=45, rows= 7, name="adDescription", id="adDescription", v-model="newAdDescription", required)
            span {{message}}

    #dogListCont
        .dogListTitle Select your dogs
        .dogList
            table.dogTable
                thead.dogTableHead
                    tr.dogTableHead
                        th Name
                        th Breed
                        th Age
                        th Selected
                tbody
                    tr(v-for="dog in userDogs")
                        td {{dog.name}}
                        td {{dog.breed}}
                        td {{dog.age}}
                        td
                            input(type="checkbox", :value="dog._id", v-model="selectedDogsBool[dog._id]")

</template>
<script>
import { defineComponent } from 'vue';
import UserService from '@/services/users';
import DogService from '@/services/dogs';
import AdService from '@/services/ad2';

export default {
    name: 'NewAdWindow',
    data: function () {
        return {
            user: null,
            userDogs: [],
            selectedDogsBool: [],
            selectedDogs: [],
            newAdTitle: '',
            newAdDate: '',
            newAdLocation: '',
            newAdDescription: '',
            message: '',
            locations: [
                'osrednjeslovenska',
                'obalnokraska',
                'primorsko-notranjska',
                'jugovzhodna Slovenija',
                'goriska',
                'gorenjska',
                'zasavska',
                'posavska',
                'savinjska',
                'koroska',
                'podravska',
                'pomurska',
            ]
        };
    },
    mounted() {
        this.user = UserService.checkLogin();
        DogService.getUserDogs(this.user._id, (dogs) => {
            this.userDogs = dogs;
        });
    },
    methods: {
        createAd() {
            this.selectedDogs = [];
            for (const [dog, checked] of Object.entries(
                this.selectedDogsBool
            )) {
                if (checked) {
                    this.selectedDogs.push(dog);
                }
            }
            if (
                this.newAdTitle.length == 0 ||
                this.newAdLocation.length == 0 ||
                this.newAdDate.length == 0 ||
                this.newAdDescription.length == 0 ||
                this.selectedDogs == 0
            ) {
                this.message =
                    'Please put in all the fields and select at least one dog!';
            } else if (new Date(this.newAdDate) <= new Date(Date.now())) {
                this.message =
                    'Please select a date that is greater than today!';
            } else {
                AdService.createAd(
                    {
                        author_id: this.user._id,
                        title: this.newAdTitle,
                        description: this.newAdDescription,
                        dateCreated: Date.now(),
                        dateNeeded: this.newAdDate,
                        location: this.newAdLocation,
                        dog_ids: this.selectedDogs,
                        isDone: false,
                        active: false,
                    },
                    (status, ad) => {
                        if (status === 201) {
                            this.created = true;
                            this.error = false;
                            this.newAdTitle = '';
                            this.newAdDescription = '';
                            this.newAdLocation = '';
                            this.newAdDate = '';
                            this.selectedDogs = [];
                            this.selectedDogsBool = [];
                            this.message = 'Ad successfully created!';
                        } else if (status === 400) {
                            this.message =
                                'There was an error with creating the ad. Please put in all the fields!';
                        }
                    }
                );
            }
        },
    },
};
</script>

<style lang="sass" scoped>

#profileBody
    display: flex
    align-items: center

    .newAdLabel
        margin-right: 1em

    .adInput
        border-color: gray
        border-width: 0.1em
        border-style: solid
        margin-top: 1em
        font-size: 1em
        margin-right: 5em
        text-align: left
        color: black

    .profileButton
        line-height: 0.8em
        width: 25%
        font-size: 1em
        margin-right: 10em
        margin-top: -10%

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

    textarea
        border: thin black solid

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
