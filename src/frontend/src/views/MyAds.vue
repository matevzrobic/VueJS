<template lang="pug">
#adsTable
    table.adTable
        thead.adTableHead
            tr
                th Title
                th Date created
                th Date needed
                th Location
                th Dogs
                th Status
                th Complete
                th Delete
        tbody
            tr(v-for="ad in userAds")
                td {{ad.title}}
                td {{ad.dateCreated.substring(0, 10)}}
                td {{ad.dateNeeded.substring(0, 10)}}
                td {{ad.location}}
                td
                td {{status(ad.isDone, ad.active)}}
                td
                    button.smallButton(v-on:click="completeAd(ad)")
                td
                    button.smallButton.delete(v-on:click="deleteAd(ad)") X
    span {{message}}
</template>
<script>
import UserService from '@/services/users';
import AdService from '@/services/ad2';
import DogService from "@/services/dogs";

export default {
    data: function() {
        return {
            user: null,
            userAds: [],
            dogNames: [],
            message: ""
        }
    },
    mounted() {
        this.user = UserService.checkLogin();
        AdService.getUserAds(this.user._id, (ads) => {
            this.userAds = ads;
        });
    },
    methods: {
        status (done, active) {
            if (!done && !active) {
                return "Waiting for accept";
            } else if (!done && active) {
                return "In progress";
            } else if (done) {
                return "Done";
            }
        },
        completeAd(ad) {
            if (!ad.active || ad.isDone) {
                this.message = "Only active ads can be marked as completed!";
            } else {
                ad.isDone = true;
                AdService.updateAd(ad._id, {isDone: ad.isDone}, (status, returnAd) => {
                    if (status === 200) {
                        ad = returnAd;
                        console.log(returnAd);
                        this.message = 'Ad successfully updated!'
                    }
                })
            }
        },
        deleteAd(ad) {
            if (ad.active || ad.isDone) {
                this.message = "Only ads that haven't been accepted yet can be deleted.";
            } else {
                AdService.deleteAd(ad._id, (status) => {
                    if (status === 204) {
                        this.message = "Ad successfully deleted.";
                        this.userAds = this.userAds.filter(item => item !== ad);
                        console.log(this.userAds);
                    } else if (status === 404) {
                        this.message = "Ad not found.";
                    } else if(status === 500) {
                        this.message = "Server error. Please try again later.";
                    }
                });
            }
        }
        // getNames(dog_ids) {
        //     let dogNames = "111";
        //     console.log(dog_ids);
        //     for(const id in dog_ids) {
        //         console.log(dog_ids[id]);
        //         let dogName = this.getName(dog_ids[id]);
        //         console.log(dogName);
        //         console.log(dogNames);
        //         dogNames = dogNames.concat(dogName);
        //         dogName.concat(" ");
        //     }
        //     return dogNames;
        // },
        // getName(id) {
        //     let name = "";
        //     DogService.getDogByID(id, (dog, status) => {
        //         if (status === 200 && dog) {
        //            name = dog.name;
        //         }
        //     }).then(console.log(name));
        // }
    }
}
</script>
<style lang="sass">

#adsTable
    .adTable
        margin-top: 2%
        width: 90%
        margin-left: auto
        margin-right: auto
        border: thin black solid
    .adTableHead
        background-color: lightgray
    td
        text-align: center
    .smallButton
        width: 10%
    .delete
        background-color: red

</style>