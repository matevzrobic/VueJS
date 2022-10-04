<template lang="pug">


#home
  #intro
    p hello world
  #cont
    #filter
      h1 Filter
      form
        .row
          label from:
            input(type="date" v-model="from")
        .row
          label to:
            input(type="date" v-model="to")
        .row
          label region:
            fieldset(required)
              .option(v-for="r in regions" )
                input(type="checkbox" :id="r" v-on:click="onClickReg")
                label(:for="r") {{r}}
        .row
          label breed:
            fieldset(required)
              .option(v-for="r in breeds")
                input(type="checkbox" :id="r" v-on:click="onClickBreed")
                label(:for="r") {{r}}
        

    #grid: div(:key="gridKey")
        oglas(v-for="o in filteredAds" :key="o.id" :ad="o")

</template>

<script>
import Oglas from '@/components/Oglas';
import AdsService from '../services/model.ts';
import UserService from '@/services/users';
import DogService from '@/services/dogs';
//import Vue from 'vue';

//this.forceUpdate();

export default {
        from: '',
        to: '',
        name: 'Domov',
        components: { Oglas },
        data: function () {
                return {
                        gridKey: 1,
                        regions: [
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
                        ],
                        regions_dict: {
                                osrednjeslovenska: true,
                                obalnokraska: true,
                                'primorsko-notranjska': true,
                                'jugovzhodna Slovenija': true,
                                goriska: true,
                                gorenjska: true,
                                zasavska: true,
                                posavska: true,
                                savinjska: true,
                                koroska: true,
                                podravska: true,
                                pomurska: true,
                        },
                        breeds: [],
                        breeds_dict: {},
                        number: 15,
                        from: Date(),
                        to: Date(),
                        ads: [],
                };
        },
        mounted() {
                DogService.getDogs((dogs) => {
                        this.from = '';
                        this.to = '';
                        const mySet1 = new Set();

                        for (const dog in dogs) {
                                //console.log(dogs[dog]);
                                mySet1.add(dogs[dog].breed);
                        }
                        this.breeds = Array.from(mySet1);
                        for (const i in this.breeds) {
                                this.breeds_dict[this.breeds[i]] = true;
                        }
                        //console.log(mySet1);
                        //console.log(this.breeds_dict)
                });
                AdsService.getAds((ads) => {
                        //console.log(ads)
                        for (const ad in ads) {
                                let dicto = {
                                        ad_id: ads[ad]._id,
                                        description: ads[ad].description,
                                        author_id: ads[ad].author_id,
                                        done: ads[ad].isDone,
                                        active: ads[ad].active,
                                        author: 'placeholder',
                                        title: ads[ad].title,
                                        dateCreated: ads[ad].dateCreated,
                                        dateNeeded: ads[ad].dateNeeded,
                                        location: ads[ad].location,
                                        dogs: [],
                                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREr1B7ZACTg_A3KXh-rxX31KH3_lbzeitVrg&usqp=CAU"
                                };
                                for (const dog in ads[ad].dog_ids) {
                                        //console.log()
                                        DogService.getDogByID(
                                                ads[ad].dog_ids[dog],
                                                (doggo) => {
                                                        //console.log(doggo.breed)
                                                        /*dicto.dogs.push(
                                                                doggo.breed
                                                        );*/
                                                        //TODO popup za pese prikazat
                                                        dicto.dogs.push({
                                                                breed: doggo.breed,
                                                                name: doggo.name,
                                                        });
                                                }
                                        );
                                }

                                UserService.getUserByID(
                                        ads[ad].author_id,
                                        (user) => {
                                                //console.log(user)
                                                dicto.author = user.name;
                                        }
                                );

                                this.ads.push(dicto);
                        }
                        //this.ads = ads;
                });
                //TODO naredit neko default sliko za oglase brez slike
                //console.log(this.ads);
        },
        watch: {
                from: function (newFrom, oldFrom) {
                        //console.log(Date.parse(newFrom))
                },
                to: function (newTo, oldTo) {
                        //console.log(Date.parse(newTo))
                },
        },
        computed: {
         		//TODO ACTUAL FILTER
                filteredAds: function () {
                        return this.ads.filter((ad) => {
                                //TODO: actual filter
                                if((this.regions_dict[ad.location] || this.checkAll(0)==1 || this.checkAll(0) == -1) && (this.checkBreeds(ad) || this.checkAll(1)==1 || this.checkAll(1) == -1) && (!this.from || this.from<=ad.dateNeeded) && (!this.to || this.to>ad.dateNeeded)) return true
                                /*if ( this.checkBreeds(ad)){
                                        return true;
                                }*/
                                return false;
                        });
                },
        },
        methods: {
                
                onClickBreed: function (e) {
                        
                        if(this.checkAll(1)==0) {
                                //console.log(e.target.id)
                                
                                this.breeds_dict[e.target.id] = !this.breeds_dict[e.target.id];
                                console.log(this.checkAll(1))
                                if(this.checkAll(1)==-1) this.setAllTrue(1);
                        }else{
                                this.resetAll(1);
                                this.breeds_dict[e.target.id] = !this.breeds_dict[e.target.id];
                        }
                        console.log(this.breeds_dict)
                },
                onClickReg: function (e) {
                        //TODO PREVER CE JE KUL
                        if(this.checkAll(0)==0) {
                                this.regions_dict[e.target.id] = !this.regions_dict[e.target.id];
                                if(this.checkAll(0)==-1) this.setAllTrue(0);
                        }else{
                                this.resetAll(0);
                                this.regions_dict[e.target.id] = !this.regions_dict[e.target.id];
                        }
                       
                },
                checkBreeds(ad){
                        //console.log(ad.dogs)
                        for(const i in ad.dogs){
                                //console.log(i)
                                if(this.breeds_dict[ad.dogs[i].breed]){
                                        return true;
                                }
                        }
                        return false
                },
                //return: -1 all false, 1 all true, 0 mixed
                checkAll(dicta) {
                        //regions
                        let cnt = 0;
                        if (dicta === 0) {
                                for (const i in this.regions_dict) {
                                        if (!this.regions_dict[i]) {
                                                cnt++;
                                        }
                                }
                                if (cnt == this.regions.length){
                                        return -1;
                                }else if(cnt == 0){
                                        return 1;
                                }else{
                                        return 0;
                                }
                        } else {
                                for (const i in this.breeds_dict) {
                                        if (!this.breeds_dict[i]) {
                                                cnt++;
                                        }
                                }
                                if (cnt == this.breeds.length){
                                        return -1;
                                }else if(cnt == 0){
                                        return 1;
                                }else{
                                        return 0;
                                }
                        }
                },
                setAllTrue(dicta){
                        if (dicta === 0) {
                                //console.log("setting regs")
                                for (const i in this.regions_dict) {
                                        this.regions_dict[i] = true;
                                }
                        } else {
                                //console.log("setting breeds")
                                for (const i in this.breeds_dict) {
                                        this.breeds_dict[i] = true;
                                }
                        }
                },
                resetAll(dicta){
                        if (dicta === 0) {
                                for (const i in this.regions_dict) {
                                        this.regions_dict[i] = !this.regions_dict[i];
                                }
                        } else {
                                for (const i in this.breeds_dict) {
                                        this.breeds_dict[i] = !this.breeds_dict[i];
                                }
                        }
                }
        },
};
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
#home

.option
  input[type=checkbox]
    display: none
    & + label
      display: block
      cursor: pointer
      &:hover
        background-color: red
    &:checked + label
      background-color: #6ec43b
      margin: 0.1em

#intro
  background: #6ec43b
  color: #FFFFFF
  height: 6em
  text-align: center
$filter-width: 12em
#cont
  padding-left: $filter-width
  position: relative
#filter
  width: $filter-width
  position: absolute
  left: 0
  top: 0
  padding: 1em
  .row label > input, fieldset
    display: block
    border: .2em solid #F1F1F1
  fieldset
    max-height: 5em
    overflow-y: auto
    
</style>
